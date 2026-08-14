import type {
  AppState, FamiliarityKey, FamiliarityProfile, MobilityProfile, RouteOption, ScenarioId,
  TcoAssumptions, TcoBreakdown, VehicleFitResult, VehicleProfile,
} from '../types'

const unfamiliarPenalty: Partial<Record<FamiliarityKey, number>> = {
  expressway: 3, elevatedRoad: 3, highway: 3, complexLaneChange: 2, highwayMerge: 2, parking: 2,
}

export function calculateRouteDifficulty(route: RouteOption, familiarity: FamiliarityProfile, weather: string) {
  let score = route.complexInterchanges * 3
  if (route.laneChangeComplexity === 'high') score += 4
  if (route.laneChangeComplexity === 'medium') score += 2
  if (route.parkingComplexity === 'hard') score += 2
  if (route.tunnelCount > 0 && familiarity.nightDriving !== 'familiar') score += 1
  if (route.highwayDistance > 0 && familiarity.expressway !== 'familiar') score += unfamiliarPenalty.expressway ?? 0
  if (weather.includes('雨') && familiarity.rainDriving !== 'familiar') score += 3
  score -= Math.round(route.familiarRoadRatio / 25)
  return Math.max(1, score)
}

export function getAssistanceLevel(status: FamiliarityProfile[FamiliarityKey]): 1 | 2 | 3 {
  if (status === 'familiar') return 1
  if (status === 'completed_independently') return 2
  return 3
}

export function recommendRoute(routes: RouteOption[], state: AppState) {
  return routes.reduce((best, route) => {
    const preference = state.user.mobility.routePreference
    const current = calculateRouteDifficulty(route, state.familiarity, state.journey.weather)
      - (route.familiarRoadRatio / 100) * (preference.familiar / 20)
      + (route.duration / 10) * (preference.fastest < 50 ? 0.6 : 0.25)
    const bestScore = calculateRouteDifficulty(best, state.familiarity, state.journey.weather)
      - (best.familiarRoadRatio / 100) * (preference.familiar / 20)
      + (best.duration / 10) * (preference.fastest < 50 ? 0.6 : 0.25)
    return current < bestScore ? route : best
  }, routes[0])
}

export const defaultTcoAssumptions: TcoAssumptions = {
  annualMileageKm: 18000,
  ownershipYears: 5,
  parkingMonthly: 150,
  electricityPrice: 0.8,
  fuelPrice: 8.1,
  insuranceRate: 0.0245,
  financeRate: 0.035,
  downPaymentRatio: 0.3,
}

const depreciationRate: Record<VehicleProfile['powerType'], number> = { ev: 0.37, hybrid: 0.4, oil: 0.42 }

export function calculateDetailedTCO(vehicle: VehicleProfile, input: Partial<TcoAssumptions> = {}): TcoBreakdown {
  const assumptions = { ...defaultTcoAssumptions, ...input }
  const years = Math.max(1, assumptions.ownershipYears)
  const annualEnergy = vehicle.powerType === 'ev'
    ? assumptions.annualMileageKm * (vehicle.fuelConsumption / 100) * assumptions.electricityPrice
    : assumptions.annualMileageKm * (vehicle.fuelConsumption / 100) * assumptions.fuelPrice
  const insuranceAnnual = Math.max(4200, vehicle.price * assumptions.insuranceRate)
  const financeTotal = vehicle.price * (1 - assumptions.downPaymentRatio) * assumptions.financeRate * Math.min(years, 3)
  const maintenanceAnnual = vehicle.powerType === 'ev' ? 1200 : vehicle.powerType === 'hybrid' ? 1800 : 2600
  const wearAnnual = vehicle.bodyType === 'suv' ? 1800 : 1500
  const parkingAnnual = assumptions.parkingMonthly * 12
  const taxRegistration = vehicle.powerType === 'oil' ? vehicle.price * 0.085 + 800 : 800
  const depreciation = vehicle.price * depreciationRate[vehicle.powerType]
  const runningAnnual = insuranceAnnual + annualEnergy + parkingAnnual + maintenanceAnnual + wearAnnual + financeTotal / years
  const fiveYearTco = taxRegistration + runningAnnual * years + depreciation
  const firstYearCash = taxRegistration + runningAnnual + depreciation / years
  return {
    purchase: Math.round(vehicle.price),
    taxRegistration: Math.round(taxRegistration),
    insurance: Math.round(insuranceAnnual),
    finance: Math.round(financeTotal / years),
    energy: Math.round(annualEnergy),
    parking: Math.round(parkingAnnual),
    maintenance: Math.round(maintenanceAnnual),
    wear: Math.round(wearAnnual),
    depreciation: Math.round(depreciation),
    firstYearCash: Math.round(firstYearCash),
    monthlyAverage: Math.round(fiveYearTco / years / 12),
    fiveYearTco: Math.round(fiveYearTco),
    totalOwnershipCost: Math.round(vehicle.price + fiveYearTco),
  }
}

// Kept for v3 callers and external demos.
export function calculateTCO(vehiclePrice: number, powerType: string, yearlyKm = 12000) {
  const vehicle: VehicleProfile = {
    id: 'compat', brand: '', model: '', trim: '', year: 2025, powerType: powerType as VehicleProfile['powerType'],
    bodyType: 'sedan', width: 1850, length: 4700, range: 600,
    fuelConsumption: powerType === 'ev' ? 13 : 6.8, recommendedTirePressure: '', manualEntries: [], price: vehiclePrice,
  }
  const detail = calculateDetailedTCO(vehicle, { annualMileageKm: yearlyKm })
  return { ...detail, monthly: detail.monthlyAverage, firstYear: detail.firstYearCash, fiveYear: detail.fiveYearTco }
}

const scenarioWeight: Record<ScenarioId, Record<string, number>> = {
  commute: { model3: 12, lil6: 6, zeekr007: 9, camry: 9, id4: 8, corolla: 7 },
  family: { model3: 5, lil6: 14, zeekr007: 7, camry: 9, id4: 11, corolla: 9 },
  roadtrip: { model3: 8, lil6: 14, zeekr007: 10, camry: 12, id4: 7, corolla: 10 },
  rideHailing: { model3: 12, lil6: 5, zeekr007: 11, camry: 12, id4: 7, corolla: 8 },
  camping: { model3: 5, lil6: 14, zeekr007: 8, camry: 6, id4: 12, corolla: 10 },
}

const vehicleBase: Record<string, number> = { model3: 46, lil6: 50, zeekr007: 44, camry: 40, id4: 39, corolla: 40 }

function budgetFit(vehicle: VehicleProfile, profile: MobilityProfile) {
  const ceiling = profile.purchaseBudget ?? 250000
  const ideal = profile.idealBudget ?? ceiling * 0.82
  if (vehicle.price > ceiling) return Math.max(-12, -Math.round((vehicle.price - ceiling) / 10000) * 2)
  const distance = Math.abs(vehicle.price - ideal) / Math.max(ideal, 1)
  return Math.max(3, Math.round(10 - distance * 14))
}

function explain(vehicle: VehicleProfile, profile: MobilityProfile, scenario: ScenarioId, tco: TcoBreakdown) {
  const isFamily = profile.passengerPattern.length >= 2 || profile.usageTypes.includes('家庭出行')
  const homeCharge = profile.homeCharging === true
  const fit = [
    vehicle.powerType === 'ev' && homeCharge ? '通勤成本很低，家充条件匹配' : vehicle.powerType === 'hybrid' ? '补能弹性高，长途无需额外规划' : '补能网络成熟，上手负担低',
    vehicle.bodyType === 'suv' && isFamily ? '空间宽敞，家庭出行更舒适' : '车身尺寸适中，城市停车更轻松',
    tco.monthlyAverage <= (profile.monthlyCarBudget ?? 5000) ? '月均成本处于你的希望上限内' : '五年成本结构清晰，可继续调整假设',
  ]
  const tradeoffs = [
    ...(vehicle.compromises ?? []).slice(0, 2),
    vehicle.powerType === 'ev' && !homeCharge ? '没有家充时，每周需额外安排公共补能' : '',
    vehicle.width > 1900 ? '车身尺寸较大，狭窄车位需要适应' : '',
  ].filter(Boolean) as string[]
  const friction = vehicle.powerType === 'ev' && !homeCharge
    ? '无家充会增加每周补能安排。'
    : vehicle.width > 1900 ? '当前车位偏小，第一次停车建议打开 360° 影像。' : '第一年主要适应车辆尺寸与补能节奏。'
  const reality = scenario === 'roadtrip'
    ? `${profile.longTripFrequency}长途时，预计每次需要提前规划 ${vehicle.powerType === 'ev' ? '1–2 个补能点' : '休息与加油点'}。`
    : `按年行驶 ${profile.annualMileageKm.toLocaleString()} km，五年使用成本约 ¥${tco.fiveYearTco.toLocaleString()}。`
  return { fit, tradeoffs: tradeoffs.slice(0, 3), friction, reality }
}

export function rankVehicles(
  vehicles: VehicleProfile[], profile: MobilityProfile, familiarity: FamiliarityProfile,
  scenario: ScenarioId, assumptions: TcoAssumptions,
): VehicleFitResult[] {
  return vehicles.map(vehicle => {
    const tco = calculateDetailedTCO(vehicle, assumptions)
    const isFamily = profile.passengerPattern.length >= 2 || profile.usageTypes.includes('家庭出行')
    const energyFit = vehicle.powerType === 'ev'
      ? profile.homeCharging ? 7 : -5
      : vehicle.powerType === 'hybrid' ? 5 : 2
    const passengerFit = isFamily ? (vehicle.bodyType === 'suv' ? 6 : 3) : 4
    const parkingFit = profile.parkingType.includes('小') ? (vehicle.width <= 1880 ? 5 : vehicle.width > 1930 ? -2 : 2) : 3
    const longTripFit = profile.longTripFrequency.includes('月') ? (vehicle.powerType === 'hybrid' ? 5 : vehicle.range >= 600 ? 3 : 0) : 2
    const familiarityFit = familiarity.parking === 'familiar' ? 2 : vehicle.width > 1900 ? -3 : 1
    const costFit = tco.monthlyAverage <= (profile.monthlyCarBudget ?? 5000) ? 5 : -3
    const score = Math.max(45, Math.min(96, Math.round(
      (vehicleBase[vehicle.id] ?? 42) + budgetFit(vehicle, profile) + (scenarioWeight[scenario][vehicle.id] ?? 6)
      + energyFit + passengerFit + parkingFit + longTripFit + familiarityFit + costFit,
    )))
    const copy = explain(vehicle, profile, scenario, tco)
    return {
      vehicle, score, fit: copy.fit, tradeoffs: copy.tradeoffs,
      bestScenarios: vehicle.bodyType === 'suv' ? ['家庭出行', '长途出行'] : ['日常通勤', '城市出行'],
      friction: copy.friction, fiveYearReality: copy.reality,
      scenarioScores: {
        commute: Math.min(98, score + (vehicle.bodyType === 'sedan' ? 3 : -5)),
        roadtrip: Math.min(98, score + (vehicle.powerType === 'hybrid' ? 8 : -5)),
        family: Math.min(98, score + (vehicle.bodyType === 'suv' ? 8 : -4)),
        cost: Math.min(98, score + (vehicle.price < (profile.idealBudget ?? 250000) ? 5 : -3)),
      },
      tco,
    }
  }).sort((a, b) => b.score - a.score)
}

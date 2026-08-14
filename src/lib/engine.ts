import type { AppState, FamiliarityKey, FamiliarityProfile, RouteOption } from '../types'

const unfamiliarPenalty: Partial<Record<FamiliarityKey, number>> = {
  expressway: 3,
  elevatedRoad: 3,
  highway: 3,
  complexLaneChange: 2,
  highwayMerge: 2,
  parking: 2,
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
    const current = calculateRouteDifficulty(route, state.familiarity, state.journey.weather)
    const bestScore = calculateRouteDifficulty(best, state.familiarity, state.journey.weather)
    return current < bestScore ? route : best
  }, routes[0])
}

export function calculateTCO(vehiclePrice: number, powerType: string, yearlyKm = 12000) {
  const energy = powerType === 'ev' ? yearlyKm * 0.15 * 0.8 : yearlyKm * 0.068 * 8.1
  const insurance = Math.max(4200, vehiclePrice * 0.035)
  const maintenance = powerType === 'ev' ? 1200 : 2600
  const parking = 7200
  const depreciation = vehiclePrice * 0.13
  const firstYear = vehiclePrice + insurance + energy + maintenance + parking
  const fiveYear = vehiclePrice + (insurance + energy + maintenance + parking) * 5 + depreciation * 4
  return { monthly: Math.round((insurance + energy + maintenance + parking + depreciation) / 12), firstYear: Math.round(firstYear), fiveYear: Math.round(fiveYear) }
}

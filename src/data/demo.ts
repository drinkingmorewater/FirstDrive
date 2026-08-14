import type {
  AppState, FamiliarityKey, FamiliarityProfile, FamiliarityStatus, MobilityProfile,
  PersonaId, RehearsalPoint, RouteOption, UserProfile, VehicleProfile,
} from '../types'

export const statusMeta: Record<FamiliarityStatus, { label: string; className: string }> = {
  unexperienced: { label: '未经历', className: 'status-unexperienced' },
  want_to_prepare: { label: '希望先了解', className: 'status-prepare' },
  accompanied: { label: '有人陪同完成', className: 'status-accompanied' },
  completed_independently: { label: '已独立完成', className: 'status-independent' },
  familiar: { label: '已熟悉', className: 'status-familiar' },
}

export const familiarityLabels: Record<FamiliarityKey, string> = {
  cityRoad: '城市普通道路', heavyTraffic: '拥堵道路', expressway: '快速路', elevatedRoad: '高架',
  highway: '高速', mountainRoad: '山路', narrowRoad: '狭窄道路', nightDriving: '夜间',
  rainDriving: '雨天', snowDriving: '雪天', parking: '停车', reverseParking: '倒车入库',
  complexLaneChange: '连续变道', highwayMerge: '高速汇入', fueling: '加油', charging: '充电',
}

export const routeOptions: RouteOption[] = [
  {
    id: 'A', duration: 31, distance: 22, complexInterchanges: 3, laneChangeComplexity: 'high',
    highwayDistance: 8, tunnelCount: 1, narrowRoadDistance: 1.2, familiarRoadRatio: 34,
    parkingComplexity: 'hard', difficultyScore: 13,
    factors: [
      { label: '3 个复杂立交', tone: 'risk' },
      { label: '4 次高难度变道', tone: 'risk' },
      { label: '医院南门地库入口复杂', tone: 'caution' },
    ],
  },
  {
    id: 'B', duration: 36, distance: 24, complexInterchanges: 1, laneChangeComplexity: 'medium',
    highwayDistance: 5, tunnelCount: 0, narrowRoadDistance: 0, familiarRoadRatio: 70,
    parkingComplexity: 'easy', difficultyScore: 5,
    factors: [
      { label: '1 个复杂立交', tone: 'caution' },
      { label: '1 次中等变道', tone: 'caution' },
      { label: '70% 熟悉道路', tone: 'familiar' },
      { label: '北门停车更简单', tone: 'familiar' },
    ],
  },
]

export const rehearsalPoints: RehearsalPoint[] = [
  {
    id: 'expressway', time: '08:18', title: '第一次进入快速路', distance: '约 1 km', kind: 'merge',
    coreReminder: '在入口前 500 米保持右侧车道，确认后方安全后平稳汇入。',
    preparation: '距离入口约 1 km 开始准备',
    tips: ['入口后限速 80 km/h', '汇入后保持稳定车速', '错过入口也不要突然变道'],
  },
  {
    id: 'elevated', time: '08:27', title: '高架分流', distance: '约 9 km', kind: 'split',
    coreReminder: '分流前 800 米保持中间车道，看清“北城方向”标牌后再向右。',
    preparation: '距离分流约 1.5 km 开始观察标牌',
    tips: ['不要连续跨越两条车道', '走错可在下一出口调整', '分流后保持当前车道'],
  },
  {
    id: 'parking', time: '08:41', title: '医院北门停车入口', distance: '约 21 km', kind: 'parking',
    coreReminder: '经过北门后 120 米右转进入地面停车区，入口在公交站之后。',
    preparation: '接近医院前约 600 米降低车速',
    tips: ['优先进入地面停车区', '留意行人与非机动车', '入口错过后继续直行绕行'],
  },
]

export const vehicles: VehicleProfile[] = [
  {
    id: 'model3', brand: '特斯拉', model: 'Model 3', trim: '2024 款 后轮驱动版', year: 2024,
    powerType: 'ev', bodyType: 'sedan', width: 1850, length: 4720, range: 606,
    fuelConsumption: 11.9, recommendedTirePressure: '前 2.9 / 后 2.9 bar',
    manualEntries: ['充电口位于左后尾灯', '无备胎，配补胎液'], price: 259900,
    image: '/cars/model-3.webp', seats: 5, category: '纯电动 · 中型车',
    strengths: ['通勤成本很低', '能耗与性能表现领先', '品牌保值率高'],
    compromises: ['后排坐垫偏短', '悬架偏运动', '内饰极简'],
  },
  {
    id: 'lil6', brand: '理想', model: 'L6', trim: '2024 款 Pro 智能焕新版', year: 2024,
    powerType: 'hybrid', bodyType: 'suv', width: 1960, length: 4925, range: 1390,
    fuelConsumption: 6.9, recommendedTirePressure: '前 2.5 / 后 2.5 bar',
    manualEntries: ['支持增程纯电优先', '车宽 1960 mm'], price: 279800,
    image: '/cars/li-l6.webp', seats: 5, category: '增程式 · 中大型 SUV',
    strengths: ['家庭空间宽敞', '增程无里程焦虑', '舒适配置丰富'],
    compromises: ['能耗高于纯电', '车身尺寸较大', '价格相对更高'],
  },
  {
    id: 'zeekr007', brand: '极氪', model: '007', trim: '2024 款 后驱智驾版 75kWh', year: 2024,
    powerType: 'ev', bodyType: 'sedan', width: 1900, length: 4865, range: 688,
    fuelConsumption: 12.6, recommendedTirePressure: '前 2.6 / 后 2.6 bar',
    manualEntries: ['800V 高压平台', '充电口位于左后侧'], price: 229900,
    image: '/cars/zeekr-007.webp', seats: 5, category: '纯电动 · 中型车',
    strengths: ['续航扎实', '补能效率高', '价格更低'],
    compromises: ['品牌保值率较低', '后排头部空间一般', '售后网点较少'],
  },
  {
    id: 'camry', brand: '丰田', model: '凯美瑞双擎', trim: '2025 款 2.0HG 尊贵版', year: 2025,
    powerType: 'hybrid', bodyType: 'sedan', width: 1840, length: 4915, range: 960,
    fuelConsumption: 4.2, recommendedTirePressure: '前 2.4 / 后 2.4 bar',
    manualEntries: ['无需外接充电', '油电混合系统'], price: 209800, seats: 5, category: '油电混动 · 中型车',
    strengths: ['长期可靠', '能耗稳定', '保养体系成熟'], compromises: ['智能座舱一般', '动力平顺但不强', '后排地台凸起'],
  },
  {
    id: 'id4', brand: '大众', model: 'ID.4 X', trim: '2025 款 纯净长续航版', year: 2025,
    powerType: 'ev', bodyType: 'suv', width: 1852, length: 4612, range: 601,
    fuelConsumption: 14.4, recommendedTirePressure: '前 2.5 / 后 2.7 bar',
    manualEntries: ['交流充电口位于右后侧', '支持预约充电'], price: 189800, seats: 5, category: '纯电动 · 紧凑型 SUV',
    strengths: ['车身尺寸适中', '底盘舒适', '终端价格友好'], compromises: ['车机反应一般', '快充速度中等', '后排座椅偏直'],
  },
  {
    id: 'corolla', brand: '丰田', model: '锋兰达', trim: '2024 款 2.0L 豪华版', year: 2024,
    powerType: 'oil', bodyType: 'suv', width: 1825, length: 4485, range: 650,
    fuelConsumption: 6.8, recommendedTirePressure: '前 2.3 / 后 2.3 bar',
    manualEntries: ['ACC 位于方向盘右侧', '三角警示牌在后备箱盖板下'], price: 128000,
    seats: 5, category: '燃油 · 紧凑型 SUV', strengths: ['价格低', '停车相对容易', '维修网络广'], compromises: ['动力一般', '高速噪音明显', '智能化较少'],
  },
]

const baseFamiliarity: FamiliarityProfile = {
  cityRoad: 'familiar', heavyTraffic: 'completed_independently', expressway: 'want_to_prepare',
  elevatedRoad: 'unexperienced', highway: 'accompanied', mountainRoad: 'unexperienced', narrowRoad: 'want_to_prepare',
  nightDriving: 'want_to_prepare', rainDriving: 'accompanied', snowDriving: 'unexperienced', parking: 'familiar',
  reverseParking: 'completed_independently', complexLaneChange: 'unexperienced', highwayMerge: 'accompanied',
  fueling: 'familiar', charging: 'unexperienced',
}

const buyerMobility: MobilityProfile = {
  city: '上海', licenseYears: 3, actualDrivingYears: 1, drivingFrequency: '每周 3–4 次',
  dailyCommuteKm: 18, commuteMinutes: 45, commuteDaysPerWeek: 5, annualMileageKm: 18000,
  passengerPattern: ['伴侣', '1 名儿童'], usageTypes: ['日常通勤', '家庭出行'],
  parkingType: '小区固定车位', homeCharging: true, publicChargingConvenience: '方便',
  longTripFrequency: '每月 1–2 次', vehiclePriorities: ['舒适', '安全', '总拥有成本'],
  purchaseBudget: 350000, idealBudget: 280000, monthlyCarBudget: 5200, monthlyIncome: 25000,
  plannedOwnershipYears: 5,
  routePreference: { fastest: 46, familiar: 72, easy: 82, lowStress: 86 },
  assistancePreference: { level: 'balanced', advanceNoticeMinutes: 4, voiceEnabled: true },
}

const practiceMobility: MobilityProfile = {
  ...buyerMobility, city: '上海', licenseYears: 12, actualDrivingYears: 1, drivingFrequency: '一年只开几次',
  dailyCommuteKm: 12, commuteMinutes: 38, annualMileageKm: 7000, passengerPattern: ['伴侣'],
  usageTypes: ['偶尔代步', '周末自驾'], homeCharging: null, publicChargingConvenience: '一般',
  longTripFrequency: '每季度 1 次', purchaseBudget: 220000, idealBudget: 180000, monthlyCarBudget: 3600,
  vehiclePriorities: ['安全', '容易驾驶', '维修成本'],
  assistancePreference: { level: 'guided', advanceNoticeMinutes: 8, voiceEnabled: true },
}

const roadTripMobility: MobilityProfile = {
  ...buyerMobility, city: '北京', licenseYears: 6, actualDrivingYears: 5, drivingFrequency: '几乎每天',
  dailyCommuteKm: 25, commuteMinutes: 55, annualMileageKm: 26000, passengerPattern: ['伴侣'],
  usageTypes: ['日常通勤', '长途旅行', '露营'], parkingType: '固定车位', homeCharging: true,
  publicChargingConvenience: '非常方便', longTripFrequency: '每月 2–3 次', purchaseBudget: 320000,
  idealBudget: 260000, monthlyCarBudget: 6200, vehiclePriorities: ['长途', '补能', '舒适'],
  routePreference: { fastest: 65, familiar: 64, easy: 70, lowStress: 84 },
  assistancePreference: { level: 'balanced', advanceNoticeMinutes: 5, voiceEnabled: true },
}

function userFor(personaId: PersonaId, mobility: MobilityProfile): UserProfile {
  const config = {
    buyer: { id: 'buyer-hannah', name: 'Hannah', vehicleId: 'model3', time: '白天' },
    practice: { id: 'practice-lin', name: '林澈', vehicleId: 'corolla', time: '白天' },
    roadtrip: { id: 'roadtrip-qiao', name: '乔屿', vehicleId: 'zeekr007', time: '不限' },
  }[personaId]
  return {
    id: config.id, name: config.name, personaId, mobility,
    city: mobility.city, drivingYears: mobility.licenseYears, actualDrivingFrequency: mobility.drivingFrequency,
    preferredDrivingTime: config.time, vehicleId: config.vehicleId, assistanceLevel: mobility.assistancePreference.level,
  }
}

function familiarityFor(personaId: PersonaId): FamiliarityProfile {
  if (personaId === 'buyer') return { ...baseFamiliarity, elevatedRoad: 'completed_independently', expressway: 'familiar', highway: 'accompanied', charging: 'want_to_prepare' }
  if (personaId === 'roadtrip') return { ...baseFamiliarity, expressway: 'familiar', elevatedRoad: 'familiar', highway: 'completed_independently', charging: 'familiar', nightDriving: 'completed_independently' }
  return { ...baseFamiliarity }
}

export function createDemoState(personaId: PersonaId = 'buyer'): AppState {
  const mobility = structuredClone(personaId === 'buyer' ? buyerMobility : personaId === 'practice' ? practiceMobility : roadTripMobility)
  const user = userFor(personaId, mobility)
  const vehicle = vehicles.find(item => item.id === user.vehicleId) ?? vehicles[0]
  return {
    version: 5,
    onboardingStatus: 'new',
    profileIntake: { transcript: '', draft: null, answers: {}, confirmed: false },
    coachMarksSeen: [],
    activeTaskId: null,
    user,
    familiarity: familiarityFor(personaId),
    vehicle,
    journey: { origin: '家', destination: '浦东嘉里医院', departureTime: '今天 08:00', weather: '小雨', routeOptions, selectedRoute: null, rehearsalPoints, completionStatus: 'draft' },
    memory: {
      completedScenarios: personaId === 'practice' ? ['城市普通道路', '停车', '加油'] : ['城市普通道路', '快速路', '停车', '充电'],
      journeys: [{ route: '家 → 商场', date: '2026/08/10 18:20', distance: 18, duration: 38 }],
      vehicles: [`${vehicle.brand} ${vehicle.model}`], maintenance: ['上次保养 45 天前'], expenses: [],
      confidence: personaId === 'practice' ? 62 : 78,
      person: { learnedPreferences: ['更偏好容易驾驶的路线', '希望复杂节点提前说明'], lastUpdated: '2026/08/14' },
      familiarity: { completedFirsts: ['第一次独立快速路'], assistanceReductions: 1 },
      vehicle: { maintenanceRecords: ['2026/06/30 常规保养'], deliveryRecords: [], usedCarReports: [], firstDriveCompleted: [] },
      journey: { routeChoices: [{ mode: 'Easy', count: 3 }], roadTrips: personaId === 'roadtrip' ? ['北京 → 承德'] : [], roadTripPlans: [] },
      cost: { savedPlans: [], totalTracked: 0 }, incident: { records: [] },
      rental: { sessions: [] },
      timeline: [
        { id: 'm1', date: '2026/08/12', domain: 'familiarity', title: '第一次独立快速路', detail: '完成 18 km，下一次减少入口基础提醒。' },
        { id: 'm2', date: '2026/08/10', domain: 'journey', title: '选择更简单路线', detail: '系统学习到 lowStress 偏好。' },
      ],
    },
    buySession: {
      scenario: personaId === 'roadtrip' ? 'roadtrip' : 'commute', energyFilter: 'all', bodyFilter: 'all', selectedVehicleId: 'model3',
      assumptions: { annualMileageKm: mobility.annualMileageKm, ownershipYears: mobility.plannedOwnershipYears ?? 5, parkingMonthly: 150, electricityPrice: 0.8, fuelPrice: 8.1, insuranceRate: 0.0245, financeRate: 0.035, downPaymentRatio: 0.3 },
    },
    mockMode: true, agentEvents: [], proactiveEvents: [],
    liveContext: { progress: 0, speed: 68, distanceRemaining: 24, etaMinutes: 36, weather: '小雨', fuel: 42, currentRoad: '晨昌路', nextManeuver: '进入北辰西路高架', nextManeuverDistance: 8, routeVersion: 1, paused: false },
  }
}

export const personaSummaries: Array<{ id: PersonaId; label: string; note: string }> = [
  { id: 'buyer', label: 'Persona B · Hannah', note: '第一次买车 · 上海通勤家庭' },
  { id: 'practice', label: 'Persona A · 林澈', note: '拿证 12 年 · 很少实际驾驶' },
  { id: 'roadtrip', label: 'Persona C · 乔屿', note: '新能源车主 · 第一次长途' },
]

export const demoState = createDemoState('buyer')

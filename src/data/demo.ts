import type { AppState, FamiliarityKey, FamiliarityStatus, RehearsalPoint, RouteOption, VehicleProfile } from '../types'

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
  rainDriving: '雨天', snowDriving: '雪天', parking: '停车', reverseParking: '倒车',
  complexLaneChange: '复杂变道', highwayMerge: '高速汇入', fueling: '加油', charging: '充电',
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
    tips: ['不要连续跨越两条车道', '车辆走错可在下一出口调整', '分流后保持当前车道'],
  },
  {
    id: 'parking', time: '08:41', title: '医院北门停车入口', distance: '约 21 km', kind: 'parking',
    coreReminder: '经过北门后 120 米右转进入地面停车区，入口在公交站之后。',
    preparation: '接近医院前约 600 米降低车速',
    tips: ['优先进入地面停车区', '留意行人与非机动车', '入口错过后继续直行绕行'],
  },
]

export const vehicles: VehicleProfile[] = [
  { id: 'v1', brand: '丰田', model: '锋兰达 2.0L', year: 2024, powerType: 'oil', bodyType: 'suv', width: 1825, length: 4485, range: 650, fuelConsumption: 6.8, recommendedTirePressure: '前 2.3 / 后 2.3 bar', manualEntries: ['ACC 位于方向盘右侧', '三角警示牌在后备箱盖板下', '随车配有补胎工具包'], price: 128000 },
  { id: 'v2', brand: '比亚迪', model: '宋 PLUS DM-i', year: 2025, powerType: 'hybrid', bodyType: 'suv', width: 1890, length: 4775, range: 1250, fuelConsumption: 4.5, recommendedTirePressure: '前 2.5 / 后 2.5 bar', manualEntries: ['支持外放电', '随车充电枪位于后备箱'], price: 149800 },
  { id: 'v3', brand: '大众', model: 'ID.3', year: 2025, powerType: 'ev', bodyType: 'sedan', width: 1778, length: 4261, range: 450, fuelConsumption: 13.1, recommendedTirePressure: '前 2.5 / 后 2.7 bar', manualEntries: ['交流充电口位于右后侧', '无备胎，配补胎液'], price: 139900 },
  { id: 'v4', brand: '本田', model: '雅阁 e:PHEV', year: 2025, powerType: 'hybrid', bodyType: 'sedan', width: 1862, length: 4980, range: 1180, fuelConsumption: 4.9, recommendedTirePressure: '前 2.4 / 后 2.4 bar', manualEntries: ['车身较长，停车需预留空间'], price: 225800 },
  { id: 'v5', brand: '吉利', model: '星越 L', year: 2025, powerType: 'oil', bodyType: 'suv', width: 1895, length: 4770, range: 720, fuelConsumption: 7.7, recommendedTirePressure: '前 2.4 / 后 2.4 bar', manualEntries: ['配备 360° 全景影像'], price: 155200 },
  { id: 'v6', brand: '特斯拉', model: 'Model 3', year: 2025, powerType: 'ev', bodyType: 'sedan', width: 1850, length: 4720, range: 634, fuelConsumption: 11.9, recommendedTirePressure: '前 2.9 / 后 2.9 bar', manualEntries: ['充电口位于左后尾灯', '无备胎'], price: 235500 },
]

export const demoState: AppState = {
  user: { id: 'demo-user', name: '林澈', city: '上海', drivingYears: 12, actualDrivingFrequency: '很少实际驾驶', preferredDrivingTime: '白天', vehicleId: 'v1', assistanceLevel: 'guided' },
  familiarity: {
    cityRoad: 'familiar', heavyTraffic: 'completed_independently', expressway: 'want_to_prepare',
    elevatedRoad: 'unexperienced', highway: 'accompanied', mountainRoad: 'unexperienced', narrowRoad: 'want_to_prepare',
    nightDriving: 'want_to_prepare', rainDriving: 'accompanied', snowDriving: 'unexperienced', parking: 'familiar',
    reverseParking: 'completed_independently', complexLaneChange: 'unexperienced', highwayMerge: 'accompanied',
    fueling: 'familiar', charging: 'unexperienced',
  },
  vehicle: vehicles[0],
  journey: { origin: '家', destination: '浦东嘉里医院', departureTime: '今天 08:00', weather: '小雨', routeOptions, selectedRoute: null, rehearsalPoints, completionStatus: 'draft' },
  memory: { completedScenarios: ['城市普通道路', '停车', '加油'], journeys: [{ route: '家 → 商场', date: '2026/08/10 18:20', distance: 18, duration: 38 }], vehicles: ['丰田 锋兰达 2.0L'], maintenance: ['上次保养 45 天前'], expenses: [], confidence: 62 },
  mockMode: true,
  agentEvents: [],
  proactiveEvents: [],
  liveContext: { progress: 0, speed: 68, distanceRemaining: 24, etaMinutes: 36, weather: '小雨', fuel: 42, currentRoad: '晨昌路', nextManeuver: '进入北辰西路高架', nextManeuverDistance: 8, routeVersion: 1, paused: false },
}

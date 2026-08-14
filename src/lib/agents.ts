import type { AppState, FamiliarityStatus } from '../types'

export const readinessToolNames = [
  'getUserProfile', 'getFamiliarityProfile', 'updateFamiliarity', 'searchVehicles',
  'calculateTCO', 'getRouteOptions', 'calculateRouteDifficulty', 'getWeather',
  'getVehicleManual', 'createRehearsal', 'createPreDriveChecklist',
  'updateJourneyMemory', 'getEmergencyWorkflow',
] as const

export function createPreDriveChecklist(state: AppState) {
  const items = [
    `确认胎压符合车辆建议值：${state.vehicle.recommendedTirePressure}`,
    '确认油量足够完成 24 km 行程',
    '提前设置医院北门为到达入口',
    '确认后视镜与座椅位置合适',
    '把手机调至驾驶免打扰模式',
  ]
  if (state.familiarity.expressway !== 'familiar') items.push('回顾快速路汇入与分流节点')
  return items.slice(0, 6)
}

export function updateFamiliarityAfterJourney(state: AppState): AppState {
  const nextStatus: FamiliarityStatus = 'completed_independently'
  return {
    ...state,
    familiarity: { ...state.familiarity, expressway: nextStatus, elevatedRoad: nextStatus },
    journey: { ...state.journey, completionStatus: 'completed' },
    memory: {
      ...state.memory,
      completedScenarios: Array.from(new Set([...state.memory.completedScenarios, '快速路', '高架分流', '独立陌生路线'])),
      journeys: [{ route: '家 → 医院', date: '2026/08/15 08:46', distance: 24, duration: 36 }, ...state.memory.journeys],
    },
  }
}

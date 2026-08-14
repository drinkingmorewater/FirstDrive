import { buildContext } from '../context/ContextBuilder'
import { vehicles } from '../data/demo'
import { calculateDetailedTCO, rankVehicles, recommendRoute } from '../lib/engine'
import type { AppState, FamiliarityKey, FamiliarityStatus, ScenarioId, TcoAssumptions } from '../types'

export const meTools = {
  getProfile: (state: AppState) => buildContext(state).person.profile,
  getFamiliarity: (state: AppState) => buildContext(state).person.familiarity,
  updatePreference: (state: AppState, key: keyof AppState['user']['mobility']['routePreference'], value: number) => ({ ...state.user.mobility.routePreference, [key]: value }),
  updateFamiliarity: (state: AppState, key: FamiliarityKey, status: FamiliarityStatus) => ({ ...state.familiarity, [key]: status }),
  inferAssistanceLevel: (state: AppState) => {
    const context = buildContext(state)
    if (context.person.unfamiliarScenes.length >= 6) return 'guided' as const
    return context.person.profile.assistancePreference.level
  },
}

export const buyTools = {
  searchVehicles: () => vehicles,
  calculateScenarioFit: (state: AppState, scenario: ScenarioId, assumptions: TcoAssumptions) => rankVehicles(vehicles, state.user.mobility, state.familiarity, scenario, assumptions),
  calculateTCO: calculateDetailedTCO,
  parseDeal: (text: string) => {
    const amount = (label: string) => Number(text.match(new RegExp(`${label}[^\\d]*(\\d[\\d,]*)`))?.[1]?.replace(/,/g, '') ?? 0)
    return {
      vehiclePrice: amount('裸车|车价'), insurance: amount('保险'), serviceFee: amount('服务费'), gps: amount('GPS'), registration: amount('上牌'), interest: amount('利息'),
      questions: ['优惠是否绑定贷款或保险？', '贷款总利息和实际年化利率是多少？', '提前还款是否有违约金？', '服务费能否取消？', '保险是否可以自行购买？', '赠品是否写入合同？', '交付日期和逾期责任是什么？'],
    }
  },
  compareOwnershipOptions: (state: AppState) => {
    const km = state.user.mobility.annualMileageKm
    return [
      { id: 'new', label: '买新车', yearly: Math.round(km * 1.55 + 22000), fit: km > 12000 ? 88 : 70 },
      { id: 'used', label: '买二手车', yearly: Math.round(km * 1.4 + 16000), fit: 82 },
      { id: 'rental', label: '继续租车 / 打车', yearly: Math.round(km * 3.2), fit: km < 8000 ? 86 : 58 },
    ]
  },
}

export const readyTools = {
  getRouteOptions: (state: AppState) => state.journey.routeOptions,
  calculateRouteDifficulty: (state: AppState) => recommendRoute(state.journey.routeOptions, state),
  getManualKnowledge: (state: AppState) => state.vehicle.manualEntries,
  createRehearsal: (state: AppState) => state.journey.rehearsalPoints,
  createChecklist: (state: AppState) => [
    `胎压：${state.vehicle.recommendedTirePressure}`,
    state.journey.weather.includes('雨') ? '确认雨刷、灯光与玻璃水' : '确认灯光与视野',
    state.familiarity.expressway !== 'familiar' ? '回顾快速路汇入节点' : '确认目的地停车入口',
  ],
  createPracticePlan: (state: AppState) => ({ recommended: 'A', duration: 25, scene: state.familiarity.elevatedRoad === 'unexperienced' ? '一个简单高架入口' : '一个快速路汇入口' }),
}

export const roadTools = {
  getLiveContext: (state: AppState) => state.liveContext,
  getWeather: (state: AppState) => state.liveContext.weather,
  getEnergy: (state: AppState) => state.liveContext.fuel,
  getNextComplexity: (state: AppState) => state.liveContext.nextManeuver,
  replanRoute: (state: AppState) => ({ ...state.liveContext, routeVersion: 2 as const, etaMinutes: state.liveContext.etaMinutes + 5 }),
  respondToVoice: (state: AppState) => `${state.liveContext.currentRoad}前方${state.liveContext.nextManeuver}，${state.user.mobility.assistancePreference.advanceNoticeMinutes} 分钟前提醒你。`,
}

export const helpTools = {
  getEmergencyWorkflow: () => ['确认人员安全', '移动到安全位置', '拍照记录', '整理保险材料'],
  parseRepairQuote: (text: string) => ({ summary: text || '待上传维修报价', questions: ['故障码是什么？', '是否必须立即更换？', '旧件能否保留？'] }),
  createIncidentRecord: (location: string) => ({ location, status: 'draft' as const }),
  createRentalInspection: () => ['外观损伤', '里程', '油量 / 电量', '保险范围', '归还规则'],
  getAbroadRules: (country: '德国' | '日本' | '英国') => ({ country, updatedAt: '2026-08-14', source: 'Demo public source', drivingSide: country === '德国' ? '右侧通行' : '左侧通行' }),
}

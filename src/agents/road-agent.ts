import { roadTools } from '../tools'
import type { MobilityAgent } from './types'

export const roadAgent: MobilityAgent<{ routeVersion: number; response: string }> = {
  id: 'road', label: 'Road Agent', purpose: '理解实时人车路环境并主动重规划',
  async execute({ state, live, emit }) {
    const current = live ?? roadTools.getLiveContext(state)
    emit({ agent: 'road', status: 'running', title: '正在重新评估前方路线', detail: `${current.nextManeuver}与${current.weather}进入联合判断` })
    await Promise.resolve()
    const replanned = roadTools.replanRoute({ ...state, liveContext: current })
    const response = `已避开复杂立交，新路线 ${replanned.etaMinutes} 分钟，并按${state.user.mobility.assistancePreference.advanceNoticeMinutes}分钟提前量提醒。`
    emit({ agent: 'road', status: 'completed', title: '路线已动态更新', detail: response })
    return { success: true, agent: 'road', task: 'dynamic-replan', data: { routeVersion: replanned.routeVersion, response }, memoryUpdates: [{ domain: 'journey', operation: 'append', path: 'replans', value: replanned.routeVersion }] }
  },
}

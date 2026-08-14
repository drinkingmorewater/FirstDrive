import { readyTools } from '../tools'
import type { MobilityAgent } from './types'

export const readyAgent: MobilityAgent<{ routeId: string; checklist: string[] }> = {
  id: 'ready', label: 'Ready Agent', purpose: '把路线风险提前转化为预演与检查',
  async execute({ state, emit }) {
    emit({ agent: 'ready', status: 'running', title: '正在准备关键路段', detail: `把 ${state.user.name} 的熟悉度加入 ${state.journey.destination} 路线判断` })
    await Promise.resolve()
    const route = readyTools.calculateRouteDifficulty(state)
    const checklist = readyTools.createChecklist(state)
    const detail = `推荐路线 ${route.id}：${route.complexInterchanges} 个复杂立交，${Math.round(route.familiarRoadRatio)}% 熟悉道路。`
    emit({ agent: 'ready', status: 'completed', title: '预演与检查清单已就绪', detail })
    return { success: true, agent: 'ready', task: 'prepare-route', data: { routeId: route.id, checklist }, memoryUpdates: [{ domain: 'journey', operation: 'append', path: 'routeChoices', value: route.id }] }
  },
}

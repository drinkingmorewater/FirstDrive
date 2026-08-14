import type { MobilityAgent } from './types'

export const readyAgent: MobilityAgent = {
  id: 'ready',
  label: 'Ready Agent',
  purpose: '把路线风险提前转化为预演与检查',
  async execute({ state, emit }) {
    emit({ agent: 'ready', status: 'running', title: '正在准备关键路段', detail: '检查 ' + state.journey.destination + ' 沿途复杂点' })
    await Promise.resolve()
    const detail = '识别 1 个高架分流与 1 个停车入口，已生成提前量提醒。'
    emit({ agent: 'ready', status: 'completed', title: '预演与检查清单已就绪', detail })
    return detail
  },
}

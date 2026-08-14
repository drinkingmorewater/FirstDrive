import type { MobilityAgent } from './types'

export const buyAgent: MobilityAgent = {
  id: 'buy',
  label: 'Buy Agent',
  purpose: '把生活条件转译为选车、成本与交易判断',
  async execute({ emit }) {
    emit({ agent: 'buy', status: 'running', title: '正在评估 Life Fit', detail: '综合通勤、家庭、停车与补能条件' })
    await Promise.resolve()
    const detail = '混动 SUV 在当前补能条件下最平衡，五年成本可控，车宽需留意。'
    emit({ agent: 'buy', status: 'completed', title: '用车适配已完成', detail })
    return detail
  },
}

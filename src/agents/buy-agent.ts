import { buyTools } from '../tools'
import type { VehicleFitResult } from '../types'
import type { MobilityAgent } from './types'

export const buyAgent: MobilityAgent<VehicleFitResult[]> = {
  id: 'buy', label: 'Buy Agent', purpose: '把生活条件转译为选车、成本与交易判断',
  async execute({ state, emit }) {
    emit({ agent: 'buy', status: 'running', title: '正在评估 Life Fit', detail: `读取 ${state.user.mobility.city} 的通勤、家庭、停车与补能条件` })
    await Promise.resolve()
    const ranked = buyTools.calculateScenarioFit(state, state.buySession.scenario, state.buySession.assumptions)
    const top = ranked[0]
    const detail = `${top.vehicle.brand} ${top.vehicle.model} 当前适配度 ${top.score}，月均使用成本约 ¥${top.tco.monthlyAverage.toLocaleString()}。`
    emit({ agent: 'buy', status: 'completed', title: 'Life Fit 已实时更新', detail })
    return {
      success: true, agent: 'buy', task: 'life-fit', data: ranked,
      sources: [{ id: 'profile', label: 'My Mobility Passport', type: 'user_input' }, { id: 'vehicle-demo', label: 'Demo 车型数据库', type: 'demo_estimate' }],
      nextActions: [{ id: 'tco', label: '查看 True Cost' }, { id: 'deal', label: '检查报价单' }],
    }
  },
}

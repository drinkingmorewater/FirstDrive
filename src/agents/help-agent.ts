import { helpTools } from '../tools'
import type { MobilityAgent } from './types'

export const helpAgent: MobilityAgent<{ workflow: string[]; vehicleName: string }> = {
  id: 'help', label: 'Help Agent', purpose: '在事故、维修、租车与海外驾驶中一步步协助',
  async execute({ state, emit }) {
    emit({ agent: 'help', status: 'running', title: '已进入事故助手', detail: `已读取 ${state.vehicle.brand} ${state.vehicle.model} 与当前道路位置` })
    await Promise.resolve()
    const workflow = helpTools.getEmergencyWorkflow()
    const detail = `${workflow[0]}后，将继续${workflow.slice(1).join('、')}。完成后写入 Incident Memory。`
    emit({ agent: 'help', status: 'completed', title: '下一步材料清单已生成', detail })
    return { success: true, agent: 'help', task: 'incident-workflow', data: { workflow, vehicleName: `${state.vehicle.brand} ${state.vehicle.model}` }, nextActions: [{ id: 'start', label: '开始安全确认' }] }
  },
}

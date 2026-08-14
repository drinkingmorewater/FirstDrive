import type { MobilityAgent } from './types'

export const helpAgent: MobilityAgent = {
  id: 'help',
  label: 'Help Agent',
  purpose: '在事故、维修、租车与海外驾驶中一步步协助',
  async execute({ emit }) {
    emit({ agent: 'help', status: 'running', title: '已进入事故助手', detail: '当前先确认所有人员处于安全位置' })
    await Promise.resolve()
    const detail = '安全检查完成后，将继续整理照片、对方信息与保险材料。'
    emit({ agent: 'help', status: 'completed', title: '下一步材料清单已生成', detail })
    return detail
  },
}

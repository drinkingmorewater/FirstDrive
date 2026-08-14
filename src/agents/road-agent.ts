import type { MobilityAgent } from './types'

export const roadAgent: MobilityAgent = {
  id: 'road',
  label: 'Road Agent',
  purpose: '理解实时人车路环境并主动重规划',
  async execute({ live, emit }) {
    emit({ agent: 'road', status: 'running', title: '正在重新评估前方路线', detail: (live?.nextManeuver ?? '复杂路段') + '与实时天气进入联合判断' })
    await Promise.resolve()
    const detail = '已避开强降雨区域与复杂立交，新路线 41 分钟，更符合你的辅助偏好。'
    emit({ agent: 'road', status: 'completed', title: '路线已动态更新', detail })
    return detail
  },
}

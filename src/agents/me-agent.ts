import type { MobilityAgent } from './types'

export const meAgent: MobilityAgent = {
  id: 'me',
  label: 'Me Agent',
  purpose: '理解驾驶者、熟悉度与渐进式辅助偏好',
  async execute({ state, emit }) {
    emit({ agent: 'me', status: 'running', title: '正在读取你的驾驶画像', detail: '驾照 ' + state.user.drivingYears + ' 年，但' + state.user.actualDrivingFrequency })
    await Promise.resolve()
    const detail = '快速路希望先了解；高架尚未独立完成。建议采用更多预告、少临场指令。'
    emit({ agent: 'me', status: 'completed', title: '驾驶画像已匹配', detail })
    return detail
  },
}

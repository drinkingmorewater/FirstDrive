import { buildContext } from '../context/ContextBuilder'
import { meTools } from '../tools'
import type { MobilityAgent } from './types'

export interface MeAgentData { summary: string; assistanceLevel: 'quiet' | 'balanced' | 'guided'; nextFirsts: string[] }

export const meAgent: MobilityAgent<MeAgentData> = {
  id: 'me', label: 'Me Agent', purpose: '理解驾驶者、熟悉度与渐进式辅助偏好',
  async execute({ state, emit }) {
    const context = buildContext(state)
    const profile = meTools.getProfile(state)
    emit({ agent: 'me', status: 'running', title: '正在读取你的驾驶画像', detail: `驾照 ${profile.licenseYears} 年，实际驾驶 ${profile.actualDrivingYears} 年 · ${profile.drivingFrequency}` })
    await Promise.resolve()
    const known = context.person.familiarScenes.slice(0, 2).join('、') || '日常道路'
    const next = [...context.person.preparationScenes, ...context.person.unfamiliarScenes].slice(0, 3)
    const level = meTools.inferAssistanceLevel(state)
    const summary = `已熟悉${known}；${next.join('、') || '暂无陌生场景'}仍需要准备。建议采用${level === 'guided' ? '引导' : level === 'balanced' ? '平衡' : '简洁'}辅助。`
    emit({ agent: 'me', status: 'completed', title: '驾驶画像已匹配', detail: summary })
    return { success: true, agent: 'me', task: 'personalize', data: { summary, assistanceLevel: level, nextFirsts: next }, memoryUpdates: [{ domain: 'person', operation: 'update', path: 'lastAssistantStyle', value: level }] }
  },
}

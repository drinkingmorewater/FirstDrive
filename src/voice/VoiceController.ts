import { buildContext } from '../context/ContextBuilder'
import type { AppState } from '../types'
import { scriptedAnswers } from './ScriptedVoiceProvider'

export type VoiceIntent = 'navigation' | 'complexity' | 'weather' | 'energy' | 'rest' | 'vehicle' | 'help' | 'unknown'

export function routeVoiceIntent(utterance: string): VoiceIntent {
  if (/怎么走|出口|导航|路线|简单|目的地/.test(utterance)) return 'navigation'
  if (/高架|立交|复杂|变道|汇入|不熟悉/.test(utterance)) return 'complexity'
  if (/雨|雪|天气|风|温度/.test(utterance)) return 'weather'
  if (/加油|充电|电量|油量|续航|补能/.test(utterance)) return 'energy'
  if (/休息|累|服务区|困/.test(utterance)) return 'rest'
  if (/胎压|车|故障灯|空调|ACC/.test(utterance)) return 'vehicle'
  if (/事故|救援|爆胎|帮帮我|危险/.test(utterance)) return 'help'
  return 'unknown'
}

export const answerVoiceIntent = (utterance: string, state?: AppState) => {
  const intent = routeVoiceIntent(utterance)
  if (!state) {
    const exact = scriptedAnswers[utterance]
    if (exact) return exact
    return '我听到了。为了安全，我会把它转成一条简短提醒，并在合适的时机告诉你。'
  }
  const context = buildContext(state)
  const live = state.liveContext
  const advance = context.person.profile.assistancePreference.advanceNoticeMinutes
  if (intent === 'navigation') return `已按你的“更简单”偏好重新比较路线。新路线多 5 分钟，但复杂立交更少；${advance} 分钟前提醒你。`
  if (intent === 'complexity') return `前方 ${live.nextManeuver}，距离 ${live.nextManeuverDistance} 公里。这个场景目前仍需要准备，我会只提醒下一件事。`
  if (intent === 'weather') return `当前是${live.weather}，前方降雨可能增强。Road Agent 正在同时评估能见度、道路复杂度和你的雨天熟悉度。`
  if (intent === 'energy') return `当前${context.vehicle.powerType === 'ev' ? '电量' : '油量'} ${live.fuel}%，剩余 ${live.distanceRemaining} 公里，本次行程无需补能；沿途下一个服务区约 6.8 公里。`
  if (intent === 'rest') return '你已经连续驾驶 1 小时 42 分钟。建议在 18 分钟后的服务区休息，FirstDrive 会把它加入当前路线。'
  if (intent === 'vehicle') return `${context.vehicle.brand} ${context.vehicle.model} 建议胎压 ${context.vehicle.recommendedTirePressure}。信息来自当前车辆手册 Demo 条目。`
  if (intent === 'help') return '先确认人员安全并移动到安全位置；我已准备打开 Help Agent 的事故或救援工作流。'
  return `我听到了。当前在${live.currentRoad}，下一件值得关注的是${live.nextManeuver}；其余时候我会保持安静。`
}

import type { AppState, LiveDriveContext } from '../types'
import { meAgent } from './me-agent'
import { readyAgent } from './ready-agent'
import { roadAgent } from './road-agent'
import type { AgentEmitter } from './types'

const later = (callback: () => void, delay: number) => window.setTimeout(callback, delay)

export function runPlanningSequence(state: AppState, emit: AgentEmitter) {
  const timers = [
    later(() => void meAgent.execute({ state, emit }), 80),
    later(() => void readyAgent.execute({ state, emit }), 520),
    later(() => emit({ agent: 'road', status: 'queued', title: '路线矩阵已进入分析队列', detail: '读取实时天气、道路结构与停车入口' }), 940),
    later(() => emit({ agent: 'ready', status: 'completed', title: '车辆与环境约束已加入', detail: '小雨、路面湿滑；当前燃油足够完成本次行程' }), 1160),
    later(() => emit({ agent: 'road', status: 'running', title: '正在比较路线难度', detail: '不只计算时间，也计算立交、变道、熟悉道路与停车压力' }), 1380),
    later(() => emit({ agent: 'road', status: 'completed', title: '已找到更容易开的路线', detail: '路线 B 多 5 分钟，但复杂立交更少且 70% 道路熟悉' }), 1980),
  ]
  return () => timers.forEach(window.clearTimeout)
}

export function runReplanningSequence(state: AppState, live: LiveDriveContext, emit: AgentEmitter) {
  emit({ agent: 'me', status: 'completed', title: '辅助偏好已加入判断', detail: '优先稳定路线，避免强降雨下的复杂立交' })
  void roadAgent.execute({ state, live, emit })
}

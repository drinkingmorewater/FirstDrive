import type { AgentId, AgentTask, AppState, LiveDriveContext, TaskNode, VoiceIntent } from '../types'
import type { AgentEmitter } from './types'

const wait = (milliseconds: number) => new Promise(resolve => window.setTimeout(resolve, milliseconds))

const node = (id: string, agent: AgentId, type: TaskNode['type'], label: string, detail: string, dependencies: string[] = [], tool?: string, memoryKeys?: string[]): TaskNode => ({ id, agent, type, label, detail, dependencies, tool, memoryKeys })

export function createTaskGraph(intent: VoiceIntent, input: string, state: AppState): AgentTask {
  const taskId = `task-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`
  const graphs: Partial<Record<VoiceIntent, TaskNode[]>> = {
    profile_intake: [
      node('profile-read', 'me', 'read_context', '读取你的原始表达', '保留原话，并识别明确事实与不确定信息。', [], undefined, ['Person Memory']),
      node('profile-extract', 'me', 'tool_call', '提取人 × 车 × 路 × 境', 'Profile Extractor 正在生成可确认的结构化画像。', ['profile-read'], 'Profile Extractor'),
      node('profile-ready', 'me', 'memory_write', '生成 Mobility Profile Draft', '只写入确认后的信息；推测项保留待确认状态。', ['profile-extract'], undefined, ['Person Memory', 'Familiarity Memory']),
    ],
    buy: [
      node('buy-me', 'me', 'memory_read', '读取汽车生活画像', '读取预算、通勤、乘员、停车与补能条件。', [], undefined, ['Person Memory']),
      node('buy-handoff', 'me', 'handoff', 'ME → BUY', '将个人生活约束交给 Buy Agent。', ['buy-me']),
      node('buy-rank', 'buy', 'tool_call', '重新计算 Life Fit', '按当前 Profile 重新计算车型排序与 TCO。', ['buy-handoff'], 'Life Fit Engine'),
      node('buy-result', 'buy', 'result', '推荐已更新', state.user.mobility.homeCharging ? '已把家充便利度计入纯电车型得分。' : '无家充条件已降低纯电补能便利度。', ['buy-rank']),
    ],
    trip: [
      node('trip-me', 'me', 'memory_read', '读取熟悉度与辅助偏好', '识别尚未独立完成的道路场景。', [], undefined, ['Familiarity Memory']),
      node('trip-ready', 'ready', 'read_context', '检查人、车与出发条件', '评估驾驶经验、车辆状态与预计连续驾驶时间。', ['trip-me'], undefined, ['Vehicle Memory']),
      node('trip-road', 'road', 'tool_call', '比较路线与环境', '同时读取路线、天气、补能和休息节点。', ['trip-ready'], 'Route · Weather · Energy'),
      node('trip-result', 'road', 'result', '生成低压力行程方案', '优先复杂节点更少、休息更充分的方案。', ['trip-road']),
    ],
    practice: [
      node('practice-me', 'me', 'memory_read', '读取下一公里', '找到最需要准备的陌生场景。', [], undefined, ['Familiarity Memory']),
      node('practice-ready', 'ready', 'tool_call', '生成练习计划', '组合时间、道路难度和陪同建议。', ['practice-me'], 'Practice Planner'),
      node('practice-result', 'ready', 'result', '练习计划已准备', '从低压力时段与较短路段开始。', ['practice-ready']),
    ],
    navigation: [
      node('nav-me', 'me', 'memory_read', '读取路线偏好', '读取熟悉、简单与低压力权重。', [], undefined, ['Person Memory', 'Familiarity Memory']),
      node('nav-ready', 'ready', 'read_context', '解释当前约束', `高架熟悉度：${state.familiarity.elevatedRoad}；辅助风格：${state.user.mobility.assistancePreference.level}。`, ['nav-me']),
      node('nav-road', 'road', 'tool_call', '比较 3 条候选路线', '同时计算时间、复杂立交、变道和停车难度。', ['nav-ready'], 'Route Complexity Matrix'),
      node('nav-result', 'road', 'result', '推荐更简单的 Route B', '多 5 分钟，但复杂分流更少且熟悉道路更多。', ['nav-road']),
      node('nav-memory', 'road', 'memory_write', '保存本次路线偏好', 'Journey Memory 已记录 Easy Route 选择。', ['nav-result'], undefined, ['Journey Memory']),
    ],
    vehicle: [
      node('vehicle-context', 'ready', 'read_context', '读取当前车辆与场景', `${state.vehicle.brand} ${state.vehicle.model} · ${state.journey.completionStatus}。`, [], undefined, ['Vehicle Memory']),
      node('vehicle-manual', 'ready', 'tool_call', '检索车辆说明书', '只返回当前场景真正需要知道的条目。', ['vehicle-context'], 'Vehicle Manual'),
      node('vehicle-result', 'ready', 'result', '车辆要点已准备', `建议胎压 ${state.vehicle.recommendedTirePressure}。`, ['vehicle-manual']),
    ],
    maintenance: [
      node('maint-read', 'ready', 'memory_read', '读取 My Car Timeline', '检查最近保养、轮胎、事故与里程。', [], undefined, ['Vehicle Memory']),
      node('maint-tool', 'ready', 'tool_call', '计算下次保养节点', '按当前年里程与最近记录估算。', ['maint-read'], 'Maintenance Planner'),
      node('maint-result', 'ready', 'result', '保养提醒已更新', '预计约 1,200 km 后需要常规保养。', ['maint-tool']),
    ],
    help: [
      node('help-safe', 'help', 'read_context', '先确认人员安全', '把安全动作放在材料与责任判断之前。'),
      node('help-flow', 'help', 'tool_call', '建立连续任务链', 'Incident → Insurance → Repair → Vehicle Memory。', ['help-safe'], 'Incident Workflow'),
      node('help-result', 'help', 'result', '下一步已经排好', '现场材料会持续带到保险与维修流程。', ['help-flow']),
    ],
  }
  const fallback = [node('unknown-read', 'me', 'read_context', '理解当前问题', input), node('unknown-result', 'me', 'result', '已找到下一步', '我会先确认一条关键信息，再交给对应 Agent。', ['unknown-read'])]
  const nodes = graphs[intent] ?? (intent === 'profile_update' ? graphs.profile_intake : intent === 'weather' || intent === 'energy' || intent === 'complexity' ? graphs.trip : fallback) ?? fallback
  return { id: taskId, intent, input, requiredContext: ['person', 'familiarity', 'vehicle', 'journey'], nodes, result: nodes[nodes.length - 1].detail }
}

export async function executeTaskGraph(task: AgentTask, emit: AgentEmitter, options: { delay?: number } = {}) {
  const completed = new Set<string>()
  const pending = [...task.nodes]
  const delay = options.delay ?? 150
  let previousAgent: AgentId | undefined
  while (pending.length) {
    const index = pending.findIndex(item => item.dependencies.every(dependency => completed.has(dependency)))
    if (index < 0) throw new Error(`Task graph ${task.id} has an unresolved dependency`)
    const current = pending.splice(index, 1)[0]
    emit({ taskId: task.id, agent: current.agent, fromAgent: previousAgent ?? 'orchestrator', toAgent: current.agent, type: current.type, status: 'running', title: current.label, detail: current.detail, inputSummary: task.input, tool: current.tool, memoryKeys: current.memoryKeys })
    if (delay) await wait(delay)
    emit({ taskId: task.id, agent: current.agent, fromAgent: previousAgent ?? 'orchestrator', toAgent: current.agent, type: current.type, status: 'completed', title: current.label, detail: current.detail, outputSummary: current.detail, tool: current.tool, memoryKeys: current.memoryKeys })
    completed.add(current.id)
    previousAgent = current.agent
  }
  return task.result
}

export function runPlanningSequence(state: AppState, emit: AgentEmitter) {
  const task = createTaskGraph('navigation', '明天自己去医院，帮我选一条更容易开的路线。', state)
  void executeTaskGraph(task, emit, { delay: 180 })
  return () => undefined
}

export function runReplanningSequence(state: AppState, _live: LiveDriveContext, emit: AgentEmitter) {
  const task = createTaskGraph('navigation', '前方天气变化，重新规划路线。', state)
  void executeTaskGraph(task, emit, { delay: 0 })
}

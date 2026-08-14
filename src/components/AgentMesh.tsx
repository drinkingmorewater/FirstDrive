import { Check, Circle, Database, Wrench } from 'lucide-react'
import { useMemo } from 'react'
import { useAppState } from '../state/AppState'
import type { AgentId } from '../types'

const agents: Array<{ id: AgentId; label: string; note: string }> = [
  { id: 'me', label: 'ME', note: '理解人' },
  { id: 'buy', label: 'BUY', note: '匹配车' },
  { id: 'ready', label: 'READY', note: '准备行动' },
  { id: 'road', label: 'ROAD', note: '理解路境' },
  { id: 'help', label: 'HELP', note: '处理问题' },
]

export function AgentMesh({ mini = false }: { mini?: boolean }) {
  const { state } = useAppState()
  const events = useMemo(() => state.agentEvents.filter(event => !state.activeTaskId || event.taskId === state.activeTaskId).slice(-12), [state.activeTaskId, state.agentEvents])
  const lastByAgent = useMemo(() => new Map(agents.map(agent => [agent.id, [...events].reverse().find(event => event.agent === agent.id)])), [events])
  if (mini) {
    const activeAgents = agents.filter(agent => lastByAgent.get(agent.id)).slice(0, 3)
    return <div className="agent-mesh-mini"><span><i />AGENT MESH</span><div>{(activeAgents.length ? activeAgents : agents.slice(0, 3)).map((agent, index) => <span key={agent.id} className={lastByAgent.get(agent.id)?.status === 'running' ? 'running' : ''}>{agent.label}{index < Math.min(2, (activeAgents.length || 3) - 1) ? <b>→</b> : null}</span>)}</div></div>
  }
  return <section className="agent-mesh" aria-label="Agent Mesh">
    <header><div><small>VISIBLE COLLABORATION</small><h2>Agent Mesh</h2></div><span><i className={state.activeTaskId ? 'running' : ''} />{state.activeTaskId ? 'Working' : 'Ready'}</span></header>
    <div className="agent-mesh-stage">
      <div className="mesh-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="orchestrator-node"><Circle /><strong>ORCHESTRATOR</strong><small>Task Graph</small></div>
      {agents.map((agent, index) => {
        const event = lastByAgent.get(agent.id)
        return <article key={agent.id} className={`agent-node node-${index + 1} ${event?.status ?? 'waiting'}`}><span>{event?.status === 'completed' ? <Check /> : <Circle />}</span><strong>{agent.label}</strong><small>{event?.type === 'tool_call' ? 'Using Tool' : event?.status === 'running' ? 'Thinking' : event?.status === 'completed' ? 'Done' : agent.note}</small></article>
      })}
    </div>
    <div className="handoff-log">{events.length ? events.map(event => <article key={event.id} className={event.status}><span>{event.type === 'tool_call' ? <Wrench /> : event.type?.includes('memory') ? <Database /> : <Circle />}</span><div><small>{event.fromAgent?.toUpperCase()} → {event.agent.toUpperCase()} · {event.type?.replace('_', ' ')}</small><strong>{event.title}</strong><p>{event.detail}</p></div></article>) : <div className="mesh-empty"><Circle /><strong>等待任务</strong><p>说一句你的情况，五个 Agent 的读取、调用与交接会显示在这里。</p></div>}</div>
  </section>
}

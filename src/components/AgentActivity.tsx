import { Bot, Check, CircleDotDashed, LoaderCircle } from 'lucide-react'
import { latestAgentEvents } from '../agents/events/event-store'
import { useAppState } from '../state/AppState'
import type { AgentId } from '../types'

const labels: Record<AgentId, string> = {
  me: 'Me Agent', buy: 'Buy Agent', ready: 'Ready Agent', road: 'Road Agent', help: 'Help Agent',
}

export function AgentActivity({ dark = false, emptyText = '等待你的任务' }: { dark?: boolean; emptyText?: string }) {
  const { state } = useAppState()
  const events = latestAgentEvents(state.agentEvents)
  return (
    <aside className={dark ? 'agent-activity agent-activity-dark' : 'agent-activity'}>
      <header><span>AGENT ACTIVITY</span><b><i /> LIVE</b></header>
      <div className="agent-stream" aria-live="polite">
        {events.length === 0 ? <div className="agent-empty"><CircleDotDashed />{emptyText}</div> : events.map(event => (
          <article key={event.id}>
            <span className={'agent-icon status-' + event.status}>{event.status === 'running' ? <LoaderCircle /> : event.status === 'completed' ? <Check /> : <Bot />}</span>
            <div><div><strong>{labels[event.agent]}</strong><small>{event.status.toUpperCase()}</small></div><b>{event.title}</b><p>{event.detail}</p></div>
          </article>
        ))}
      </div>
    </aside>
  )
}

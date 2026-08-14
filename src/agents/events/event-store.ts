import type { AgentEvent, AgentId } from '../../types'

export const latestAgentEvents = (events: AgentEvent[]) =>
  [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8)

export const latestByAgent = (events: AgentEvent[], agent: AgentId) =>
  [...events].reverse().find(event => event.agent === agent)

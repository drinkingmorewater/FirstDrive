import type { AgentEvent, AgentId, AgentResult, AppState, LiveDriveContext } from '../types'

export type AgentEmitter = (event: Omit<AgentEvent, 'id' | 'timestamp'>) => void

export interface AgentRuntimeContext {
  state: AppState
  live?: LiveDriveContext
  emit: AgentEmitter
}

export interface MobilityAgent<T = unknown> {
  id: AgentId
  label: string
  purpose: string
  execute: (context: AgentRuntimeContext) => Promise<AgentResult<T>>
}

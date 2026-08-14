import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { demoState } from '../data/demo'
import type { AgentEvent, AppState, FamiliarityKey, FamiliarityStatus, Journey, LiveDriveContext, ProactiveEvent } from '../types'

const STORAGE_KEY = 'firstdrive-demo-v3'

type AppStateContextValue = {
  state: AppState
  resetDemo: () => void
  patchJourney: (patch: Partial<Journey>) => void
  patchLiveContext: (patch: Partial<LiveDriveContext>) => void
  updateFamiliarity: (key: FamiliarityKey, status: FamiliarityStatus) => void
  emitAgentEvent: (event: Omit<AgentEvent, 'id' | 'timestamp'>) => void
  emitProactiveEvent: (event: ProactiveEvent) => void
  clearRuntime: () => void
  replaceState: (next: AppState | ((current: AppState) => AppState)) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)
const cloneDemo = () => structuredClone(demoState)

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return cloneDemo()
    const parsed = JSON.parse(saved) as Partial<AppState>
    return {
      ...cloneDemo(),
      ...parsed,
      user: { ...demoState.user, ...parsed.user },
      memory: { ...demoState.memory, ...parsed.memory },
      liveContext: { ...demoState.liveContext, ...parsed.liveContext },
      agentEvents: [],
      proactiveEvents: [],
    }
  } catch {
    return cloneDemo()
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, agentEvents: [], proactiveEvents: [] }))
  }, [state])

  const emitAgentEvent = useCallback((event: Omit<AgentEvent, 'id' | 'timestamp'>) => {
    setState(current => ({
      ...current,
      agentEvents: [...current.agentEvents.slice(-17), {
        ...event,
        id: `${event.agent}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        timestamp: Date.now(),
      }],
    }))
  }, [])

  const value = useMemo<AppStateContextValue>(() => ({
    state,
    resetDemo: () => setState(cloneDemo()),
    patchJourney: patch => setState(current => ({ ...current, journey: { ...current.journey, ...patch } })),
    patchLiveContext: patch => setState(current => ({ ...current, liveContext: { ...current.liveContext, ...patch } })),
    updateFamiliarity: (key, status) => setState(current => ({ ...current, familiarity: { ...current.familiarity, [key]: status } })),
    emitAgentEvent,
    emitProactiveEvent: event => setState(current => current.proactiveEvents.some(item => item.id === event.id)
      ? current : { ...current, proactiveEvents: [...current.proactiveEvents, event] }),
    clearRuntime: () => setState(current => ({ ...current, agentEvents: [], proactiveEvents: [], liveContext: { ...demoState.liveContext } })),
    replaceState: next => setState(next),
  }), [emitAgentEvent, state])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used inside AppStateProvider')
  return context
}

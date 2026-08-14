import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoState } from '../data/demo'
import type { AppState, FamiliarityKey, FamiliarityStatus, Journey } from '../types'

const STORAGE_KEY = 'firstdrive-demo-v2'

type AppStateContextValue = {
  state: AppState
  resetDemo: () => void
  patchJourney: (patch: Partial<Journey>) => void
  updateFamiliarity: (key: FamiliarityKey, status: FamiliarityStatus) => void
  replaceState: (next: AppState | ((current: AppState) => AppState)) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...demoState, ...JSON.parse(saved) } as AppState : demoState
  } catch {
    return demoState
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<AppStateContextValue>(() => ({
    state,
    resetDemo: () => setState(structuredClone(demoState)),
    patchJourney: patch => setState(current => ({ ...current, journey: { ...current.journey, ...patch } })),
    updateFamiliarity: (key, status) => setState(current => ({ ...current, familiarity: { ...current.familiarity, [key]: status } })),
    replaceState: next => setState(next),
  }), [state])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used inside AppStateProvider')
  return context
}

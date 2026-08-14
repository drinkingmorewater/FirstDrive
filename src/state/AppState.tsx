import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createDemoState, demoState, vehicles } from '../data/demo'
import type {
  AgentEvent, AppState, BuySession, DeliveryRecord, FamiliarityKey, FamiliarityStatus,
  IncidentRecord, Journey, LiveDriveContext, MemoryTimelineEntry, MobilityProfile,
  PersonaId, ProactiveEvent, SavedBuyPlan, UsedCarReport,
} from '../types'

const STORAGE_KEY = 'firstdrive-demo-v4'
const LEGACY_STORAGE_KEY = 'firstdrive-demo-v3'

type AppStateContextValue = {
  state: AppState
  resetDemo: () => void
  switchPersona: (personaId: PersonaId) => void
  patchJourney: (patch: Partial<Journey>) => void
  patchLiveContext: (patch: Partial<LiveDriveContext>) => void
  patchMobility: (patch: Partial<MobilityProfile>) => void
  patchBuySession: (patch: Partial<BuySession>) => void
  updateFamiliarity: (key: FamiliarityKey, status: FamiliarityStatus) => void
  saveBuyPlan: (plan: SavedBuyPlan) => void
  commitDeliveryRecord: (record: DeliveryRecord) => void
  commitUsedCarReport: (report: UsedCarReport) => void
  addIncidentRecord: (record: IncidentRecord) => void
  addTimeline: (entry: MemoryTimelineEntry) => void
  emitAgentEvent: (event: Omit<AgentEvent, 'id' | 'timestamp'>) => void
  emitProactiveEvent: (event: ProactiveEvent) => void
  clearRuntime: () => void
  replaceState: (next: AppState | ((current: AppState) => AppState)) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)
const cloneDemo = () => structuredClone(demoState)

function mergeState(base: AppState, saved: Partial<AppState>): AppState {
  const mergedUser = { ...base.user, ...saved.user }
  const savedMobility = saved.user?.mobility
  mergedUser.mobility = { ...base.user.mobility, ...savedMobility }
  mergedUser.mobility.routePreference = { ...base.user.mobility.routePreference, ...savedMobility?.routePreference }
  mergedUser.mobility.assistancePreference = { ...base.user.mobility.assistancePreference, ...savedMobility?.assistancePreference }
  const memory = saved.memory
  return {
    ...base,
    ...saved,
    version: 4,
    user: mergedUser,
    familiarity: { ...base.familiarity, ...saved.familiarity },
    journey: { ...base.journey, ...saved.journey },
    memory: {
      ...base.memory,
      ...memory,
      person: { ...base.memory.person, ...memory?.person },
      familiarity: { ...base.memory.familiarity, ...memory?.familiarity },
      vehicle: { ...base.memory.vehicle, ...memory?.vehicle },
      journey: { ...base.memory.journey, ...memory?.journey },
      cost: { ...base.memory.cost, ...memory?.cost },
      incident: { ...base.memory.incident, ...memory?.incident },
    },
    buySession: {
      ...base.buySession,
      ...saved.buySession,
      assumptions: { ...base.buySession.assumptions, ...saved.buySession?.assumptions },
    },
    liveContext: { ...base.liveContext, ...saved.liveContext },
    agentEvents: [],
    proactiveEvents: [],
  }
}

function migrateLegacy(saved: Partial<AppState>): AppState {
  const base = cloneDemo()
  if (saved.user) {
    const years = saved.user.drivingYears ?? base.user.mobility.licenseYears
    const frequency = saved.user.actualDrivingFrequency ?? base.user.mobility.drivingFrequency
    base.user = { ...base.user, ...saved.user, personaId: 'buyer', mobility: { ...base.user.mobility, city: saved.user.city ?? base.user.mobility.city, licenseYears: years, drivingFrequency: frequency, assistancePreference: { ...base.user.mobility.assistancePreference, level: saved.user.assistanceLevel ?? 'balanced' } } }
  }
  if (saved.familiarity) base.familiarity = { ...base.familiarity, ...saved.familiarity }
  return base
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return mergeState(cloneDemo(), JSON.parse(saved) as Partial<AppState>)
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) return migrateLegacy(JSON.parse(legacy) as Partial<AppState>)
    return cloneDemo()
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
    switchPersona: personaId => setState(createDemoState(personaId)),
    patchJourney: patch => setState(current => ({ ...current, journey: { ...current.journey, ...patch } })),
    patchLiveContext: patch => setState(current => ({ ...current, liveContext: { ...current.liveContext, ...patch } })),
    patchMobility: patch => setState(current => {
      const mobility = { ...current.user.mobility, ...patch }
      const vehicle = vehicles.find(item => item.id === current.user.vehicleId) ?? current.vehicle
      return {
        ...current,
        user: {
          ...current.user,
          mobility,
          city: mobility.city,
          drivingYears: mobility.licenseYears,
          actualDrivingFrequency: mobility.drivingFrequency,
          assistanceLevel: mobility.assistancePreference.level,
        },
        vehicle,
        buySession: {
          ...current.buySession,
          assumptions: {
            ...current.buySession.assumptions,
            annualMileageKm: patch.annualMileageKm ?? current.buySession.assumptions.annualMileageKm,
            ownershipYears: patch.plannedOwnershipYears ?? current.buySession.assumptions.ownershipYears,
          },
        },
        memory: { ...current.memory, person: { ...current.memory.person, lastUpdated: new Date().toISOString().slice(0, 10) } },
      }
    }),
    patchBuySession: patch => setState(current => ({
      ...current,
      buySession: { ...current.buySession, ...patch, assumptions: { ...current.buySession.assumptions, ...patch.assumptions } },
    })),
    updateFamiliarity: (key, status) => setState(current => ({ ...current, familiarity: { ...current.familiarity, [key]: status } })),
    saveBuyPlan: plan => setState(current => ({
      ...current,
      memory: {
        ...current.memory,
        cost: { ...current.memory.cost, savedPlans: [plan, ...current.memory.cost.savedPlans.filter(item => item.id !== plan.id)] },
        timeline: [{ id: `timeline-${plan.id}`, date: plan.createdAt.slice(0, 10), domain: 'cost', title: `保存购车方案：${plan.name}`, detail: `比较 ${plan.vehicleIds.length} 款车，当前首选 ${plan.selectedVehicleId}。` }, ...current.memory.timeline],
      },
    })),
    commitDeliveryRecord: record => setState(current => ({
      ...current,
      memory: { ...current.memory, vehicle: { ...current.memory.vehicle, deliveryRecords: [record, ...current.memory.vehicle.deliveryRecords] }, timeline: [{ id: `timeline-${record.id}`, date: record.createdAt.slice(0, 10), domain: 'vehicle', title: '建立 Vehicle Birth Record', detail: `${record.vehicleName} · ${record.checkedItems.length} 项已核验。` }, ...current.memory.timeline] },
    })),
    commitUsedCarReport: report => setState(current => ({
      ...current,
      memory: { ...current.memory, vehicle: { ...current.memory.vehicle, usedCarReports: [report, ...current.memory.vehicle.usedCarReports] }, timeline: [{ id: `timeline-${report.id}`, date: report.createdAt.slice(0, 10), domain: 'vehicle', title: '保存二手车检查报告', detail: `${report.vehicleDescription} · 风险 ${report.riskLevel}。` }, ...current.memory.timeline] },
    })),
    addIncidentRecord: record => setState(current => ({
      ...current,
      memory: { ...current.memory, incident: { records: [record, ...current.memory.incident.records] }, timeline: [{ id: `timeline-${record.id}`, date: record.time.slice(0, 10), domain: 'incident', title: '创建事故材料包', detail: `${record.location} · 状态 ${record.status}。` }, ...current.memory.timeline] },
    })),
    addTimeline: entry => setState(current => ({ ...current, memory: { ...current.memory, timeline: [entry, ...current.memory.timeline] } })),
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

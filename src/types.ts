export type FamiliarityStatus =
  | 'unexperienced'
  | 'want_to_prepare'
  | 'accompanied'
  | 'completed_independently'
  | 'familiar'

export type FamiliarityKey =
  | 'cityRoad' | 'heavyTraffic' | 'expressway' | 'elevatedRoad' | 'highway'
  | 'mountainRoad' | 'narrowRoad' | 'nightDriving' | 'rainDriving'
  | 'snowDriving' | 'parking' | 'reverseParking' | 'complexLaneChange'
  | 'highwayMerge' | 'fueling' | 'charging'

export type AgentId = 'me' | 'buy' | 'ready' | 'road' | 'help'
export type AgentEventStatus = 'queued' | 'running' | 'completed' | 'attention'

export interface AgentEvent {
  id: string
  agent: AgentId
  status: AgentEventStatus
  title: string
  detail: string
  timestamp: number
  source?: string
}

export interface UserProfile {
  id: string
  name: string
  city: string
  drivingYears: number
  actualDrivingFrequency: string
  preferredDrivingTime: string
  vehicleId: string
  assistanceLevel: 'quiet' | 'balanced' | 'guided'
}

export type FamiliarityProfile = Record<FamiliarityKey, FamiliarityStatus>

export interface VehicleProfile {
  id: string
  brand: string
  model: string
  year: number
  powerType: 'oil' | 'hybrid' | 'ev'
  bodyType: 'sedan' | 'suv'
  width: number
  length: number
  range: number
  fuelConsumption: number
  recommendedTirePressure: string
  manualEntries: string[]
  price: number
}

export interface RouteFactor { label: string; tone: 'risk' | 'caution' | 'familiar' | 'neutral' }

export interface RouteOption {
  id: 'A' | 'B'
  duration: number
  distance: number
  complexInterchanges: number
  laneChangeComplexity: 'low' | 'medium' | 'high'
  highwayDistance: number
  tunnelCount: number
  narrowRoadDistance: number
  familiarRoadRatio: number
  parkingComplexity: 'easy' | 'medium' | 'hard'
  difficultyScore: number
  factors: RouteFactor[]
}

export interface RehearsalPoint {
  id: string
  time: string
  title: string
  distance: string
  coreReminder: string
  preparation: string
  tips: string[]
  kind: 'merge' | 'split' | 'parking'
}

export interface Journey {
  origin: string
  destination: string
  departureTime: string
  weather: string
  routeOptions: RouteOption[]
  selectedRoute: 'A' | 'B' | null
  rehearsalPoints: RehearsalPoint[]
  completionStatus: 'draft' | 'prepared' | 'driving' | 'completed'
}

export interface DriveMemory {
  completedScenarios: string[]
  journeys: Array<{ route: string; date: string; distance: number; duration: number }>
  vehicles: string[]
  maintenance: string[]
  expenses: number[]
  confidence: number
}

export type ProactiveEventType =
  | 'weather_change' | 'complex_road_ahead' | 'energy_low' | 'service_area_ahead'
  | 'unfamiliar_segment' | 'fatigue_threshold' | 'destination_arrival'

export interface ProactiveEvent {
  id: string
  type: ProactiveEventType
  title: string
  detail: string
  severity: 'info' | 'warning' | 'critical'
  atProgress: number
}

export interface LiveDriveContext {
  progress: number
  speed: number
  distanceRemaining: number
  etaMinutes: number
  weather: '晴' | '小雨' | '强降雨'
  fuel: number
  currentRoad: string
  nextManeuver: string
  nextManeuverDistance: number
  routeVersion: 1 | 2
  paused: boolean
}

export type VoiceStage = 'idle' | 'listening' | 'understanding' | 'working' | 'speaking'

export interface AppState {
  user: UserProfile
  familiarity: FamiliarityProfile
  vehicle: VehicleProfile
  journey: Journey
  memory: DriveMemory
  mockMode: boolean
  agentEvents: AgentEvent[]
  proactiveEvents: ProactiveEvent[]
  liveContext: LiveDriveContext
}

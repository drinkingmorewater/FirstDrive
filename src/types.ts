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

export type AssistanceLevel = 'quiet' | 'balanced' | 'guided'
export type ScenarioId = 'commute' | 'family' | 'roadtrip' | 'rideHailing' | 'camping'
export type PersonaId = 'practice' | 'buyer' | 'roadtrip'
export type AgentId = 'me' | 'buy' | 'ready' | 'road' | 'help'
export type AgentEventStatus = 'queued' | 'running' | 'completed' | 'failed' | 'attention'
export type AgentEventType = 'read_context' | 'tool_call' | 'handoff' | 'memory_read' | 'memory_write' | 'result'
export type OnboardingStatus = 'new' | 'started' | 'completed'
export type EvidenceState = 'confirmed' | 'inferred' | 'need_to_confirm'

export interface MobilityProfile {
  city: string
  licenseYears: number
  actualDrivingYears: number
  drivingFrequency: string
  dailyCommuteKm: number
  commuteMinutes: number
  commuteDaysPerWeek: number
  annualMileageKm: number
  passengerPattern: string[]
  usageTypes: string[]
  parkingType: string
  homeCharging: boolean | null
  publicChargingConvenience: string
  longTripFrequency: string
  vehiclePriorities: string[]
  purchaseBudget?: number
  idealBudget?: number
  monthlyCarBudget?: number
  monthlyIncome?: number
  plannedOwnershipYears?: number
  routePreference: { fastest: number; familiar: number; easy: number; lowStress: number }
  assistancePreference: { level: AssistanceLevel; advanceNoticeMinutes: number; voiceEnabled: boolean }
}

export interface UserProfile {
  id: string
  name: string
  personaId: PersonaId
  mobility: MobilityProfile
  // v3 compatibility fields. New decisions read mobility via buildContext().
  city: string
  drivingYears: number
  actualDrivingFrequency: string
  preferredDrivingTime: string
  vehicleId: string
  assistanceLevel: AssistanceLevel
}

export type FamiliarityProfile = Record<FamiliarityKey, FamiliarityStatus>

export interface AgentEvent {
  id: string
  taskId?: string
  agent: AgentId
  fromAgent?: AgentId | 'orchestrator'
  toAgent?: AgentId
  type?: AgentEventType
  status: AgentEventStatus
  title: string
  detail: string
  inputSummary?: string
  outputSummary?: string
  tool?: string
  memoryKeys?: string[]
  timestamp: number
  source?: string
}

export interface ProfileEvidence {
  id: string
  label: string
  value: string
  state: EvidenceState
  quote?: string
}

export interface ProfileDraft {
  transcript: string
  mobility: Partial<MobilityProfile>
  familiarity: Partial<FamiliarityProfile>
  passengerPattern?: string[]
  evidence: ProfileEvidence[]
  learned: string[]
  questions: string[]
  nextFirst: FamiliarityKey
  createdAt: string
}

export interface ProfileIntakeState {
  transcript: string
  draft: ProfileDraft | null
  answers: Record<string, string>
  confirmed: boolean
}

export interface TaskNode {
  id: string
  agent: AgentId
  type: AgentEventType
  label: string
  detail: string
  dependencies: string[]
  tool?: string
  memoryKeys?: string[]
}

export interface AgentTask {
  id: string
  intent: VoiceIntent
  input: string
  requiredContext: string[]
  nodes: TaskNode[]
  result: string
}

export interface Source {
  id: string
  label: string
  type: 'user_input' | 'demo_estimate' | 'public_source'
  updatedAt?: string
}

export interface MemoryPatch {
  domain: 'person' | 'familiarity' | 'vehicle' | 'journey' | 'cost' | 'incident'
  operation: 'append' | 'update'
  path: string
  value: unknown
}

export interface NextAction { id: string; label: string; route?: string }

export interface AgentResult<T> {
  success: boolean
  agent: AgentId
  task: string
  data: T
  sources?: Source[]
  memoryUpdates?: MemoryPatch[]
  nextActions?: NextAction[]
}

export interface VehicleProfile {
  id: string
  brand: string
  model: string
  trim: string
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
  image?: string
  seats?: number
  category?: string
  strengths?: string[]
  compromises?: string[]
}

export interface TcoAssumptions {
  annualMileageKm: number
  ownershipYears: number
  parkingMonthly: number
  electricityPrice: number
  fuelPrice: number
  insuranceRate: number
  financeRate: number
  downPaymentRatio: number
}

export interface TcoBreakdown {
  purchase: number
  taxRegistration: number
  insurance: number
  finance: number
  energy: number
  parking: number
  maintenance: number
  wear: number
  depreciation: number
  firstYearCash: number
  monthlyAverage: number
  fiveYearTco: number
  totalOwnershipCost: number
}

export interface VehicleFitResult {
  vehicle: VehicleProfile
  score: number
  fit: string[]
  tradeoffs: string[]
  bestScenarios: string[]
  friction: string
  fiveYearReality: string
  scenarioScores: Record<'commute' | 'roadtrip' | 'family' | 'cost', number>
  tco: TcoBreakdown
}

export interface SavedBuyPlan {
  id: string
  name: string
  scenario: ScenarioId
  vehicleIds: string[]
  selectedVehicleId: string
  createdAt: string
  budget: number
}

export interface DeliveryRecord {
  id: string
  vehicleName: string
  checkedItems: string[]
  createdAt: string
  status: 'in_progress' | 'completed'
}

export interface UsedCarReport {
  id: string
  vehicleDescription: string
  checkedItems: string[]
  riskLevel: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface IncidentRecord {
  id: string
  time: string
  location: string
  photos: string[]
  peopleSafe: boolean
  otherPartyInfo: string
  description: string
  insuranceChecklist: string[]
  status: 'draft' | 'ready' | 'submitted' | 'closed'
}

export interface MemoryTimelineEntry {
  id: string
  date: string
  domain: 'person' | 'familiarity' | 'vehicle' | 'journey' | 'cost' | 'incident'
  title: string
  detail: string
}

export interface DriveMemory {
  completedScenarios: string[]
  journeys: Array<{ route: string; date: string; distance: number; duration: number }>
  vehicles: string[]
  maintenance: string[]
  expenses: number[]
  confidence: number
  person: { learnedPreferences: string[]; lastUpdated: string }
  familiarity: { completedFirsts: string[]; assistanceReductions: number }
  vehicle: { maintenanceRecords: string[]; deliveryRecords: DeliveryRecord[]; usedCarReports: UsedCarReport[]; firstDriveCompleted: string[] }
  journey: { routeChoices: Array<{ mode: string; count: number }>; roadTrips: string[]; roadTripPlans: RoadTripPlan[] }
  cost: { savedPlans: SavedBuyPlan[]; totalTracked: number }
  incident: { records: IncidentRecord[] }
  rental: { sessions: RentalSession[] }
  timeline: MemoryTimelineEntry[]
}

export interface RoadTripStop { time: string; place: string; action: string }
export interface RoadTripDay { day: number; distance: number; title: string; stops: RoadTripStop[] }
export interface RoadTripPlan {
  id: string
  origin: string
  destination: string
  departureDate: string
  vehicle: string
  passengers: number
  experience: string
  goal: string
  fatiguePreference: string
  totalDistance: number
  days: RoadTripDay[]
  chargingStops: number
  restStops: number
  weather: string
  packing: string[]
  risks: string[]
  createdAt: string
}

export interface RentalSession {
  id: string
  vehicle: string
  location: string
  pickupMileage: number
  returnMileage?: number
  pickupEnergy: number
  returnEnergy?: number
  existingDamage: string[]
  returnDamage?: string[]
  insuranceConfirmed: boolean
  documentsConfirmed: boolean
  status: 'pickup' | 'active' | 'completed'
  createdAt: string
}

export interface BuySession {
  scenario: ScenarioId
  energyFilter: 'all' | 'ev' | 'hybrid' | 'oil'
  bodyFilter: 'all' | 'sedan' | 'suv'
  selectedVehicleId: string
  assumptions: TcoAssumptions
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
export type VoiceIntent =
  | 'profile_intake' | 'profile_update' | 'buy' | 'trip' | 'practice' | 'navigation'
  | 'complexity' | 'weather' | 'energy' | 'vehicle' | 'maintenance' | 'help' | 'unknown'

export interface AppState {
  version: 5
  onboardingStatus: OnboardingStatus
  profileIntake: ProfileIntakeState
  coachMarksSeen: string[]
  activeTaskId: string | null
  user: UserProfile
  familiarity: FamiliarityProfile
  vehicle: VehicleProfile
  journey: Journey
  memory: DriveMemory
  buySession: BuySession
  mockMode: boolean
  agentEvents: AgentEvent[]
  proactiveEvents: ProactiveEvent[]
  liveContext: LiveDriveContext
}

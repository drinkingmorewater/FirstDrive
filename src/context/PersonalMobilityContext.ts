import type { DriveMemory, FamiliarityProfile, Journey, MobilityProfile, UserProfile, VehicleProfile } from '../types'

export interface PersonalMobilityContext {
  person: {
    user: UserProfile
    profile: MobilityProfile
    familiarity: FamiliarityProfile
    familiarScenes: string[]
    preparationScenes: string[]
    unfamiliarScenes: string[]
  }
  vehicle: VehicleProfile
  route: Journey
  environment: {
    city: string
    weather: string
    departureTime: string
  }
  memory: DriveMemory
}

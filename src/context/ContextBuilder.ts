import { familiarityLabels } from '../data/demo'
import type { AppState, FamiliarityStatus } from '../types'
import type { PersonalMobilityContext } from './PersonalMobilityContext'

const familiar: FamiliarityStatus[] = ['familiar', 'completed_independently']
const preparation: FamiliarityStatus[] = ['want_to_prepare', 'accompanied']

export function buildContext(state: AppState): PersonalMobilityContext {
  const entries = Object.entries(state.familiarity) as Array<[keyof typeof state.familiarity, FamiliarityStatus]>
  return {
    person: {
      user: state.user,
      profile: state.user.mobility,
      familiarity: state.familiarity,
      familiarScenes: entries.filter(([, status]) => familiar.includes(status)).map(([key]) => familiarityLabels[key]),
      preparationScenes: entries.filter(([, status]) => preparation.includes(status)).map(([key]) => familiarityLabels[key]),
      unfamiliarScenes: entries.filter(([, status]) => status === 'unexperienced').map(([key]) => familiarityLabels[key]),
    },
    vehicle: state.vehicle,
    route: state.journey,
    environment: { city: state.user.mobility.city, weather: state.journey.weather, departureTime: state.journey.departureTime },
    memory: state.memory,
  }
}

import type { AppState, AssistanceLevel } from '../types'
import { buildContext } from './ContextBuilder'

export const selectMobilityProfile = (state: AppState) => buildContext(state).person.profile

export function selectAssistanceLevel(state: AppState): AssistanceLevel {
  const context = buildContext(state)
  const unfamiliarCount = context.person.unfamiliarScenes.length
  const requested = context.person.profile.assistancePreference.level
  if (requested === 'guided' || unfamiliarCount >= 6) return 'guided'
  if (requested === 'quiet' && unfamiliarCount <= 2) return 'quiet'
  return 'balanced'
}

export function selectNextFirst(state: AppState) {
  const context = buildContext(state)
  return context.person.preparationScenes[0] ?? context.person.unfamiliarScenes[0] ?? '新的驾驶场景'
}

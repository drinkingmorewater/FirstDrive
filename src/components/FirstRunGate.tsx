import { Navigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'
import { Home } from '../pages/Home'

export function FirstRunGate() {
  const { state } = useAppState()
  return state.onboardingStatus === 'completed' ? <Home /> : <Navigate to="/welcome" replace />
}

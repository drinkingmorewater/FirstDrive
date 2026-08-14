import type { LiveDriveContext } from '../types'

export async function resolveRealContext(fallback: LiveDriveContext) {
  if (!('geolocation' in navigator)) return { context: fallback, source: 'demo-fallback' as const }
  return new Promise<{ context: LiveDriveContext; source: 'geolocation' | 'demo-fallback' }>(resolve => {
    navigator.geolocation.getCurrentPosition(
      () => resolve({ context: { ...fallback, weather: '小雨' }, source: 'geolocation' }),
      () => resolve({ context: fallback, source: 'demo-fallback' }),
      { timeout: 2500, maximumAge: 300000 },
    )
  })
}

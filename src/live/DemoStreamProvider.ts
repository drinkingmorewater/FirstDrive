import type { LiveDriveContext } from '../types'

export function advanceDemoContext(current: LiveDriveContext): LiveDriveContext {
  if (current.paused || current.progress >= 100) return current
  const progress = Math.min(100, current.progress + 7)
  const weather = progress >= 35 ? '强降雨' : progress >= 14 ? '小雨' : '晴'
  const routeVersion = progress >= 49 ? 2 : current.routeVersion
  const etaBase = routeVersion === 2 ? 41 : 36
  const remainingRatio = (100 - progress) / 100
  return {
    ...current,
    progress,
    weather,
    routeVersion,
    speed: progress > 80 ? 42 : weather === '强降雨' ? 56 : 68,
    distanceRemaining: Number((24 * remainingRatio).toFixed(1)),
    etaMinutes: Math.max(1, Math.ceil(etaBase * remainingRatio)),
    fuel: Math.max(35, Number((42 - progress * 0.07).toFixed(0))),
    currentRoad: progress < 28 ? '晨昌路' : progress < 63 ? '北辰西路高架' : '浦东大道',
    nextManeuver: progress < 28 ? '进入北辰西路高架' : progress < 72 ? '高架分流，保持中间车道' : '医院北门右转',
    nextManeuverDistance: Number(Math.max(.2, 8 - progress * .09).toFixed(1)),
  }
}

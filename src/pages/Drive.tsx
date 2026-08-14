import { AlertTriangle, Fuel, HelpCircle, Mic, Navigation, Pause, Play, Route, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AgentActivity } from '../components/AgentActivity'
import { MobilityMap } from '../components/MobilityMap'
import { VoiceDock } from '../components/VoiceDock'
import { runReplanningSequence } from '../agents'
import { LiveDriveEngine } from '../live'
import { useAppState } from '../state/AppState'
import type { LiveDriveContext, ProactiveEvent } from '../types'

export function Drive() {
  const navigate = useNavigate()
  const { state, patchLiveContext, emitProactiveEvent, emitAgentEvent, patchJourney } = useAppState()
  const [context, setContext] = useState(state.liveContext)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [activeEvent, setActiveEvent] = useState<ProactiveEvent | null>(null)
  const engine = useRef<LiveDriveEngine | null>(null)
  const replanned = useRef(context.routeVersion === 2)
  const arrivalTimer = useRef<number | null>(null)

  useEffect(() => {
    engine.current = new LiveDriveEngine(context, (next, events) => {
      setContext(next)
      patchLiveContext(next)
      events.forEach(event => {
        emitProactiveEvent(event)
        setActiveEvent(event)
        emitAgentEvent({ agent: 'road', status: event.severity === 'warning' ? 'attention' : 'running', title: event.title, detail: event.detail, source: event.type })
      })
      if (next.routeVersion === 2 && !replanned.current) {
        replanned.current = true
        runReplanningSequence(state, next, emitAgentEvent)
      }
      if (next.progress >= 100 && arrivalTimer.current === null) {
        patchJourney({ completionStatus: 'completed' })
        arrivalTimer.current = window.setTimeout(() => navigate('/trip/complete'), 2200)
      }
    })
    engine.current.start()
    return () => {
      engine.current?.stop()
      if (arrivalTimer.current) window.clearTimeout(arrivalTimer.current)
    }
  }, [])

  const togglePause = () => {
    const next = !paused
    setPaused(next)
    engine.current?.setPaused(next)
  }

  return (
    <div className="live-drive">
      <main className="drive-cockpit">
        <section className="drive-map-stage">
          <MobilityMap progress={context.progress} dark />
          <div className="drive-inline-status"><span>08:51</span><b>D</b><strong>READY</strong><em>{context.speed} <small>km/h</small></em><i><Fuel />{context.fuel}%</i></div>
          <div className="maneuver-card"><Navigation /><div><small>{context.nextManeuverDistance} km 后</small><strong>{context.nextManeuver}</strong><span>{context.distanceRemaining} km · 预计 {context.etaMinutes} 分钟</span></div></div>
          {activeEvent ? <div className={'proactive-alert ' + activeEvent.severity}><AlertTriangle /><div><strong>{activeEvent.title}</strong><span>{activeEvent.detail}</span></div><button onClick={() => setActiveEvent(null)}>知道了</button></div> : null}
          {context.routeVersion === 2 ? <div className="plan-updated">
            <span>PLAN UPDATED</span><div><small>原计划</small><strong>36<em> min</em></strong></div><i>→</i><div><small>新计划</small><strong>41<em> min</em></strong></div><p>更新原因<b>避开高复杂度立交 + 强降雨区域</b></p>
          </div> : null}
          <div className="progress-strip"><i style={{ width: context.progress + '%' }} /><span>{Math.round(context.progress)}%</span></div>
        </section>
        <aside className="drive-context-rail">
          <header><span>LIVE CONTEXT</span><b><i /> 2s</b></header>
          <div className="context-cell"><small>人 · ME</small><strong>{context.progress > 62 ? '状态稳定' : '高架未独立完成'}</strong><span>辅助级别：提前提醒</span></div>
          <div className="context-cell"><small>车 · VEHICLE</small><strong>Fuel {context.fuel}%</strong><span>{state.vehicle.model} · 状态正常</span></div>
          <div className="context-cell"><small>路 · ROAD</small><strong>{context.currentRoad}</strong><span>{context.nextManeuverDistance} km 后关键节点</span></div>
          <div className="context-cell"><small>境 · ENVIRONMENT</small><strong>{context.weather}</strong><span>{context.weather === '强降雨' ? '能见度下降 · 路面湿滑' : '降雨可控 · 路面湿滑'}</span></div>
          <AgentActivity dark />
        </aside>
      </main>
      <footer className="drive-controls">
        <button onClick={togglePause}>{paused ? <Play /> : <Pause />}<span>{paused ? '继续' : '暂停'}</span></button>
        <button className="voice-control" onClick={() => setVoiceOpen(true)}><Mic /><span>问 FirstDrive</span><Volume2 /></button>
        <button onClick={() => navigate('/help')}><HelpCircle /><span>道路帮助</span></button>
        <div><Route /><span>{context.distanceRemaining} km</span><strong>预计 {context.etaMinutes} 分钟</strong></div>
      </footer>
      <VoiceDock open={voiceOpen} onClose={() => setVoiceOpen(false)} driveMode />
    </div>
  )
}

import { ArrowLeft, ArrowRight, Check, Clock3, GitFork, MapPin, ParkingCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { runPlanningSequence } from '../agents'
import { AgentActivity } from '../components/AgentActivity'
import { AppShell } from '../components/AppShell'
import { MobilityMap } from '../components/MobilityMap'
import { useAppState } from '../state/AppState'

export function RouteCompare() {
  const navigate = useNavigate()
  const { state, patchJourney, emitAgentEvent } = useAppState()
  const selected = state.journey.selectedRoute ?? 'B'
  const ran = useRef(false)
  const runtimeState = useRef(state)
  useEffect(() => {
    if (runtimeState.current.agentEvents.length || ran.current) return
    ran.current = true
    runPlanningSequence(runtimeState.current, emitAgentEvent)
  }, [emitAgentEvent])

  return (
    <AppShell compact>
      <div className="compare-v3">
        <header className="compare-header">
          <Link to="/trip/new"><ArrowLeft /></Link>
          <div><span>ROUTE COMPARE</span><h1>{state.journey.origin} → {state.journey.destination}</h1><p>{state.journey.departureTime} · 小雨 · 结合当前熟悉度</p></div>
          <b>Agents 已完成 8 项判断</b>
        </header>
        <div className="compare-grid">
          <section className="compare-map"><MobilityMap /><div className="map-legend"><span><i className="route-a" />路线 A · 最快</span><span><i className="route-b" />路线 B · 更适合你</span></div></section>
          <aside className="route-inspector-v3">
            <span className="panel-kicker">路线判断</span>
            {state.journey.routeOptions.map(route => <button key={route.id} onClick={() => patchJourney({ selectedRoute: route.id })} className={selected === route.id ? 'route-card selected' : 'route-card'}>
              <header><span>路线 {route.id}{route.id === 'B' ? <em>推荐</em> : <em>最快</em>}</span>{selected === route.id ? <Check /> : null}</header>
              <div className="route-numbers"><strong>{route.duration}<small> min</small></strong><span>{route.distance} km</span><span>难度 {route.difficultyScore}/15</span></div>
              <ul><li><GitFork />{route.complexInterchanges} 个复杂立交</li><li><ShieldCheck />{route.familiarRoadRatio}% 熟悉道路</li><li><ParkingCircle />停车 {route.parkingComplexity === 'easy' ? '更简单' : '有压力'}</li></ul>
            </button>)}
            <div className="route-reason"><Clock3 /><div><strong>多花 5 分钟，换来更少的临场压力。</strong><p>少 2 个复杂立交，熟悉道路比例从 34% 提升至 70%，医院北门停车更简单。</p></div></div>
            <button className="primary-action" onClick={() => { patchJourney({ selectedRoute: selected }); navigate('/trip/rehearsal') }}>选择路线 {selected}，开始预演 <ArrowRight /></button>
          </aside>
          <AgentActivity />
        </div>
        <footer className="compare-context"><span><MapPin />判断依据</span><b>快速路 · 希望先了解</b><b>高架 · 未独立完成</b><b>复杂变道 · 未经历</b><b>雨天 · 有人陪同完成</b></footer>
      </div>
    </AppShell>
  )
}

import { ArrowLeft, ArrowRight, Check, Clock3, GitFork, MapPin, ParkingCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { runPlanningSequence } from '../agents'
import { AgentActivity } from '../components/AgentActivity'
import { AppShell } from '../components/AppShell'
import { MobilityMap } from '../components/MobilityMap'
import { useAppState } from '../state/AppState'
import { recommendRoute } from '../lib/engine'

export function RouteCompare() {
  const navigate = useNavigate()
  const { state, patchJourney, emitAgentEvent } = useAppState()
  const recommended = recommendRoute(state.journey.routeOptions, state)
  const selected = state.journey.selectedRoute ?? recommended.id
  const easier = recommended.id === 'B'
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
          <b>ME → READY → ROAD · 已完成判断</b>
        </header>
        <div className="compare-grid">
          <section className="compare-map"><MobilityMap /><div className="map-legend"><span><i className="route-a" />路线 A · {recommended.id === 'A' ? '当前推荐' : '最快'}</span><span><i className="route-b" />路线 B · {recommended.id === 'B' ? '当前推荐' : '更简单'}</span></div></section>
          <aside className="route-inspector-v3">
            <span className="panel-kicker">路线判断</span>
            {state.journey.routeOptions.map(route => <button key={route.id} onClick={() => patchJourney({ selectedRoute: route.id })} className={selected === route.id ? 'route-card selected' : 'route-card'}>
              <header><span>路线 {route.id}{route.id === recommended.id ? <em>推荐</em> : <em>{route.id === 'A' ? '最快' : '更简单'}</em>}</span>{selected === route.id ? <Check /> : null}</header>
              <div className="route-numbers"><strong>{route.duration}<small> min</small></strong><span>{route.distance} km</span><span>难度 {route.difficultyScore}/15</span></div>
              <ul><li><GitFork />{route.complexInterchanges} 个复杂立交</li><li><ShieldCheck />{route.familiarRoadRatio}% 熟悉道路</li><li><ParkingCircle />停车 {route.parkingComplexity === 'easy' ? '更简单' : '有压力'}</li></ul>
            </button>)}
            <div className="route-reason"><Clock3 /><div><strong>{easier ? '多花 5 分钟，换来更少的临场压力。' : '你已经具备独立高架经验，可以优先更快路线。'}</strong><p>{easier ? `来自你：高架 ${state.familiarity.elevatedRoad}；来自路线：A 有 3 个复杂分流；来自天气：${state.journey.weather}。最终推荐 B。` : '高架、快速路和复杂变道经验都已更新，Route A 的时间优势开始高于复杂度成本。'}</p></div></div>
            <button className="primary-action" onClick={() => { patchJourney({ selectedRoute: selected }); navigate('/trip/rehearsal') }}>选择路线 {selected}，开始预演 <ArrowRight /></button>
          </aside>
          <AgentActivity />
        </div>
        <footer className="compare-context"><span><MapPin />判断依据</span><b>快速路 · {state.familiarity.expressway}</b><b>高架 · {state.familiarity.elevatedRoad}</b><b>复杂变道 · {state.familiarity.complexLaneChange}</b><b>雨天 · {state.familiarity.rainDriving}</b></footer>
      </div>
    </AppShell>
  )
}

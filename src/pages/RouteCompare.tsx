import { ArrowLeft, ArrowRight, Check, CircleParking, GitFork, Route as RouteIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { AgentTrace } from '../components/AgentTrace'
import { Button } from '../components/Button'
import { RouteMap } from '../components/RouteMap'
import { useAppState } from '../state/AppState'

export function RouteCompare() {
  const navigate = useNavigate()
  const { state, patchJourney } = useAppState()
  const selected = state.journey.selectedRoute ?? 'B'
  const choose = (id: 'A' | 'B') => patchJourney({ selectedRoute: id })

  return (
    <AppShell compact>
      <div className="compare-page">
        <header className="compare-title">
          <div><button onClick={() => navigate('/trip/new')}><ArrowLeft size={17} /></button><div><h1>从{state.journey.origin}到{state.journey.destination}</h1><p>{state.journey.departureTime} 出发 · {state.journey.weather} · 紧凑型燃油 SUV</p></div></div>
          <span>Demo Data</span>
        </header>
        <div className="compare-main">
          <RouteMap selected={selected} />
          <aside className="route-inspector">
            {state.journey.routeOptions.map(route => (
              <button key={route.id} className={selected === route.id ? 'route-option selected' : 'route-option'} onClick={() => choose(route.id)}>
                <header><span><i className={`route-swatch route-${route.id.toLowerCase()}`} /> 路线 {route.id}{selected === route.id ? <Check size={15} /> : null}</span><strong>{route.duration} <small>分钟</small> / {route.distance} <small>km</small> / <em>{route.id === 'B' ? '推荐' : '最快'}</em></strong></header>
                <div>{route.factors.map((factor, index) => <span key={factor.label} className={`factor factor-${factor.tone}`}>{index === route.factors.length - 1 ? <CircleParking size={18} /> : <GitFork size={18} />}{factor.label}</span>)}</div>
              </button>
            ))}
            <div className="route-recommendation"><RouteIcon size={28} /><div><h2>更适合你现在的路线</h2><p>多花 5 分钟，换来更少的复杂节点、更高的熟悉道路比例和更简单的停车入口。</p></div></div>
            <AgentTrace />
          </aside>
        </div>
        <footer className="compare-footer">
          <div className="compare-familiarity"><span>你的驾驶经验与偏好</span><b className="good">城市普通道路<small>已熟悉</small></b><b className="prepare">快速路<small>希望先了解</small></b><b>高架<small>未经历</small></b><b>复杂变道<small>未经历</small></b></div>
          <div className="compare-actions"><Button variant="secondary" onClick={() => choose('A')}>查看路线 A</Button><Button onClick={() => { choose('B'); navigate('/trip/rehearsal') }}>选择路线 B <ArrowRight size={17} /></Button></div>
        </footer>
      </div>
    </AppShell>
  )
}

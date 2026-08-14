import { ArrowRight, Check, History as Timeline, MapPin, Route, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

export function Memory() {
  const { state } = useAppState()
  return (
    <AppShell>
      <div className="memory-page page-frame">
        <header className="page-heading"><h1>汽车成长史</h1><p>Person、Familiarity、Vehicle、Journey、Cost 与 Incident Memory 汇成一条时间线。</p></header>
        <div className="memory-layout">
          <section className="journey-list memory-timeline"><h2>Memory Timeline</h2>{state.memory.timeline.map(entry => <article key={entry.id}><span>{entry.domain === 'journey' ? <Route size={22} /> : <Timeline size={22} />}</span><div><h3>{entry.title}</h3><p>{entry.date} · {entry.domain.toUpperCase()} · {entry.detail}</p></div><Check size={18} /></article>)}</section>
          <aside className="radius-panel"><Sparkles size={25} /><h2>你的行动半径正在变大</h2><p>已经独立完成 {state.memory.completedScenarios.length} 类场景。下一次，系统会减少你已经不需要的基础提醒。</p><div>{state.memory.completedScenarios.slice(-4).map(item => <span key={item}><MapPin size={14} />{item}</span>)}</div><Link to="/trip/new">开始下一段路 <ArrowRight size={17} /></Link></aside>
        </div>
      </div>
    </AppShell>
  )
}

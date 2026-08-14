import { ArrowRight, Check, MapPin, Route, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

export function Memory() {
  const { state } = useAppState()
  return (
    <AppShell>
      <div className="memory-page page-frame">
        <header className="page-heading"><h1>旅程记忆</h1><p>FirstDrive 记住的不是一个分数，是你真正完成过的每一段路。</p></header>
        <div className="memory-layout">
          <section className="journey-list"><h2>最近旅程</h2>{state.memory.journeys.map((journey, index) => <article key={`${journey.route}-${index}`}><span><Route size={22} /></span><div><h3>{journey.route}</h3><p>{journey.date} · {journey.distance} km · {journey.duration} 分钟</p></div><Check size={18} /></article>)}</section>
          <aside className="radius-panel"><Sparkles size={25} /><h2>你的行动半径正在变大</h2><p>已经独立完成 {state.memory.completedScenarios.length} 类场景。下一次，系统会减少你已经不需要的基础提醒。</p><div>{state.memory.completedScenarios.slice(-4).map(item => <span key={item}><MapPin size={14} />{item}</span>)}</div><Link to="/trip/new">开始下一段路 <ArrowRight size={17} /></Link></aside>
        </div>
      </div>
    </AppShell>
  )
}

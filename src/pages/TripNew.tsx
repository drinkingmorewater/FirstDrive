import { ArrowLeft, ArrowRight, CalendarClock, CloudRain, LocateFixed, MapPin, Sparkles } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { runPlanningSequence } from '../agents'
import { AgentActivity } from '../components/AgentActivity'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

export function TripNew() {
  const navigate = useNavigate()
  const { state, patchJourney, emitAgentEvent } = useAppState()
  const [origin, setOrigin] = useState(state.journey.origin)
  const [destination, setDestination] = useState(state.journey.destination)
  const [time, setTime] = useState(state.journey.departureTime)
  const [loading, setLoading] = useState(false)
  const ran = useRef(false)
  const runtimeState = useRef(state)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    runPlanningSequence(runtimeState.current, emitAgentEvent)
  }, [emitAgentEvent])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    patchJourney({ origin, destination, departureTime: time, completionStatus: 'draft' })
    setLoading(true)
    window.setTimeout(() => navigate('/trip/compare'), 700)
  }

  return (
    <AppShell compact>
      <div className="workspace-page trip-planner">
        <Link to="/" className="text-link"><ArrowLeft /> 返回首页</Link>
        <header className="workspace-heading"><div><span className="eyebrow">DRIVE SAFE · JOURNEY SETUP</span><h1>把陌生，提前变成<br />你已经见过的路。</h1><p>Ready Agent 会把你的熟悉度、车辆与实时环境一起加入路线判断。</p></div></header>
        <div className="planner-grid">
          <form onSubmit={submit} className="journey-form">
            <label><span><LocateFixed /> 出发地</span><input value={origin} onChange={event => setOrigin(event.target.value)} /></label>
            <i className="field-connector" />
            <label><span><MapPin /> 目的地</span><input value={destination} onChange={event => setDestination(event.target.value)} /></label>
            <label><span><CalendarClock /> 出发时间</span><input value={time} onChange={event => setTime(event.target.value)} /></label>
            <div className="context-preview"><CloudRain /><div><small>预计环境</small><strong>小雨 · 18°C · 白天 · 路面湿滑</strong></div><b>DEMO DATA</b></div>
            <button className="primary-action" disabled={loading}>{loading ? 'Agents 正在协作规划…' : <>比较适合我的路线 <ArrowRight /></>}</button>
          </form>
          <aside className="known-profile">
            <Sparkles /><span>FIRSTDRIVE 已经记得</span><h2>不是“新手”，而是<br />实际驾驶较少的持证者。</h2>
            <dl><div><dt>城市道路</dt><dd>已熟悉</dd></div><div><dt>快速路</dt><dd>希望先了解</dd></div><div><dt>高架</dt><dd>未独立完成</dd></div><div><dt>辅助方式</dt><dd>提前提醒</dd></div></dl>
          </aside>
          <AgentActivity emptyText="正在初始化规划 Agents" />
        </div>
      </div>
    </AppShell>
  )
}

import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Eye, Lightbulb, TimerReset } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { RehearsalDiagram } from '../components/RehearsalDiagram'
import { useAppState } from '../state/AppState'

export function Rehearsal() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [index, setIndex] = useState(0)
  const [understood, setUnderstood] = useState<number[]>([])
  const point = state.journey.rehearsalPoints[index]

  return (
    <AppShell compact>
      <div className="rehearsal-v3">
        <header><Link to="/trip/compare"><ArrowLeft /> 返回路线比较</Link><div><span>ROUTE REHEARSAL</span><strong>3 个关键点 · 约 6 分钟</strong></div></header>
        <div className="rehearsal-grid">
          <section className="road-stage">
            <AnimatePresence mode="wait"><motion.div key={point.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}><RehearsalDiagram point={point} /></motion.div></AnimatePresence>
            <div className="road-stage-tag"><Eye /><span>你会先看到</span><strong>{point.kind === 'merge' ? '右侧入口与加速车道' : point.kind === 'split' ? '北城方向标牌与右侧分流' : '公交站后的地面停车入口'}</strong></div>
          </section>
          <aside className="rehearsal-guide">
            <span className="panel-kicker">关键点 {index + 1} / {state.journey.rehearsalPoints.length}</span>
            <h1>{point.title}</h1><p className="point-meta"><Clock3 /> 预计 {point.time} · {point.distance}</p>
            <div className="core-callout"><CircleAlert /><strong>{point.coreReminder}</strong></div>
            <div className="guide-row"><TimerReset /><div><small>什么时候开始准备</small><strong>{point.preparation}</strong></div></div>
            <div className="guide-row"><Lightbulb /><div><small>提前知道</small>{point.tips.map(tip => <p key={tip}>· {tip}</p>)}</div></div>
            <button className={understood.includes(index) ? 'understood checked' : 'understood'} onClick={() => setUnderstood(current => current.includes(index) ? current : [...current, index])}><Check />{understood.includes(index) ? '已加入驾驶提示' : '我已理解这个关键点'}</button>
          </aside>
        </div>
        <footer className="rehearsal-timeline-v3">
          {state.journey.rehearsalPoints.map((item, itemIndex) => <button key={item.id} className={itemIndex === index ? 'active' : ''} onClick={() => setIndex(itemIndex)}><i>{understood.includes(itemIndex) ? <Check /> : itemIndex + 1}</i><span>{item.time}</span><strong>{item.title}</strong></button>)}
          {index < state.journey.rehearsalPoints.length - 1
            ? <button className="primary-action" onClick={() => setIndex(value => value + 1)}>下一个关键点 <ArrowRight /></button>
            : <button className="primary-action" onClick={() => navigate('/trip/checklist')}>查看出发清单 <ArrowRight /></button>}
        </footer>
      </div>
    </AppShell>
  )
}

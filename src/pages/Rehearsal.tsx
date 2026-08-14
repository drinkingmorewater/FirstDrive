import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Lightbulb, TimerReset } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { RehearsalDiagram } from '../components/RehearsalDiagram'
import { useAppState } from '../state/AppState'

export function Rehearsal() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [index, setIndex] = useState(0)
  const [understood, setUnderstood] = useState<Set<number>>(new Set())
  const point = state.journey.rehearsalPoints[index]

  const mark = () => setUnderstood(current => new Set(current).add(index))
  const next = () => setIndex(current => Math.min(current + 1, state.journey.rehearsalPoints.length - 1))

  return (
    <AppShell compact>
      <div className="rehearsal-page">
        <header className="rehearsal-top"><button onClick={() => navigate('/trip/compare')}><ArrowLeft size={17} /> 返回路线比较</button><span>从家到医院 / 路线预演</span></header>
        <div className="rehearsal-main">
          <section className="rehearsal-visual">
            <AnimatePresence mode="wait"><motion.div key={point.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .28 }}><RehearsalDiagram point={point} /></motion.div></AnimatePresence>
            <div className="rehearsal-timeline">
              {state.journey.rehearsalPoints.map((item, itemIndex) => (
                <button key={item.id} className={`${itemIndex === index ? 'active' : ''} ${understood.has(itemIndex) ? 'done' : ''}`} onClick={() => setIndex(itemIndex)}>
                  <span>{understood.has(itemIndex) ? <Check size={15} /> : itemIndex + 1}</span><time>{item.time}</time><b>{item.title.replace('第一次进入', '').replace('停车入口', '')}</b>
                </button>
              ))}
            </div>
          </section>
          <aside className="rehearsal-copy">
            <span className="rehearsal-progress">{index + 1} / {state.journey.rehearsalPoints.length}</span>
            <h1>{point.title}</h1>
            <p className="point-time"><Clock3 size={18} /> 预计 {point.time}</p>
            <div className="core-reminder"><CircleAlert size={29} /><strong>{point.coreReminder}</strong></div>
            <div className="knowledge-block"><TimerReset size={21} /><div><span>什么时候开始准备</span><b>{point.preparation}</b></div></div>
            <div className="knowledge-block tips"><Lightbulb size={21} /><div><span>提前知道</span><ul>{point.tips.map(tip => <li key={tip}>{tip}</li>)}</ul></div></div>
            <div className="step-buttons"><Button variant="secondary" disabled={index === 0} onClick={() => setIndex(value => Math.max(0, value - 1))}>上一个</Button><Button variant={understood.has(index) ? 'ghost' : 'secondary'} onClick={mark}><Check size={17} /> {understood.has(index) ? '已理解' : '我已理解'}</Button><Button onClick={next} disabled={index === state.journey.rehearsalPoints.length - 1}>下一个 <ArrowRight size={16} /></Button></div>
            <Button wide onClick={() => navigate('/trip/checklist')}>完成预演，查看出发清单 <ArrowRight size={17} /></Button>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

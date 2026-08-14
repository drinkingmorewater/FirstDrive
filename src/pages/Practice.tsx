import { ArrowRight, CheckCircle2, Clock3, Map, ParkingCircle, Route, Save, SunMedium } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { familiarityLabels } from '../data/demo'
import { readyTools } from '../tools'
import { useAppState } from '../state/AppState'
import type { FamiliarityKey } from '../types'

const practiceScenes: FamiliarityKey[] = ['elevatedRoad', 'expressway', 'highwayMerge', 'parking', 'nightDriving']

export function Practice() {
  const navigate = useNavigate()
  const { state, addTimeline, emitAgentEvent } = useAppState()
  const [scene, setScene] = useState<FamiliarityKey>('elevatedRoad')
  const [generated, setGenerated] = useState(false)
  const [selected, setSelected] = useState<'A' | 'B'>('A')
  const plan = useMemo(() => readyTools.createPracticePlan(state), [state])
  const generate = () => {
    emitAgentEvent({ agent: 'ready', status: 'running', title: '正在生成 Low-Pressure Practice Plan', detail: `读取${familiarityLabels[scene]}熟悉度、时间与道路复杂度` })
    setGenerated(true)
    emitAgentEvent({ agent: 'ready', status: 'completed', title: '练习路线已生成', detail: '推荐 Plan A：25 分钟，只包含一个简单入口，终点停车容易' })
  }
  const save = () => {
    addTimeline({ id: `practice-${Date.now()}`, date: new Date().toISOString().slice(0, 10), domain: 'journey', title: `创建${familiarityLabels[scene]}练习计划`, detail: `Plan ${selected} · ${selected === 'A' ? 25 : 42} 分钟 · 白天低压力练习。` })
    navigate('/trip/rehearsal')
  }
  return <AppShell><div className="practice-page page-frame"><header className="first-feature-hero"><div><span>PRACTICE MODE</span><h1>先练一小段，<br />再独立走更远。</h1><p>根据熟悉度、时间和道路复杂度，生成一个低压力练习计划。</p></div><Route /></header>
    <section className="practice-input"><span>我想先练习</span><div>{practiceScenes.map(item => <button key={item} className={scene === item ? 'active' : ''} onClick={() => { setScene(item); setGenerated(false) }}>{familiarityLabels[item]}</button>)}</div><button onClick={generate}>生成练习计划 <ArrowRight /></button></section>
    {generated ? <div className="practice-plans"><article className={selected === 'A' ? 'selected' : ''} onClick={() => setSelected('A')}><header><span>PLAN A · RECOMMENDED</span><CheckCircle2 /></header><strong>{plan.duration} 分钟</strong><h2>普通道路 + {plan.scene}</h2><div><span><SunMedium />工作日上午 / 白天</span><span><ParkingCircle />终点停车简单</span><span><Map />避开复杂连续变道</span></div><p>适合第一次独自尝试；进入高架后在下一个出口驶离。</p></article><article className={selected === 'B' ? 'selected' : ''} onClick={() => setSelected('B')}><header><span>PLAN B · NEXT STEP</span><Clock3 /></header><strong>42 分钟</strong><h2>两个入口 + 一次分流</h2><div><span><SunMedium />周末上午</span><span><ParkingCircle />地面停车</span><span><Map />中等复杂度</span></div><p>建议完成 Plan A 后，再独立尝试这条路线。</p></article></div> : <div className="practice-placeholder"><Map /><strong>选择一个场景开始</strong><span>Ready Agent 会先给出最容易完成的 Plan A。</span></div>}
    {generated ? <button className="practice-save" onClick={save}><Save />保存 Plan {selected} 并开始预演</button> : null}
  </div></AppShell>
}

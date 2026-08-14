import { ArrowRight, Check, CheckCircle2, CloudRain, Flag, Moon, Route, Sparkles, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { familiarityLabels, statusMeta } from '../data/demo'
import { useAppState } from '../state/AppState'
import type { FamiliarityKey } from '../types'

const firstItems: Array<{ key: FamiliarityKey; label: string; Icon: typeof Route }> = [
  { key: 'highway', label: '第一次高速', Icon: Route }, { key: 'elevatedRoad', label: '第一次高架', Icon: Route },
  { key: 'expressway', label: '第一次长途', Icon: Flag }, { key: 'nightDriving', label: '第一次夜间', Icon: Moon },
  { key: 'rainDriving', label: '第一次雨天', Icon: CloudRain }, { key: 'charging', label: '第一次新能源长途', Icon: Zap },
  { key: 'mountainRoad', label: '第一次国外驾驶', Icon: Sparkles },
]

export function Firsts() {
  const { state, updateFamiliarity, addTimeline } = useAppState()
  const [selected, setSelected] = useState<FamiliarityKey>('elevatedRoad')
  const [stage, setStage] = useState(0)
  const current = firstItems.find(item => item.key === selected)!
  const completed = useMemo(() => firstItems.filter(item => ['completed_independently', 'familiar'].includes(state.familiarity[item.key])).length, [state.familiarity])
  const action = () => {
    if (stage < 3) { setStage(value => value + 1); return }
    updateFamiliarity(selected, 'completed_independently')
    addTimeline({ id: `first-${Date.now()}`, date: new Date().toISOString().slice(0, 10), domain: 'familiarity', title: current.label, detail: '已独立完成；下一次将减少基础提醒。' })
  }
  return <AppShell><div className="firsts-page page-frame"><header className="first-feature-hero"><div><span>FIRST-TIME CENTER</span><h1>我的第一次</h1><p>把陌生场景变成 Preparation → Rehearsal → Checklist → Completed 的行动地图。</p></div><aside><strong>{completed}</strong><span>已独立完成</span></aside></header>
    <div className="firsts-layout"><section className="firsts-map">{firstItems.map(({ key, label, Icon }, index) => <button key={key} className={selected === key ? 'active' : ''} onClick={() => { setSelected(key); setStage(0) }}><b>0{index + 1}</b><span><Icon /><strong>{label}</strong><small>{statusMeta[state.familiarity[key]].label}</small></span>{['completed_independently', 'familiar'].includes(state.familiarity[key]) ? <CheckCircle2 /> : <ArrowRight />}</button>)}</section><aside className="firsts-action"><span>{current.label}</span><h2>{familiarityLabels[selected]}</h2><div className="firsts-steps">{['Preparation', 'Rehearsal', 'Checklist', 'Completed'].map((item, index) => <span key={item} className={index < stage ? 'done' : index === stage ? 'active' : ''}><i>{index < stage ? <Check /> : index + 1}</i><b>{item}</b></span>)}</div><p>{stage === 0 ? '先生成一个低压力计划，选择更容易的时间和入口。' : stage === 1 ? '提前看见关键分流、车道与停车入口。' : stage === 2 ? '按人 × 车 × 路 × 环境生成出发检查。' : '完成后写回 Familiarity Memory，并减少下一次提醒。'}</p><button onClick={action}>{stage === 3 ? '标记为已独立完成' : stage === 0 ? '生成 Practice Plan' : stage === 1 ? '开始路线预演' : '打开出发检查'}<ArrowRight /></button></aside></div>
  </div></AppShell>
}

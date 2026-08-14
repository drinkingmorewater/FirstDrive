import { CarFront, Check, CircleHelp, Globe2, Map, UserRound } from 'lucide-react'
import { AgentMesh } from './AgentMesh'
import { ContextQuadrant } from './ContextQuadrant'
import { familiarityLabels } from '../data/demo'
import { useAppState } from '../state/AppState'

const stateLabel = { confirmed: 'Confirmed', inferred: 'Inferred', need_to_confirm: 'Need to confirm' }

export function MobilityIntelligenceCanvas() {
  const { state } = useAppState()
  const draft = state.profileIntake.draft
  if (!draft) return null
  const familiarFacts = Object.entries(draft.familiarity)
  const vehicleFact = draft.evidence.find(item => item.id === 'vehicle')?.value ?? `${state.vehicle.brand} ${state.vehicle.model}`
  const city = draft.mobility.city ?? draft.evidence.find(item => item.id === 'city')?.value ?? '待确认'
  return <div className="intelligence-layout">
    <aside className="heard-panel"><small>WHAT I HEARD</small><h2>你的原话</h2><blockquote>“{draft.transcript}”</blockquote><div>{draft.evidence.map(item => <span key={item.id} className={item.state}><b>{item.label}</b><strong>{item.value}</strong><small>{stateLabel[item.state]}</small></span>)}</div></aside>
    <main className="mobility-context"><header><small>PERSONAL MOBILITY CONTEXT</small><h2>这是我现在理解的你。</h2><p>每条信息都保留可信状态，你随时可以修正。</p></header><div className="context-grid">
      <ContextQuadrant index="01" title="人 · ME" en="PERSON" icon={<UserRound />}><p>驾照 {draft.mobility.licenseYears ?? state.user.mobility.licenseYears} 年</p><p>{draft.mobility.drivingFrequency ?? state.user.mobility.drivingFrequency}</p><p>{draft.passengerPattern?.join(' · ') || '乘员模式待确认'}</p></ContextQuadrant>
      <ContextQuadrant index="02" title="车 · VEHICLE" en="CAR" icon={<CarFront />}><p>{vehicleFact}</p><p>{draft.mobility.homeCharging === true ? '有家庭充电条件' : draft.mobility.homeCharging === false ? '无家庭充电条件' : '补能条件待确认'}</p><p>{state.user.mobility.vehiclePriorities.slice(0, 2).join(' · ')}</p></ContextQuadrant>
      <ContextQuadrant index="03" title="路 · ROAD" en="ROAD" icon={<Map />}>{familiarFacts.length ? familiarFacts.map(([key, value]) => <p key={key}>{familiarityLabels[key as keyof typeof familiarityLabels]} · {value === 'want_to_prepare' ? '希望先准备' : '已有经验'}</p>) : <p>道路熟悉度待确认</p>}</ContextQuadrant>
      <ContextQuadrant index="04" title="境 · WORLD" en="CONTEXT" icon={<Globe2 />}><p>{city}</p><p>{draft.evidence.some(item => item.id === 'abroad') ? '包含境外驾驶需求' : '主要为国内驾驶'}</p><p>天气与时段将在任务中动态读取</p></ContextQuadrant>
    </div><section className="learned-summary"><article><Check /><span><small>我已经知道</small><strong>{draft.learned[0]}</strong></span></article><article><CircleHelp /><span><small>我还想确认</small><strong>{draft.questions[0] ?? '目前没有必须确认的信息'}</strong></span></article><article><Map /><span><small>你的下一公里可能是</small><strong>{familiarityLabels[draft.nextFirst]}</strong></span></article></section></main>
    <aside className="analysis-mesh"><AgentMesh /></aside>
  </div>
}

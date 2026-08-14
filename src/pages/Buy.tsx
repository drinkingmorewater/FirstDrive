import { Bookmark, ChevronDown, CircleHelp, Filter, FolderOpen, MoreHorizontal, PlusSquare, Share2, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { buyAgent } from '../agents'
import { personaSummaries, vehicles } from '../data/demo'
import { BuyProfileRail } from '../features/buy/BuyProfileRail'
import { DealWorkflow, DeliveryWorkflow, UsedCarWorkflow } from '../features/buy/BuyWorkflowPanels'
import { TcoPanel } from '../features/buy/TcoPanel'
import { VehicleRanking } from '../features/buy/VehicleRanking'
import { rankVehicles } from '../lib/engine'
import { buyTools } from '../tools'
import { useAppState } from '../state/AppState'
import type { BuySession, SavedBuyPlan, ScenarioId } from '../types'

type BuyView = 'fit' | 'tco' | 'deal' | 'delivery' | 'used'

const tabs: Array<{ id: BuyView; label: string }> = [
  { id: 'fit', label: 'Life Fit' }, { id: 'tco', label: 'True Cost' }, { id: 'deal', label: 'Deal Checker' },
  { id: 'delivery', label: 'Delivery Check' }, { id: 'used', label: 'Used Car' },
]

const scenarios: Array<{ id: ScenarioId; label: string }> = [
  { id: 'commute', label: '每天上下班' }, { id: 'family', label: '家庭成员增加' }, { id: 'roadtrip', label: '每月一次长途' },
  { id: 'rideHailing', label: '兼职网约车' }, { id: 'camping', label: '周末露营' },
]

export function Buy() {
  const { state, patchBuySession, emitAgentEvent, saveBuyPlan, switchPersona } = useAppState()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') as BuyView | null
  const [view, setView] = useState<BuyView>(tabs.some(tab => tab.id === initialTab) ? initialTab! : 'fit')
  const [moreOpen, setMoreOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [scoreOpen, setScoreOpen] = useState(false)
  const [ownershipOpen, setOwnershipOpen] = useState(false)
  const [personaOpen, setPersonaOpen] = useState(false)
  const [toast, setToast] = useState('')
  const lastAgentRun = useRef('')

  const profile = state.user.mobility
  const session = state.buySession
  const resultSignature = `${profile.purchaseBudget}-${profile.annualMileageKm}-${profile.homeCharging}-${profile.passengerPattern.join(',')}-${session.scenario}-${session.energyFilter}-${session.bodyFilter}-${JSON.stringify(session.assumptions)}`

  useEffect(() => {
    if (lastAgentRun.current === resultSignature) return
    lastAgentRun.current = resultSignature
    void buyAgent.execute({ state, emit: emitAgentEvent })
  }, [emitAgentEvent, resultSignature, state])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const ranked = useMemo(() => rankVehicles(
    vehicles.filter(vehicle => (session.energyFilter === 'all' || vehicle.powerType === session.energyFilter) && (session.bodyFilter === 'all' || vehicle.bodyType === session.bodyFilter)),
    profile, state.familiarity, session.scenario, session.assumptions,
  ), [profile, session, state.familiarity])
  const results = ranked.slice(0, 3)
  const selected = results.find(item => item.vehicle.id === session.selectedVehicleId) ?? results[0]

  useEffect(() => {
    if (results.length && !results.some(item => item.vehicle.id === session.selectedVehicleId)) patchBuySession({ selectedVehicleId: results[0].vehicle.id })
  }, [patchBuySession, results, session.selectedVehicleId])

  const setTab = (tab: BuyView) => {
    setView(tab)
    setSearchParams(tab === 'fit' ? {} : { tab })
  }

  const savePlan = () => {
    if (!selected) return
    const plan: SavedBuyPlan = {
      id: `plan-${Date.now()}`, name: `${profile.city} · ${scenarios.find(item => item.id === session.scenario)?.label ?? '用车'}方案`,
      scenario: session.scenario, vehicleIds: results.map(item => item.vehicle.id), selectedVehicleId: selected.vehicle.id,
      createdAt: new Date().toISOString(), budget: profile.purchaseBudget ?? 0,
    }
    saveBuyPlan(plan)
    setToast('方案已保存到方案库，并写入 Cost Memory')
  }

  const exportReport = () => {
    const lines = [['车型', 'Fit Score', '首年现金支出', '月均成本', `${session.assumptions.ownershipYears}年TCO`], ...results.map(item => [
      `${item.vehicle.brand} ${item.vehicle.model}`, item.score, item.tco.firstYearCash, item.tco.monthlyAverage, item.tco.fiveYearTco,
    ])]
    const csv = lines.map(row => row.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'FirstDrive-TCO-report.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    setToast('TCO 对比报告已导出')
  }

  const share = async () => {
    const text = `FirstDrive ${profile.city} 购车方案：${results.map(item => `${item.vehicle.model} ${item.score}分`).join(' / ')}`
    try { await navigator.clipboard.writeText(text); setToast('分享摘要已复制') } catch { setToast(text) }
  }

  const newPlan = () => {
    patchBuySession({ scenario: 'commute', energyFilter: 'all', bodyFilter: 'all', selectedVehicleId: 'model3' })
    setView('fit')
    setSearchParams({})
    setToast('已创建一份基于当前 Mobility Profile 的新方案')
  }

  return (
    <div className="buy-smart-shell">
      <BuyProfileRail />
      <main className="buy-smart-main">
        <header className="buy-smart-header">
          <div><button className="buy-title">BUY SMART <ChevronDown /></button><p>为你的真实生活，买最合适的车</p></div>
          <nav aria-label="方案操作">
            <button onClick={newPlan}><PlusSquare />新建方案</button>
            <button onClick={() => setLibraryOpen(true)}><Bookmark />方案库{state.memory.cost.savedPlans.length ? <b>{state.memory.cost.savedPlans.length}</b> : null}</button>
            <button onClick={share}><Share2 />分享</button>
            <div className="header-more"><button aria-label="更多" onClick={() => setPersonaOpen(value => !value)}><MoreHorizontal /></button>{personaOpen ? <div className="persona-menu"><small>切换 Demo Persona</small>{personaSummaries.map(persona => <button key={persona.id} className={state.user.personaId === persona.id ? 'active' : ''} onClick={() => { switchPersona(persona.id); setPersonaOpen(false); setToast(`已切换到 ${persona.label}`) }}><strong>{persona.label}</strong><span>{persona.note}</span></button>)}</div> : null}</div>
          </nav>
        </header>
        <nav className="buy-tabs" aria-label="BUY SMART 工具">
          {tabs.map(tab => <button key={tab.id} className={view === tab.id ? 'active' : ''} onClick={() => setTab(tab.id)}>{tab.label}</button>)}
        </nav>

        <section className="scenario-strip">
          <span><Sparkles />如果我的生活是…</span>
          <div>{scenarios.map(item => <button key={item.id} className={session.scenario === item.id ? 'active' : ''} onClick={() => patchBuySession({ scenario: item.id })}>{item.label}</button>)}</div>
          <button className="own-check" onClick={() => setOwnershipOpen(true)}>我现在适合买车吗？<CircleHelp /></button>
        </section>

        <section className="buy-filterbar">
          <span>已筛选 132 款车</span><i />
          <label>预算：{Math.round((profile.idealBudget ?? 250000) / 10000)}–{Math.round((profile.purchaseBudget ?? 350000) / 10000)} 万元</label>
          <label>能源：<select value={session.energyFilter} onChange={event => patchBuySession({ energyFilter: event.target.value as BuySession['energyFilter'] })}><option value="all">不限</option><option value="ev">纯电</option><option value="hybrid">混动</option><option value="oil">燃油</option></select></label>
          <label>车身：<select value={session.bodyFilter} onChange={event => patchBuySession({ bodyFilter: event.target.value as BuySession['bodyFilter'] })}><option value="all">不限</option><option value="sedan">轿车</option><option value="suv">SUV</option></select></label>
          <button className={moreOpen ? 'active' : ''} onClick={() => setMoreOpen(value => !value)}>更多筛选 <Filter /></button>
          <button className="score-help" onClick={() => setScoreOpen(true)}>评分说明 <CircleHelp /></button>
        </section>
        {moreOpen ? <div className="more-filters"><SlidersHorizontal /><span>已将你的真实条件加入筛选：</span>{[profile.parkingType, profile.homeCharging ? '有家充' : '无家充', ...profile.vehiclePriorities.slice(0, 3)].map(item => <b key={item}>{item}</b>)}</div> : null}

        <div className={`buy-content ${view}`}>
          {results.length === 0 ? <div className="buy-empty"><Filter /><h2>当前筛选条件没有匹配车型</h2><p>放宽能源或车身条件后继续比较。</p><button onClick={() => patchBuySession({ energyFilter: 'all', bodyFilter: 'all' })}>清除筛选</button></div> : null}
          {view === 'fit' && results.length ? <><VehicleRanking results={results} selectedId={selected?.vehicle.id ?? ''} onSelect={id => patchBuySession({ selectedVehicleId: id })} /><TcoPanel results={results} selectedId={selected?.vehicle.id ?? ''} assumptions={session.assumptions} onAssumptions={patch => patchBuySession({ assumptions: { ...session.assumptions, ...patch } })} onExport={exportReport} /></> : null}
          {view === 'tco' && results.length ? <><section className="true-cost-head"><div><small>TRUE COST</small><h2>把车价之外的成本，全部摊开。</h2></div><p>每个数字都标明来源。调整里程、持有年限和停车成本，三辆车会同时重算。</p></section><TcoPanel results={results} selectedId={selected?.vehicle.id ?? ''} editable assumptions={session.assumptions} onAssumptions={patch => patchBuySession({ assumptions: { ...session.assumptions, ...patch } })} onExport={exportReport} /></> : null}
          {view === 'deal' && selected ? <DealWorkflow selected={selected} /> : null}
          {view === 'delivery' && selected ? <DeliveryWorkflow selected={selected} /> : null}
          {view === 'used' ? <UsedCarWorkflow /> : null}
        </div>
      </main>
      {libraryOpen ? <PlanLibrary onClose={() => setLibraryOpen(false)} onSave={savePlan} plans={state.memory.cost.savedPlans} onLoad={plan => { patchBuySession({ scenario: plan.scenario, selectedVehicleId: plan.selectedVehicleId }); setView('fit'); setLibraryOpen(false); setToast('方案已载入') }} /> : null}
      {scoreOpen ? <InfoDialog title="Fit Score 如何计算？" onClose={() => setScoreOpen(false)}><p>Fit Score 不是车型的绝对评分，而是当前车辆与你的生活之间的适配度。</p><ul><li>Budget Fit · 预算是否落在理想区间</li><li>Usage Fit · 当前生活场景与车身形态</li><li>Energy Fit · 家充与公共补能条件</li><li>Passenger / Parking / Long Trip Fit</li><li>Driving Familiarity 与月均 Cost Fit</li></ul><small>修改左侧任何画像字段，Buy Agent 都会使用同一套规则重新排序。</small></InfoDialog> : null}
      {ownershipOpen ? <OwnershipDialog state={state} onClose={() => setOwnershipOpen(false)} /> : null}
      {toast ? <div className="buy-toast"><CheckToast />{toast}</div> : null}
    </div>
  )
}

function PlanLibrary({ plans, onClose, onLoad, onSave }: { plans: SavedBuyPlan[]; onClose: () => void; onLoad: (plan: SavedBuyPlan) => void; onSave: () => void }) {
  return <div className="buy-dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="plan-library"><header><div><small>MY BUYING PLANS</small><h2>方案库</h2></div><button onClick={onClose}><X /></button></header>{plans.length ? <div>{plans.map(plan => <button key={plan.id} onClick={() => onLoad(plan)}><FolderOpen /><span><strong>{plan.name}</strong><small>{new Date(plan.createdAt).toLocaleString('zh-CN')} · {plan.vehicleIds.length} 款车</small></span><b>载入</b></button>)}</div> : <div className="plan-empty"><Bookmark /><strong>还没有保存的方案</strong><span>保存当前比较结果后，它会和 Profile 快照一起写入 Cost Memory。</span></div>}<footer><button onClick={onClose}>关闭</button><button className="primary" onClick={() => { onSave(); onClose() }}>保存当前方案</button></footer></section></div>
}

function InfoDialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="buy-dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="buy-info-dialog"><header><h2>{title}</h2><button onClick={onClose}><X /></button></header>{children}<footer><button onClick={onClose}>我知道了</button></footer></section></div>
}

function OwnershipDialog({ state, onClose }: { state: Parameters<typeof buyTools.compareOwnershipOptions>[0]; onClose: () => void }) {
  const options = buyTools.compareOwnershipOptions(state)
  return <InfoDialog title="我现在适合买车吗？" onClose={onClose}><p>基于年里程、停车、用车频率、家庭和预算的生活成本模拟，不构成金融建议。</p><div className="ownership-options">{options.map(option => <article key={option.id}><span><strong>{option.label}</strong><small>预计年成本 ¥{option.yearly.toLocaleString()}</small></span><b>{option.fit}%<small>生活适配</small></b></article>)}</div><small>结论：当前年里程与固定车位让“买车”具有稳定使用价值；二手车仍是降低首年现金压力的备选。</small></InfoDialog>
}

function CheckToast() { return <span className="check-toast">✓</span> }

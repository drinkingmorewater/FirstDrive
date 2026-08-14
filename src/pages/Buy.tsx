import { ArrowRight, BatteryCharging, Calculator, CarFront, CheckCircle2, ClipboardCheck, Fuel, Home, Scale, ShieldCheck, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { buyAgent } from '../agents'
import { AgentActivity } from '../components/AgentActivity'
import { AppShell } from '../components/AppShell'
import { vehicles } from '../data/demo'
import { calculateTCO } from '../lib/engine'
import { useAppState } from '../state/AppState'

type BuyView = 'fit' | 'tco' | 'delivery' | 'used'

export function Buy() {
  const { state, emitAgentEvent } = useAppState()
  const ran = useRef(false)
  const [view, setView] = useState<BuyView>('fit')
  const [budget, setBudget] = useState(18)
  const [homeCharging, setHomeCharging] = useState(false)
  const [annualKm, setAnnualKm] = useState(12000)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    void buyAgent.execute({ state, emit: emitAgentEvent })
  }, [emitAgentEvent, state])

  const picks = useMemo(() => vehicles
    .filter(car => car.price <= budget * 10000 * 1.15)
    .sort((a, b) => (homeCharging ? Number(b.powerType === 'ev') - Number(a.powerType === 'ev') : a.price - b.price))
    .slice(0, 3), [budget, homeCharging])

  return (
    <AppShell>
      <div className="workspace-page buy-v3">
        <header className="workspace-heading">
          <div><span className="eyebrow">BUY SMART · 聪明买</span><h1>不是推荐一辆车，<br />而是判断它是否适合你的生活。</h1></div>
          <Link className="secondary-link" to="/buy/deal"><Scale size={18} /> 检查一份报价单 <ArrowRight size={17} /></Link>
        </header>

        <nav className="subnav" aria-label="购车工具">
          <button className={view === 'fit' ? 'active' : ''} onClick={() => setView('fit')}><CarFront /> Life Fit</button>
          <button className={view === 'tco' ? 'active' : ''} onClick={() => setView('tco')}><Calculator /> TCO</button>
          <button className={view === 'delivery' ? 'active' : ''} onClick={() => setView('delivery')}><ClipboardCheck /> 提车检查</button>
          <button className={view === 'used' ? 'active' : ''} onClick={() => setView('used')}><ShieldCheck /> 二手车</button>
        </nav>

        <div className="buy-workspace">
          <aside className="buy-input-panel">
            <h2>你的真实用车条件</h2>
            <label><span>购车预算</span><strong>{budget} 万</strong><input type="range" min="10" max="35" value={budget} onChange={event => setBudget(Number(event.target.value))} /></label>
            <label><span><UsersRound /> 常用乘员</span><select defaultValue="3"><option value="2">1–2 人</option><option value="3">3 人</option><option value="5">4–5 人</option></select></label>
            <label><span><Home /> 固定车位与家充</span><button className={homeCharging ? 'switch on' : 'switch'} onClick={() => setHomeCharging(value => !value)}><i /></button></label>
            <label><span>年行驶里程</span><strong>{annualKm.toLocaleString()} km</strong><input type="range" min="6000" max="30000" step="1000" value={annualKm} onChange={event => setAnnualKm(Number(event.target.value))} /></label>
            <div className="context-chips"><span>每日通勤 30 km</span><span>城市停车一般</span><span>每月一次长途</span></div>
            <small>Demo Data · 结论会随输入即时更新</small>
          </aside>

          <main className="buy-result-panel">
            {view === 'fit' ? <>
              <div className="result-title"><div><span>生活适配排序</span><h2>更适合当前生活的 3 辆车</h2></div><b>BUY AGENT · UPDATED</b></div>
              <div className="vehicle-list">{picks.map((car, index) => {
                const tco = calculateTCO(car.price, car.powerType)
                const fit = Math.max(76, 94 - index * 6 + (homeCharging && car.powerType === 'ev' ? 5 : 0))
                return <article key={car.id}>
                  <span className="rank">0{index + 1}</span><div className="vehicle-glyph"><CarFront /></div>
                  <div className="vehicle-copy"><div><h3>{car.brand} {car.model}</h3><b>{fit}% 适配</b></div><p>{car.bodyType === 'suv' ? '空间与家庭出行匹配' : '城市通勤灵活'} · {car.powerType === 'ev' ? '纯电' : car.powerType === 'hybrid' ? '混动' : '燃油'}</p><span>{car.powerType === 'ev' && !homeCharging ? '没有家充，补能会带来额外规划。' : '补能条件与当前生活节奏匹配。'}</span></div>
                  <div className="vehicle-cost"><small>月均拥有成本</small><strong>¥{Math.round(tco.monthly * annualKm / 12000).toLocaleString()}</strong><span>五年 ¥{Math.round(tco.fiveYear * annualKm / 12000).toLocaleString()}</span></div>
                </article>
              })}</div>
            </> : null}

            {view === 'tco' ? <section className="tool-result">
              <span>TOTAL COST OF OWNERSHIP</span><h2>五年真正要付出的，不止车价。</h2>
              <div className="tco-grid">{picks.map(car => { const cost = calculateTCO(car.price, car.powerType); return <article key={car.id}><CarFront /><h3>{car.model}</h3><strong>¥{cost.fiveYear.toLocaleString()}</strong><p><Fuel /> 能源与保养</p><p><BatteryCharging /> 折旧与保险</p></article> })}</div>
            </section> : null}
            {view === 'delivery' ? <ChecklistTool title="提车当天，按现场顺序逐项完成" items={['核对 VIN 与合同配置', '检查漆面、玻璃与轮胎日期', '确认两把钥匙与随车工具', '完成车机、充电与灯光测试']} /> : null}
            {view === 'used' ? <ChecklistTool title="二手车先查证据，再谈价格" items={['登记证与维保记录一致性', '结构件、焊点与漆膜异常', '动力电池健康度或发动机工况', '第三方复检与保修边界']} /> : null}
          </main>
          <AgentActivity emptyText="Buy Agent 正在等待输入" />
        </div>
      </div>
    </AppShell>
  )
}

function ChecklistTool({ title, items }: { title: string; items: string[] }) {
  const [checked, setChecked] = useState<number[]>([])
  return <section className="tool-result"><span>GUIDED CHECK</span><h2>{title}</h2><div className="guided-checks">{items.map((item, index) => <button key={item} className={checked.includes(index) ? 'checked' : ''} onClick={() => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index])}><CheckCircle2 />{item}</button>)}</div><p>{checked.length} / {items.length} 已确认</p></section>
}

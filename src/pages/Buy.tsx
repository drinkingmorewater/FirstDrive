import { ArrowLeft, ArrowRight, BatteryCharging, CarFront, CircleDollarSign, Fuel, Home, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { vehicles } from '../data/demo'
import { calculateTCO } from '../lib/engine'

export function Buy() {
  const navigate = useNavigate()
  const [budget, setBudget] = useState(18)
  const [homeCharging, setHomeCharging] = useState(false)
  const [family, setFamily] = useState('3 人')
  const picks = useMemo(() => vehicles.filter(car => car.price <= budget * 10000 * 1.15).sort((a, b) => {
    if (homeCharging && a.powerType === 'ev') return -1
    if (homeCharging && b.powerType === 'ev') return 1
    return a.price - b.price
  }).slice(0, 3), [budget, homeCharging])

  return (
    <AppShell>
      <div className="buy-page page-frame">
        <button className="text-back" onClick={() => navigate('/')}><ArrowLeft size={17} /> 回到首页</button>
        <header className="page-heading"><h1>适合你的车，应该先适合你的生活。</h1><p>根据通勤、家庭、停车与补能条件，解释为什么适合，也说明可能不适合的地方。</p></header>
        <div className="buy-layout">
          <aside className="life-fit-form">
            <label><span><CircleDollarSign size={19} /> 预算</span><strong>{budget} 万元</strong><input type="range" min="10" max="35" value={budget} onChange={event => setBudget(Number(event.target.value))} /></label>
            <label><span><UsersRound size={19} /> 常用乘员</span><select value={family} onChange={event => setFamily(event.target.value)}><option>1–2 人</option><option>3 人</option><option>4–5 人</option></select></label>
            <label className="toggle-row"><span><Home size={19} /> 有固定车位与家充</span><button className={homeCharging ? 'toggle on' : 'toggle'} onClick={() => setHomeCharging(value => !value)}><i /></button></label>
            <div className="fit-context"><span>每日通勤 30 km</span><span>每月一次长途</span><span>城市停车空间一般</span></div>
            <small>所有车型与成本均为 Demo Data。</small>
          </aside>
          <section className="car-results">
            <h2>更适合当前生活的 3 辆车</h2>
            {picks.map((car, index) => { const tco = calculateTCO(car.price, car.powerType); return (
              <article key={car.id}>
                <span className="car-rank">0{index + 1}</span>
                <div className="car-icon"><CarFront size={42} /></div>
                <div className="car-main"><h3>{car.brand} {car.model}</h3><p>{car.bodyType === 'suv' ? 'SUV' : '轿车'} · {car.powerType === 'ev' ? '纯电' : car.powerType === 'hybrid' ? '混动' : '燃油'} · ¥{(car.price / 10000).toFixed(2)} 万</p><span>{car.bodyType === 'suv' ? `适合 ${family} 与周末出行；` : '城市通勤灵活；'}{car.powerType === 'ev' && !homeCharging ? '没有家充时补能需要额外规划。' : '当前补能条件匹配。'}</span></div>
                <div className="tco"><b>月均拥有成本</b><strong>¥{tco.monthly.toLocaleString()}</strong><small>首年 ¥{tco.firstYear.toLocaleString()} · 五年 ¥{tco.fiveYear.toLocaleString()}</small></div>
                <button aria-label={`查看${car.model}`}><ArrowRight /></button>
              </article>
            )})}
            {picks.length === 0 ? <div className="empty-result">当前预算下暂无匹配车型，试着提高预算范围。</div> : null}
          </section>
        </div>
      </div>
    </AppShell>
  )
}

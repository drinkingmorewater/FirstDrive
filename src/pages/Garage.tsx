import { ArrowRight, CarFront, Fuel, Gauge, NotebookText, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

export function Garage() {
  const { state } = useAppState()
  const vehicle = state.vehicle
  return (
    <AppShell>
      <div className="garage-page page-frame">
        <header className="page-heading"><h1>我的车</h1><p>在每一次出发前，只读取当前场景真正需要的车辆信息。</p></header>
        <div className="garage-hero"><div className="garage-car"><CarFront size={100} /></div><div><span>当前车辆</span><h2>{vehicle.brand} {vehicle.model}</h2><p>{vehicle.year} · {vehicle.bodyType === 'suv' ? '紧凑型 SUV' : '轿车'} · {vehicle.powerType === 'oil' ? '汽油' : vehicle.powerType === 'hybrid' ? '混动' : '纯电'}</p></div></div>
        <div className="vehicle-specs"><span><Gauge />推荐胎压<b>{vehicle.recommendedTirePressure}</b></span><span><Fuel />综合油耗<b>{vehicle.fuelConsumption} L/100km</b></span><span><Settings />上次保养<b>45 天前</b></span></div>
        <section className="manual-list"><h2>本次任务可能用到的说明书内容</h2>{vehicle.manualEntries.map(item => <article key={item}><NotebookText size={19} /><span>{item}</span><small>Demo Manual</small></article>)}</section>
        <Link to="/trip/new" className="inline-cta">用这辆车规划一次出发 <ArrowRight size={18} /></Link>
      </div>
    </AppShell>
  )
}

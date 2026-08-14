import { BatteryCharging, BookOpen, CloudSnow, Gauge, Search, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

const contextualEntries = {
  highway: ['建议胎压与冷胎检查', 'ACC 开启、取消与接管', 'ETC 与灯光设置', '三角警示牌和紧急工具位置'],
  rain: ['前后雨刷与自动雨量感应', '前风挡除雾', '湿滑路面驾驶模式', '灯光自动开启逻辑'],
  snow: ['低温胎压变化', '前后除霜', '能量回收等级', '雪地/湿滑驾驶注意事项'],
  energy: ['补能口位置与开启', '预约充电', '剩余续航显示', '应急解锁方式'],
}

export function VehicleManual() {
  const { state } = useAppState()
  const [scenario, setScenario] = useState<keyof typeof contextualEntries>('highway')
  const [query, setQuery] = useState('')
  const entries = useMemo(() => [...contextualEntries[scenario], ...state.vehicle.manualEntries].filter(item => !query || item.includes(query)), [query, scenario, state.vehicle.manualEntries])
  return <AppShell><div className="manual-page page-frame"><header className="first-feature-hero"><div><span>CONTEXTUAL MANUAL</span><h1>说明书会在需要时，<br />自己来到你面前。</h1><p>{state.vehicle.brand} {state.vehicle.model} · 当前条目来自 Demo Manual Source，更新时间 2026-08-14。</p></div><BookOpen /></header><div className="manual-toolbar"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索：胎压、ACC、除雾……" /></label><div><button className={scenario === 'highway' ? 'active' : ''} onClick={() => setScenario('highway')}><Gauge />第一次高速</button><button className={scenario === 'rain' ? 'active' : ''} onClick={() => setScenario('rain')}><ShieldCheck />雨天</button><button className={scenario === 'snow' ? 'active' : ''} onClick={() => setScenario('snow')}><CloudSnow />雪天</button><button className={scenario === 'energy' ? 'active' : ''} onClick={() => setScenario('energy')}><BatteryCharging />补能</button></div></div><section className="manual-results"><header><small>READY AGENT PUSH</small><h2>{scenario === 'highway' ? '准备第一次高速，需要知道这些' : scenario === 'rain' ? '进入雨天，需要知道这些' : scenario === 'snow' ? '进入低温与雪天，需要知道这些' : '准备补能，需要知道这些'}</h2></header>{entries.map((item, index) => <article key={item}><b>{String(index + 1).padStart(2, '0')}</b><div><strong>{item}</strong><p>只展示当前动作需要的说明；执行前仍以车辆实际状态与官方手册为准。</p><small>Demo Manual Source · updated 2026-08-14</small></div></article>)}</section></div></AppShell>
}

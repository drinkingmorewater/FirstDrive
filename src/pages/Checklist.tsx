import { ArrowLeft, ArrowRight, Check, CloudRain, Fuel, Gauge, MapPin, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { createPreDriveChecklist } from '../lib/agents'
import { useAppState } from '../state/AppState'

const icons = [Gauge, Fuel, MapPin, ShieldCheck, CloudRain, Check]

export function Checklist() {
  const navigate = useNavigate()
  const { state, patchJourney } = useAppState()
  const items = useMemo(() => createPreDriveChecklist(state), [state])
  const [checked, setChecked] = useState<number[]>([])
  const toggle = (index: number) => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index])

  return (
    <AppShell compact>
      <div className="workspace-page checklist-v3">
        <Link to="/trip/rehearsal" className="text-link"><ArrowLeft /> 回到路线预演</Link>
        <header className="workspace-heading"><div><span className="eyebrow">PRE-DRIVE CHECK</span><h1>为这一次出发，<br />只检查真正相关的事。</h1><p>清单来自当前的人、车、路线与环境，不是通用模板。</p></div><div className="check-progress"><strong>{checked.length}</strong><span>/ {items.length}<small>已确认</small></span></div></header>
        <div className="check-context"><span>家 → {state.journey.destination}</span><span>路线 B · 24 km</span><span>小雨 · 白天</span><span>{state.vehicle.model}</span></div>
        <div className="checklist-grid">{items.map((item, index) => { const Icon = icons[index] ?? Check; return <button key={item} className={checked.includes(index) ? 'checked' : ''} onClick={() => toggle(index)}><span><Icon /></span><div><small>0{index + 1}</small><strong>{item}</strong></div><i>{checked.includes(index) ? <Check /> : null}</i></button> })}</div>
        <footer className="check-footer"><button className="ghost-action" onClick={() => setChecked(items.map((_, index) => index))}>演示：全部确认</button><button className="primary-action" disabled={checked.length < items.length} onClick={() => { patchJourney({ completionStatus: 'driving' }); navigate('/trip/drive') }}>开始 Live Drive <ArrowRight /></button></footer>
      </div>
    </AppShell>
  )
}

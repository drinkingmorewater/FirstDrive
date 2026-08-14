import { ArrowLeft, ArrowRight, Check, CloudSun, Fuel, Gauge, MapPin, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { createPreDriveChecklist } from '../lib/agents'
import { useAppState } from '../state/AppState'

const icons = [Gauge, Fuel, MapPin, ShieldCheck, CloudSun, Check]

export function Checklist() {
  const navigate = useNavigate()
  const { state, patchJourney } = useAppState()
  const items = useMemo(() => createPreDriveChecklist(state), [state])
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const toggle = (index: number) => setChecked(current => { const next = new Set(current); next.has(index) ? next.delete(index) : next.add(index); return next })

  return (
    <AppShell compact>
      <div className="checklist-page page-frame narrow-frame">
        <button className="text-back" onClick={() => navigate('/trip/rehearsal')}><ArrowLeft size={17} /> 回到路线预演</button>
        <header className="page-heading"><h1>为这次出发，做好准备。</h1><p>这份清单只包含当前的人、车、路线和环境真正相关的事项。</p></header>
        <div className="checklist-context"><span>从家到医院</span><span>路线 B · 24 km</span><span>晴 · 白天</span><span>紧凑型燃油 SUV</span></div>
        <div className="checklist-items">
          {items.map((item, index) => { const Icon = icons[index]; const done = checked.has(index); return <button key={item} className={done ? 'checked' : ''} onClick={() => toggle(index)}><span><Icon size={21} /></span><b>{item}</b><i>{done ? <Check size={18} /> : index + 1}</i></button> })}
        </div>
        <footer className="checklist-footer"><p>{checked.size} / {items.length} 已确认</p><Button disabled={checked.size < items.length} onClick={() => { patchJourney({ completionStatus: 'driving' }); navigate('/trip/drive') }}>开始模拟驾驶 <ArrowRight size={18} /></Button></footer>
        {checked.size < items.length ? <button className="demo-check-all" onClick={() => setChecked(new Set(items.map((_, index) => index)))}>演示：一键完成检查</button> : null}
      </div>
    </AppShell>
  )
}

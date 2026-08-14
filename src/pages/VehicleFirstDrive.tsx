import { BatteryCharging, Check, ChevronRight, Gauge, KeyRound, Lightbulb, ShieldCheck, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RecommendedNextAction } from '../components/RecommendedNextAction'
import { useAppState } from '../state/AppState'

const baseItems = [
  { id: 'gear', title: '档位与启动', detail: '踩住制动后切换档位；停车时确认 P 挡。', icon: KeyRound },
  { id: 'light', title: '灯光与雨刷', detail: '找到自动灯光、远近光和前后雨刷控制。', icon: Lightbulb },
  { id: 'brake', title: '驻车与驾驶模式', detail: '确认电子手刹、Auto Hold 与默认驾驶模式。', icon: Gauge },
  { id: 'acc', title: 'ACC 与辅助驾驶', detail: '第一次只确认开启、取消和接管方式。', icon: ShieldCheck },
  { id: 'energy', title: '补能口与应急解锁', detail: '确认充电/加油口、打开方式和应急释放位置。', icon: BatteryCharging },
  { id: 'tools', title: '紧急工具', detail: '找到警示牌、反光背心、补胎液或备胎。', icon: Wrench },
]

export function VehicleFirstDrive() {
  const { state, markFirstDriveComplete } = useAppState()
  const [done, setDone] = useState<string[]>([])
  const completed = state.memory.vehicle.firstDriveCompleted.includes(state.vehicle.id)
  const progress = Math.round(done.length / baseItems.length * 100)
  const contextual = useMemo(() => state.vehicle.manualEntries.join('；'), [state.vehicle.manualEntries])
  return <AppShell><div className="vehicle-first-page page-frame"><header className="first-feature-hero"><div><span>BEFORE FIRST DRIVE</span><h1>第一次开这辆车，<br />只看真正需要的。</h1><p>{state.vehicle.brand} {state.vehicle.model} · 从 400 页说明书里提取 6 个起步动作。</p></div><aside><strong>{progress}%</strong><span>准备完成</span></aside></header><section className="vehicle-first-intro"><img src={state.vehicle.image} alt={`${state.vehicle.brand} ${state.vehicle.model}`} /><div><small>VEHICLE MANUAL INTELLIGENCE</small><strong>{contextual}</strong><Link to="/vehicle/manual">打开上下文说明书 <ChevronRight /></Link></div></section><div className="vehicle-first-grid">{baseItems.map(({ id, title, detail, icon: Icon }, index) => <button key={id} className={done.includes(id) ? 'done' : ''} onClick={() => setDone(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])}><span>{done.includes(id) ? <Check /> : <Icon />}</span><div><small>0{index + 1}</small><strong>{title}</strong><p>{detail}</p></div><ChevronRight /></button>)}</div><button className="first-drive-complete" disabled={done.length !== baseItems.length || completed} onClick={() => markFirstDriveComplete(state.vehicle.id)}>{completed ? <><Check />已写入 Vehicle Memory</> : '完成第一次开车准备'}</button><RecommendedNextAction title="用一条熟悉路线完成第一次驾驶" detail="先熟悉制动、视野和车辆尺寸，再逐步开启辅助功能。" to="/trip/new" /></div></AppShell>
}

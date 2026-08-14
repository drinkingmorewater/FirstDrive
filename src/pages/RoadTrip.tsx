import { ArrowRight, BatteryCharging, BedDouble, CalendarDays, Camera, CheckCircle2, CloudRain, Luggage, MapPin, Route, Save, UsersRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { createTaskGraph, executeTaskGraph } from '../agents'
import { AppShell } from '../components/AppShell'
import { generateRoadTripPlan } from '../lib/roadtrip'
import { useAppState } from '../state/AppState'
import type { RoadTripPlan } from '../types'

export function RoadTrip() {
  const { state, patchJourney, saveRoadTripPlan, emitAgentEvent, setActiveTaskId } = useAppState()
  const [origin, setOrigin] = useState(state.user.mobility.city === '上海' ? '上海' : '北京')
  const [destination, setDestination] = useState('青岛')
  const [departureDate, setDepartureDate] = useState('2026-08-21')
  const [vehicle, setVehicle] = useState(`${state.vehicle.brand} ${state.vehicle.model} · ${state.vehicle.powerType === 'ev' ? '新能源' : '燃油'}`)
  const [passengers, setPassengers] = useState(2)
  const [experience, setExperience] = useState('第一次长途')
  const [goal, setGoal] = useState('看海与拍照')
  const [fatiguePreference, setFatiguePreference] = useState('轻松优先')
  const [plan, setPlan] = useState<RoadTripPlan | null>(null)
  const [saved, setSaved] = useState(false)
  const generate = async (event: FormEvent) => {
    event.preventDefault(); setSaved(false)
    const next = generateRoadTripPlan({ origin, destination, departureDate, vehicle, passengers, experience, goal, fatiguePreference })
    patchJourney({ origin, destination })
    const task = createTaskGraph('trip', `${origin}到${destination}，${experience}，${fatiguePreference}`, state)
    setActiveTaskId(task.id)
    await executeTaskGraph(task, emitAgentEvent, { delay: 120 })
    setActiveTaskId(null); setPlan(next)
  }
  const save = () => { if (plan) { saveRoadTripPlan(plan); setSaved(true) } }
  return <AppShell><div className="roadtrip-page page-frame"><header className="first-feature-hero"><div><span>ROAD TRIP MODE</span><h1>每个输入，都会改变<br />真实的长途计划。</h1><p>路线、天气、补能、休息、同行者、行李与风险会共同计算。</p></div><Route /></header>
    <form className="roadtrip-form v5" onSubmit={event => void generate(event)}><label><MapPin /><span>Origin</span><input value={origin} onChange={event => setOrigin(event.target.value)} /></label><label><Route /><span>Destination</span><input value={destination} onChange={event => setDestination(event.target.value)} /></label><label><CalendarDays /><span>Departure Date</span><input type="date" value={departureDate} onChange={event => setDepartureDate(event.target.value)} /></label><label><BatteryCharging /><span>Vehicle</span><input value={vehicle} onChange={event => setVehicle(event.target.value)} /></label><label><UsersRound /><span>Passenger</span><input type="number" min="1" max="7" value={passengers} onChange={event => setPassengers(Number(event.target.value))} /></label><label><span>Driving Experience</span><select value={experience} onChange={event => setExperience(event.target.value)}><option>第一次长途</option><option>偶尔跑长途</option><option>经常跑长途</option></select></label><label><Camera /><span>Trip Goal</span><input value={goal} onChange={event => setGoal(event.target.value)} /></label><label><span>Fatigue Preference</span><select value={fatiguePreference} onChange={event => setFatiguePreference(event.target.value)}><option>轻松优先</option><option>平衡</option><option>尽快抵达</option></select></label><button>生成动态画布 <ArrowRight /></button></form>
    {plan ? <section className="roadtrip-canvas"><header><div><small>{plan.totalDistance.toLocaleString()} km · {plan.days.length} DAYS · {plan.departureDate}</small><h2>{plan.origin} → {plan.destination}</h2><p>{state.user.name} · {plan.passengers} 人 · {plan.vehicle} · {plan.experience} · {plan.goal}</p></div>{saved ? <span><CheckCircle2 />已保存</span> : <button onClick={save}><Save />保存到 Journey Memory</button>}</header><div className="roadtrip-stats"><span><Route /><b>{plan.days.length}</b><small>天完成</small></span><span><BatteryCharging /><b>{plan.chargingStops}</b><small>次补能</small></span><span><CloudRain /><b>{plan.weather.includes('雨') ? 1 : 0}</b><small>段天气关注</small></span><span><BedDouble /><b>{Math.max(0, plan.days.length - 1)}</b><small>晚住宿</small></span><span><Camera /><b>{plan.restStops}</b><small>次主动休息</small></span></div><div className="roadtrip-days dynamic">{plan.days.map(day => <article key={day.day}><span>DAY {String(day.day).padStart(2, '0')} · {day.distance} km</span><h3>{day.title}</h3><ol>{day.stops.map(stop => <li key={`${day.day}-${stop.time}`}><b>{stop.time}</b><span>{stop.place} · {stop.action}</span></li>)}</ol></article>)}<aside><Luggage /><h3>这次别忘记</h3><p>{plan.packing.join('、')}。</p>{plan.risks.map(risk => <b key={risk}>{risk}</b>)}</aside></div></section> : <div className="roadtrip-placeholder"><Route /><strong>改变目的地，里程、节点和日程都会重新生成</strong><span>Route × Weather × Charging × Rest × Hotel × Goal × Luggage</span></div>}
  </div></AppShell>
}

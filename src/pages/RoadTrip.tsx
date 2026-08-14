import { ArrowRight, BatteryCharging, BedDouble, CalendarDays, Camera, CheckCircle2, CloudRain, Luggage, MapPin, Route, Save, UsersRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

export function RoadTrip() {
  const { state, patchJourney, addTimeline, emitAgentEvent } = useAppState()
  const [origin, setOrigin] = useState('北京')
  const [destination, setDestination] = useState('阿尔山')
  const [generated, setGenerated] = useState(false)
  const [saved, setSaved] = useState(false)
  const generate = (event: FormEvent) => {
    event.preventDefault()
    patchJourney({ origin, destination })
    emitAgentEvent({ agent: 'ready', status: 'running', title: '正在生成 Road Trip Canvas', detail: '同时调用路线、天气、补能、休息、住宿、景点与行李工具' })
    setGenerated(true)
    emitAgentEvent({ agent: 'ready', status: 'completed', title: '长途计划已完成', detail: `${origin} → ${destination}，分 2 天完成，安排 4 次补能与 5 次休息` })
  }
  const save = () => {
    addTimeline({ id: `roadtrip-${Date.now()}`, date: new Date().toISOString().slice(0, 10), domain: 'journey', title: `Road Trip：${origin} → ${destination}`, detail: '两人 · 新能源 · 第一次长途 · 目的：看星空。' })
    setSaved(true)
  }
  return <AppShell><div className="roadtrip-page page-frame"><header className="first-feature-hero"><div><span>ROAD TRIP MODE</span><h1>不只是导航，<br />是完整的长途计划。</h1><p>同时考虑天气、路线、补能、休息、同行者、行李、酒店和想去的地方。</p></div><Route /></header>
    <form className="roadtrip-form" onSubmit={generate}><label><MapPin /><span>从哪里出发</span><input value={origin} onChange={event => setOrigin(event.target.value)} /></label><label><Route /><span>去哪里</span><input value={destination} onChange={event => setDestination(event.target.value)} /></label><label><UsersRound /><span>同行者</span><select defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label><CalendarDays /><span>出发时间</span><input defaultValue="本周五 08:00" /></label><button>生成 Road Trip Canvas <ArrowRight /></button></form>
    {generated ? <section className="roadtrip-canvas"><header><div><small>1,420 km · 2 DAYS</small><h2>{origin} → {destination}</h2><p>{state.user.name} · 两个人 · 新能源 · 第一次长途 · 想拍星空，不想开得太累</p></div>{saved ? <span><CheckCircle2 />已保存</span> : <button onClick={save}><Save />保存到 Journey Memory</button>}</header><div className="roadtrip-stats"><span><Route /><b>2</b><small>天完成</small></span><span><BatteryCharging /><b>4</b><small>次补能</small></span><span><CloudRain /><b>1</b><small>段降雨</small></span><span><BedDouble /><b>1</b><small>晚住宿</small></span><span><Camera /><b>2</b><small>观景时段</small></span></div><div className="roadtrip-days"><article><span>DAY 01 · 720 km</span><h3>北京 → 赤峰</h3><ol><li><b>08:00</b> 北京出发，电量 100%</li><li><b>10:10</b> 承德服务区 · 补能 28 分钟</li><li><b>13:00</b> 午餐与休息 50 分钟</li><li><b>17:40</b> 抵达赤峰 · 酒店慢充</li></ol></article><article><span>DAY 02 · 700 km</span><h3>赤峰 → 阿尔山</h3><ol><li><b>08:30</b> 出发，避开早晨低温</li><li><b>11:20</b> 霍林郭勒 · 补能与午餐</li><li><b>15:40</b> 雨段开始，切换 Comfortable Today</li><li><b>19:10</b> 抵达星空拍摄点</li></ol></article><aside><Luggage /><h3>别忘记</h3><p>充电转接头、保暖衣物、三脚架、备用饮水、胎压检查。</p><b>第一天连续驾驶不超过 2 小时 10 分钟。</b></aside></div></section> : <div className="roadtrip-placeholder"><Route /><strong>输入目的地，生成完整长途画布</strong><span>Route × Weather × Charging × Rest × Hotel × Attractions × Luggage</span></div>}
  </div></AppShell>
}

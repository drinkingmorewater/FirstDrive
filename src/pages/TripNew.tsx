import { ArrowLeft, ArrowRight, CalendarClock, CloudSun, LocateFixed, MapPin, Sparkles } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { useAppState } from '../state/AppState'

export function TripNew() {
  const navigate = useNavigate()
  const { state, patchJourney, resetDemo } = useAppState()
  const [origin, setOrigin] = useState(state.journey.origin)
  const [destination, setDestination] = useState(state.journey.destination)
  const [time, setTime] = useState(state.journey.departureTime)
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    patchJourney({ origin, destination, departureTime: time, completionStatus: 'draft' })
    setLoading(true)
    window.setTimeout(() => navigate('/trip/compare'), 850)
  }

  const loadDemo = () => {
    resetDemo()
    setOrigin('家'); setDestination('医院'); setTime('明天 08:00')
  }

  return (
    <AppShell compact>
      <div className="trip-new page-frame">
        <button className="text-back" onClick={() => navigate('/')}><ArrowLeft size={17} /> 回到首页</button>
        <div className="trip-new-layout">
          <section>
            <h1>这一次，你想去哪里？</h1>
            <p>先告诉 FirstDrive 目的地。我们会结合你、车、路与环境，找到更适合当前你的路线。</p>
            <form onSubmit={submit}>
              <label><span><LocateFixed size={18} /> 出发地</span><input value={origin} onChange={event => setOrigin(event.target.value)} placeholder="例如：家" /></label>
              <div className="trip-connector" />
              <label><span><MapPin size={18} /> 目的地</span><input value={destination} onChange={event => setDestination(event.target.value)} placeholder="例如：医院" /></label>
              <label><span><CalendarClock size={18} /> 出发时间</span><input value={time} onChange={event => setTime(event.target.value)} /></label>
              <div className="weather-row"><CloudSun size={20} /><div><b>预计环境</b><span>晴 · 23°C · 微风 · 白天</span></div><small>Demo Data</small></div>
              <Button type="submit" wide disabled={loading}>{loading ? '正在识别陌生路段…' : <>比较适合我的路线 <ArrowRight size={18} /></>}</Button>
            </form>
          </section>
          <aside className="persona-panel">
            <Sparkles size={24} />
            <h2>FirstDrive 已经记得</h2>
            <ul><li>普通城市道路已熟悉</li><li>快速路希望先了解</li><li>高架与复杂变道尚未独立完成</li><li>当前车辆为紧凑型燃油 SUV</li></ul>
            <button onClick={loadDemo}>重新载入示例用户</button>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

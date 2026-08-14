import { ArrowRight, CalendarDays, CarFront, CloudRain, HelpCircle, Mic, Navigation, ShieldCheck, Sparkles, UserRound, Wrench } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { MobilityMap } from '../components/MobilityMap'
import { useAppState } from '../state/AppState'
import { selectNextFirst } from '../context/selectors'

const layers = [
  { to: '/me', en: 'KNOW ME', zh: '认识我', copy: '汽车生活护照与熟悉度', icon: UserRound },
  { to: '/buy', en: 'BUY SMART', zh: '聪明买', copy: '适配生活，而非参数竞赛', icon: CarFront },
  { to: '/firsts', en: 'DRIVE SAFE', zh: '准备好', copy: '第一次、练习与路线预演', icon: ShieldCheck },
  { to: '/trip/drive', en: 'ON THE ROAD', zh: '在路上', copy: '实时理解，主动协助', icon: Navigation },
  { to: '/help', en: 'HELP ME', zh: '帮帮我', copy: '事故、维修、租车与海外', icon: HelpCircle },
]

export function Home() {
  const navigate = useNavigate()
  const { state, patchJourney, clearRuntime } = useAppState()
  const [destination, setDestination] = useState('浦东嘉里医院')

  const start = (event: FormEvent) => {
    event.preventDefault()
    clearRuntime()
    patchJourney({ destination: destination.trim() || '浦东嘉里医院', completionStatus: 'draft', selectedRoute: null })
    navigate('/trip/new')
  }

  return (
    <AppShell>
      <section className="home-v3">
        <div className="home-intro">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Sparkles size={16} /> Good evening, {state.user.name}.</span>
            <h1>今天，<br />你准备去哪里？</h1>
            <p>FirstDrive 认识你、车、路与此刻的环境。在你需要前准备，在你紧张时少打扰。</p>
          </motion.div>
          <form className="command-bar" onSubmit={start}>
            <Navigation size={20} />
            <label><span>目的地</span><input value={destination} onChange={event => setDestination(event.target.value)} aria-label="目的地" /></label>
            <button type="button" className="command-mic" onClick={() => setDestination('浦东嘉里医院')} aria-label="语音输入目的地"><Mic /></button>
            <button className="command-go" aria-label="开始规划"><ArrowRight /></button>
          </form>
          <div className="home-memory-line">
            <span>为 {state.user.name} 准备</span><b>{selectNextFirst(state)}希望先了解</b><b>{state.user.mobility.assistancePreference.advanceNoticeMinutes} 分钟前提醒</b><b>{state.user.mobility.routePreference.easy > 70 ? '偏好更简单路线' : '优先更快路线'}</b>
          </div>
          <div className="home-personal-strip"><span><CalendarDays /><small>Continue</small><b>{state.journey.completionStatus === 'draft' ? `${state.journey.destination} 路线准备` : '上次旅程已完成'}</b></span><span><Sparkles /><small>Next first</small><b>{selectNextFirst(state)}</b></span><span><Wrench /><small>Your car</small><b>下次保养约 1,200 km</b></span><span><CloudRain /><small>Upcoming</small><b>周末长途可能有雨</b></span></div>
        </div>

        <div className="home-canvas">
          <MobilityMap />
          <div className="journey-preview">
            <span>NEXT JOURNEY</span><strong>家 → {state.journey.destination}</strong>
            <p>24 km · 小雨 · 预计 36 分钟</p>
          </div>
        </div>
      </section>

      <section className="layer-rail" aria-label="五层汽车生活工作区">
        {layers.map(({ to, en, zh, copy, icon: Icon }, index) => (
          <Link to={to} key={to} className={index === 3 ? 'active-layer' : ''}>
            <span className="layer-index">0{index + 1}</span><Icon />
            <div><small>{en}</small><strong>{zh}</strong><p>{copy}</p></div><ArrowRight size={17} />
          </Link>
        ))}
      </section>
    </AppShell>
  )
}

import { ArrowRight, CarFront, HelpCircle, Mic, Navigation, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { MobilityMap } from '../components/MobilityMap'
import { useAppState } from '../state/AppState'

const layers = [
  { to: '/familiarity', en: 'KNOW ME', zh: '认识我', copy: '熟悉度与辅助偏好', icon: UserRound },
  { to: '/buy', en: 'BUY SMART', zh: '聪明买', copy: '适配生活，而非参数竞赛', icon: CarFront },
  { to: '/trip/new', en: 'DRIVE SAFE', zh: '准备好', copy: '路线预演与出发检查', icon: ShieldCheck },
  { to: '/trip/drive', en: 'ON THE ROAD', zh: '在路上', copy: '实时理解，主动协助', icon: Navigation },
  { to: '/help', en: 'HELP ME', zh: '帮帮我', copy: '事故、维修、租车与海外', icon: HelpCircle },
]

export function Home() {
  const navigate = useNavigate()
  const { state, resetDemo, patchJourney, clearRuntime } = useAppState()
  const [destination, setDestination] = useState('浦东嘉里医院')

  const start = (event: FormEvent) => {
    event.preventDefault()
    resetDemo()
    clearRuntime()
    patchJourney({ destination: destination.trim() || '浦东嘉里医院', completionStatus: 'draft', selectedRoute: null })
    navigate('/trip/new')
  }

  return (
    <AppShell>
      <section className="home-v3">
        <div className="home-intro">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Sparkles size={16} /> CALM MOBILITY OS</span>
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
            <span>为 {state.user.name} 准备</span><b>快速路希望先了解</b><b>高架尚未独立完成</b><b>偏好提前提醒</b>
          </div>
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

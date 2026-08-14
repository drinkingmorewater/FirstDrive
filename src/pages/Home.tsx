import { ArrowRight, CarFront, CircleHelp, Map, Navigation, RotateCcw, Route } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

const actions = [
  { to: '/trip/new', label: '我要出发', icon: Navigation, primary: true },
  { to: '/familiarity', label: '我想先熟悉一下', icon: Map },
  { to: '/buy', label: '我要买车', icon: CarFront },
  { to: '/emergency', label: '我遇到问题了', icon: CircleHelp },
]

export function Home() {
  const navigate = useNavigate()
  const { state, resetDemo } = useAppState()

  const loadDemo = () => {
    resetDemo()
    navigate('/trip/new')
  }

  return (
    <AppShell>
      <section className="home-hero">
        <motion.div className="home-copy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
          <h1>每个人，都有<br />自己的第一公里。</h1>
          <p>从第一次买车，到第一次独自出发，FirstDrive 认识你、车、路与此刻的环境。</p>
          <div className="home-actions">
            {actions.map(({ to, label, icon: Icon, primary }) => (
              <Link key={to} to={to} className={primary ? 'home-action primary' : 'home-action'}><Icon size={19} />{label}</Link>
            ))}
          </div>
          <button className="hero-cta" onClick={loadDemo}>载入示例用户，开始出发 <ArrowRight size={19} /></button>
          <span className="demo-note"><RotateCcw size={14} /> 一键重置并载入完整演示数据</span>
        </motion.div>
        <motion.div className="hero-route" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .1 }}>
          <svg viewBox="0 0 680 520" aria-hidden="true">
            <path className="hero-map-line faint" d="M70 480 C170 420 150 335 265 310 S310 210 430 190 S485 90 610 40" />
            <path className="hero-map-line main" d="M70 480 C170 420 150 335 265 310 S310 210 430 190 S485 90 610 40" />
            <circle cx="70" cy="480" r="13" className="hero-node start" />
            <circle cx="265" cy="310" r="9" className="hero-node" />
            <circle cx="430" cy="190" r="9" className="hero-node" />
            <circle cx="610" cy="40" r="14" className="hero-node end" />
          </svg>
          <span className="route-tag tag-start">起点</span>
          <span className="route-tag tag-familiar"><b>路况熟悉</b><small>城市道路 · 畅通</small></span>
          <span className="route-tag tag-express"><b>快速路段</b><small>预计 23 分钟</small></span>
          <span className="route-tag tag-complex"><b>复杂立交</b><small>预计 8 分钟</small></span>
          <span className="route-tag tag-end">目的地</span>
        </motion.div>
      </section>

      <section className="home-summary">
        <Link to="/garage" className="summary-column">
          <span className="summary-kicker">我的车</span>
          <div className="vehicle-silhouette"><CarFront size={44} /></div>
          <div><strong>{state.vehicle.brand} {state.vehicle.model}</strong><small>紧凑型 · 汽油 · 上次保养 45 天前</small></div><ArrowRight size={17} />
        </Link>
        <Link to="/familiarity" className="summary-column familiarity-summary">
          <span className="summary-kicker">驾驶熟悉度</span>
          <div><b className="text-familiar">城市普通道路 · 已熟悉</b><b className="text-prepare">快速路 · 希望先了解</b><b>高架 · 未经历</b></div><ArrowRight size={17} />
        </Link>
        <Link to="/memory" className="summary-column">
          <span className="summary-kicker">最近旅程</span>
          <Route size={34} />
          <div><strong>家 → 商场</strong><small>2026/08/10 18:20 · 18 km · 38 分钟</small></div><ArrowRight size={17} />
        </Link>
      </section>
    </AppShell>
  )
}

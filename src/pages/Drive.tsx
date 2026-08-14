import { AlertTriangle, ArrowRight, Check, MapPin, Pause, Play, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Brand } from '../components/Brand'
import { useAppState } from '../state/AppState'

const alerts = [
  { main: '500 m 后进入快速路，保持当前车道。', sub: '约 1 分钟后' },
  { main: '2 km 后进入高架，提前保持右侧车道。', sub: '约 3 分钟后' },
  { main: '即将到达医院北门，减速留意行人。', sub: '约 2 分钟后' },
]

export function Drive() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const points = state.journey.rehearsalPoints

  const advance = () => {
    if (step === alerts.length - 1) navigate('/trip/complete')
    else setStep(value => value + 1)
  }

  return (
    <div className="drive-page">
      <header><Brand inverse /><h2>从家到医院</h2><span><i />{paused ? '已暂停' : '驾驶中'} · Demo Simulation</span></header>
      <main>
        <AnimatePresence mode="wait"><motion.section key={step} className="drive-alert" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}><h1>{paused ? '已暂停。请在安全位置继续。' : alerts[step].main}</h1><p>{paused ? '当前路线进度已保留' : alerts[step].sub}</p></motion.section></AnimatePresence>
        <span className="next-key">下一个关键节点</span>
        <div className="drive-progress">
          {points.map((point, index) => <div key={point.id} className={index < step ? 'done' : index === step ? 'active' : ''}><span>{index < step ? <Check size={18} /> : index === step ? <MapPin size={20} /> : null}</span><b>{point.title.replace('第一次进入', '').replace('停车入口', '')}</b><small>{index < step ? '已完成' : index === step ? '即将到达' : `约 ${index === 2 ? 16 : 8} 分钟`}</small></div>)}
        </div>
        <p className="drive-eta">预计 <strong>08:46</strong> 到达</p>
      </main>
      <footer>
        <button onClick={() => setPaused(value => !value)}>{paused ? <Play /> : <Pause />} {paused ? '继续' : '暂停'}</button>
        <button className="emergency-drive" onClick={() => navigate('/emergency')}><ShieldAlert /> 紧急求助</button>
        <button className="advance-drive" onClick={advance}>{step === alerts.length - 1 ? '到达目的地' : '完成当前路段'} <ArrowRight /></button>
        <p><AlertTriangle size={16} /> 请仅在安全停车后进行复杂操作。</p>
      </footer>
    </div>
  )
}

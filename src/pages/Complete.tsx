import { ArrowRight, Check, Download, Home, Route, Save } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { updateFamiliarityAfterJourney } from '../lib/agents'
import { useAppState } from '../state/AppState'

const completed = ['第一次独立进入快速路', '第一次通过高架分流', '第一次独自完成陌生路线', '顺利从医院北门进入停车区']

export function Complete() {
  const navigate = useNavigate()
  const { state, replaceState } = useAppState()
  const updated = useRef(false)
  useEffect(() => {
    if (!updated.current && state.journey.completionStatus !== 'completed') {
      updated.current = true
      replaceState(current => updateFamiliarityAfterJourney(current))
    }
  }, [replaceState, state.journey.completionStatus])

  return (
    <AppShell compact>
      <div className="complete-page page-frame">
        <div className="memory-route"><span><Home size={18} />家</span><i />{completed.map((item, index) => <motion.b key={item} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * .12 }}><Check size={16} /><small>{item}</small></motion.b>)}<i /><span className="end"><Route size={18} />医院</span></div>
        <div className="complete-layout">
          <section className="complete-hero"><h1>这段路，<br />已经走进你的经验。</h1><p>今天 08:46 到达 · 独立驾驶 24 km</p><span>陪你走过每一个第一公里。</span></section>
          <section className="complete-detail">
            <h2>今天你完成了</h2>
            <ul>{completed.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul>
            <h2>驾驶熟悉度已更新</h2>
            <div className="status-transition"><span>快速路：希望先了解</span><i>•••••• →</i><strong>已独立完成</strong></div>
            <p className="progressive-message">下次进入类似快速路时，FirstDrive 将减少基础提醒。</p>
            <div className="complete-actions"><Button onClick={() => navigate('/familiarity')}>查看新的熟悉度 <ArrowRight size={17} /></Button><Button variant="secondary"><Save size={17} /> 保存这次旅程</Button><Button variant="ghost" onClick={() => navigate('/')}><Download size={17} /> 回到首页</Button></div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

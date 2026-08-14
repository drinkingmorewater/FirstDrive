import { ArrowRight, Check, Home, Route, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { MobilityMap } from '../components/MobilityMap'
import { useAppState } from '../state/AppState'

const moments = ['第一次独立进入快速路', '第一次通过高架分流', '雨天路段独立完成']

export function Complete() {
  const { state, replaceState } = useAppState()
  const updated = useRef(false)
  useEffect(() => {
    if (updated.current) return
    updated.current = true
    replaceState(current => ({
      ...current,
      familiarity: { ...current.familiarity, expressway: 'completed_independently', elevatedRoad: 'completed_independently', rainDriving: 'completed_independently' },
      journey: { ...current.journey, completionStatus: 'completed' },
      memory: {
        ...current.memory,
        confidence: Math.min(100, current.memory.confidence + 9),
        completedScenarios: [...new Set([...current.memory.completedScenarios, '快速路', '高架分流', '雨天驾驶'])],
        journeys: [...current.memory.journeys, { route: '家 → 浦东嘉里医院', date: '2026/08/14 08:51', distance: 24, duration: 41 }],
      },
    }))
  }, [replaceState])

  return (
    <AppShell compact>
      <div className="arrival-v3">
        <section className="arrival-map"><MobilityMap progress={100} /><div className="arrival-route"><span><Home />家<small>08:12 出发</small></span><i /><b><Check />快速路</b><i /><b><Check />高架分流</b><i /><span><Route />医院<small>08:51 到达</small></span></div></section>
        <section className="arrival-copy">
          <span className="eyebrow"><Sparkles /> JOURNEY COMPLETE</span>
          <h1>这段路，<br />已经走进你的经验。</h1>
          <p>今天 08:51 到达 · 独立驾驶 24 km</p>
          <div className="experience-card"><span>经验已记录</span>{moments.map((item, index) => <motion.div key={item} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .15 }}><Check /><strong>{item}</strong></motion.div>)}</div>
          <div className="familiarity-update"><span>熟悉度更新</span><p><b>快速路</b><small>希望先了解</small><i>→</i><strong>已独立完成</strong></p><p><b>高架</b><small>未经历</small><i>→</i><strong>已独立完成</strong></p></div>
          <div className="progressive-note"><Sparkles /><span>下次进入类似路段时，FirstDrive 将减少基础提醒。</span></div>
          <Link className="primary-action" to="/familiarity">查看新的熟悉度 <ArrowRight /></Link>
          <Link className="arrival-home" to="/">返回首页</Link>
        </section>
      </div>
    </AppShell>
  )
}

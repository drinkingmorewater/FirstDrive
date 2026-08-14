import { ArrowRight, CarFront, CircleGauge, CloudRain, Map, Route, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { StatusDot } from '../components/StatusDot'
import { familiarityLabels, statusMeta } from '../data/demo'
import { useAppState } from '../state/AppState'
import type { FamiliarityKey, FamiliarityStatus } from '../types'

const groups: Array<{ title: string; icon: typeof Route; keys: FamiliarityKey[] }> = [
  { title: '道路经验', icon: Route, keys: ['cityRoad', 'heavyTraffic', 'expressway', 'elevatedRoad', 'highway', 'mountainRoad', 'narrowRoad'] },
  { title: '环境经验', icon: CloudRain, keys: ['nightDriving', 'rainDriving', 'snowDriving'] },
  { title: '操作经验', icon: CircleGauge, keys: ['parking', 'reverseParking', 'complexLaneChange', 'highwayMerge'] },
  { title: '车辆经验', icon: CarFront, keys: ['fueling', 'charging'] },
]

const statuses = Object.keys(statusMeta) as FamiliarityStatus[]

export function Familiarity() {
  const navigate = useNavigate()
  const { state, updateFamiliarity } = useAppState()
  const [selected, setSelected] = useState<FamiliarityKey>('expressway')
  const nextScenarios = useMemo(() => (Object.keys(state.familiarity) as FamiliarityKey[]).filter(key => ['want_to_prepare', 'unexperienced'].includes(state.familiarity[key])).slice(0, 3), [state.familiarity])

  const cycleStatus = (key: FamiliarityKey) => {
    const index = statuses.indexOf(state.familiarity[key])
    updateFamiliarity(key, statuses[(index + 1) % statuses.length])
    setSelected(key)
  }

  return (
    <AppShell>
      <div className="familiarity-page page-frame">
        <header className="page-heading familiarity-heading">
          <div><Map size={34} /><h1>你的驾驶熟悉度</h1></div>
          <p>记录你真正完成过的场景，也记住下一次想先了解什么。</p>
        </header>
        <div className="status-legend">
          {statuses.map(status => <span key={status}><StatusDot status={status} />{statusMeta[status].label}</span>)}
        </div>
        <div className="familiarity-layout">
          <div className="familiarity-network">
            {groups.map(({ title, icon: Icon, keys }, groupIndex) => (
              <motion.section className="familiarity-line" key={title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: groupIndex * .08 }}>
                <div className="line-title"><span><Icon size={26} /></span><b>{title}</b></div>
                <div className="line-track">
                  <i className="track-path" />
                  {keys.map(key => (
                    <button key={key} className={selected === key ? 'scenario-node active' : 'scenario-node'} onClick={() => cycleStatus(key)} aria-label={`${familiarityLabels[key]}，${statusMeta[state.familiarity[key]].label}，点击调整`}>
                      <StatusDot status={state.familiarity[key]} selected={selected === key} />
                      <span>{familiarityLabels[key]}</span>
                    </button>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
          <aside className="familiarity-aside">
            <h2>下一次想先熟悉</h2>
            <div className="next-scenarios">
              {nextScenarios.map(key => <button key={key} onClick={() => setSelected(key)}><span><Settings2 size={18} />{familiarityLabels[key]}</span><StatusDot status={state.familiarity[key]} /></button>)}
            </div>
            <div className="progressive-note"><CircleGauge size={23} /><p>完成一次后，FirstDrive 会减少基础提醒。</p></div>
            <Button wide onClick={() => navigate('/trip/new')}>为这些场景做一次预演 <ArrowRight size={17} /></Button>
            <p className="aside-help">点击任一节点，可以快速调整场景状态。</p>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

import { ArrowRight, CarFront, Edit3, Map, Route, Sparkles, UserRound } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { familiarityLabels, statusMeta } from '../data/demo'
import { useAppState } from '../state/AppState'
import type { FamiliarityKey } from '../types'

export function Me() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const profile = state.user.mobility
  const firsts = useMemo(() => (Object.keys(state.familiarity) as FamiliarityKey[]).filter(key => ['unexperienced', 'want_to_prepare', 'accompanied'].includes(state.familiarity[key])).slice(0, 5), [state.familiarity])
  const familiar = useMemo(() => (Object.keys(state.familiarity) as FamiliarityKey[]).filter(key => ['familiar', 'completed_independently'].includes(state.familiarity[key])), [state.familiarity])
  return <AppShell><div className="passport-page page-frame">
    <header className="passport-hero"><div><span>MY MOBILITY PASSPORT</span><h1>{state.user.name} 的汽车生活护照</h1><p>不是一张能力证明，而是 FirstDrive 理解你、车、路与环境的共同上下文。</p></div><aside><small>PROFILE UPDATED</small><strong>{state.memory.person.lastUpdated}</strong><span>{profile.city} · v4.0</span></aside></header>
    <div className="passport-grid">
      <PassportModule icon={<UserRound />} index="01" title="My Life" subtitle="我的汽车生活" onEdit={() => navigate('/onboarding')}><div className="passport-facts"><span><small>通勤</small><b>单程 {profile.dailyCommuteKm} km · 每周 {profile.commuteDaysPerWeek} 天</b></span><span><small>年里程</small><b>{profile.annualMileageKm.toLocaleString()} km</b></span><span><small>乘员</small><b>{profile.passengerPattern.join('、') || '主要一个人'}</b></span><span><small>停车与补能</small><b>{profile.parkingType} · {profile.homeCharging ? '有家充' : '无家充'}</b></span></div></PassportModule>
      <PassportModule icon={<Map />} index="02" title="My Driving" subtitle="我的驾驶经验" onEdit={() => navigate('/familiarity')}><div className="experience-line"><strong>{familiar.length}</strong><span>个场景已能独立完成</span></div><div className="passport-tags">{familiar.slice(0, 7).map(key => <span key={key}>{familiarityLabels[key]}</span>)}</div></PassportModule>
      <PassportModule icon={<Route />} index="03" title="My Firsts" subtitle="我的下一公里" onEdit={() => navigate('/firsts')}><div className="first-list">{firsts.map((key, index) => <button key={key} onClick={() => navigate('/firsts')}><b>0{index + 1}</b><span><strong>{familiarityLabels[key]}</strong><small>{statusMeta[state.familiarity[key]].label}</small></span><ArrowRight /></button>)}</div></PassportModule>
      <PassportModule icon={<CarFront />} index="04" title="My Car Preferences" subtitle="我的用车偏好" onEdit={() => navigate('/onboarding')}><ol className="priority-list">{profile.vehiclePriorities.map((item, index) => <li key={item}><b>{index + 1}</b><span>{item}</span></li>)}</ol><p>预算 ¥{(profile.idealBudget ?? 0).toLocaleString()} · 月均上限 ¥{(profile.monthlyCarBudget ?? 0).toLocaleString()}</p></PassportModule>
      <PassportModule icon={<Sparkles />} index="05" title="My Assistance Style" subtitle="我的辅助方式" onEdit={() => navigate('/onboarding')} wide><div className="assistance-style"><strong>{profile.assistancePreference.level === 'guided' ? '引导' : profile.assistancePreference.level === 'balanced' ? '平衡' : '简洁'}</strong><span>复杂节点提前 {profile.assistancePreference.advanceNoticeMinutes} 分钟 · {profile.assistancePreference.voiceEnabled ? '语音已开启' : '语音已关闭'}</span><p>已完成场景会逐步减少基础提醒；陌生、天气变化或车辆异常时再主动介入。</p></div></PassportModule>
    </div>
  </div></AppShell>
}

function PassportModule({ icon, index, title, subtitle, onEdit, wide = false, children }: { icon: React.ReactNode; index: string; title: string; subtitle: string; onEdit: () => void; wide?: boolean; children: React.ReactNode }) {
  return <section className={`passport-module ${wide ? 'wide' : ''}`}><header><span>{icon}</span><div><small>{index} · {title}</small><h2>{subtitle}</h2></div><button onClick={onEdit}><Edit3 />编辑</button></header>{children}</section>
}

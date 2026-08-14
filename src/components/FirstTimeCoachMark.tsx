import { ArrowRight, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAppState } from '../state/AppState'

const coaches = [
  { id: 'know', match: ['/me'], title: '这里保存 FirstDrive 对你的理解。' },
  { id: 'buy', match: ['/buy'], title: '你的生活变化，推荐也会变化。' },
  { id: 'ready', match: ['/firsts', '/practice', '/vehicle'], title: '先把陌生路和陌生车走一遍。' },
  { id: 'road', match: ['/trip'], title: '只在真正需要时提醒你。' },
  { id: 'help', match: ['/help', '/rental'], title: '出问题时，从下一步开始。' },
]

export function FirstTimeCoachMark() {
  const { pathname } = useLocation()
  const { state, markCoachSeen } = useAppState()
  if (state.onboardingStatus !== 'completed') return null
  const coach = coaches.find(item => item.match.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)))
  if (!coach || state.coachMarksSeen.includes(coach.id) || pathname === '/trip/drive') return null
  return <aside className="coach-mark"><button onClick={() => markCoachSeen(coach.id)} aria-label="关闭提示"><X /></button><small>FIRST-TIME GUIDE</small><strong>{coach.title}</strong><button onClick={() => markCoachSeen(coach.id)}>知道了 <ArrowRight /></button></aside>
}

import { Mic, Network, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MountainMark } from './MountainMark'
import { useAppState } from '../state/AppState'

const navItems = [
  { to: '/me', prefix: ['/me', '/welcome', '/onboarding'], index: '01', en: 'KNOW ME', label: '认识我' },
  { to: '/buy', prefix: ['/buy'], index: '02', en: 'BUY SMART', label: '聪明买' },
  { to: '/firsts', prefix: ['/firsts', '/practice', '/familiarity', '/vehicle'], index: '03', en: 'DRIVE SAFE', label: '准备好' },
  { to: '/trip/new', prefix: ['/trip'], index: '04', en: 'ON THE ROAD', label: '在路上' },
  { to: '/help', prefix: ['/help', '/emergency', '/rental', '/garage', '/memory'], index: '05', en: 'HELP ME', label: '帮帮我' },
]

export function PersistentTopNav({ driveMode, onVoice, onMesh, meshOpen }: { driveMode: boolean; onVoice: () => void; onMesh: () => void; meshOpen: boolean }) {
  const { pathname } = useLocation()
  const { state } = useAppState()
  const active = (prefix: string[]) => prefix.some(item => pathname === item || pathname.startsWith(`${item}/`))
  return (
    <header className={`persistent-nav ${driveMode ? 'drive' : ''}`}>
      <Link to="/" className="persistent-logo" aria-label="FirstDrive 首页"><MountainMark inverse={driveMode} /></Link>
      <nav aria-label="FirstDrive 五层导航">
        {navItems.map(item => <Link key={item.index} to={item.index === '01' && state.onboardingStatus !== 'completed' ? '/welcome' : item.to} className={active(item.prefix) ? 'active' : ''}><b>{item.index}</b><span><strong>{item.en}</strong><small>{item.label}</small></span></Link>)}
      </nav>
      <div className="persistent-actions">
        <button onClick={onMesh} aria-label={meshOpen ? '关闭 Agent 协作面板' : '打开 Agent 协作面板'}>{meshOpen ? <X /> : <Network />}<span>AGENTS</span></button>
        <button onClick={onVoice} aria-label="打开全局语音助手"><Mic /><span>VOICE</span></button>
        <span className="profile-avatar">{state.user.name.slice(0, 1)}</span>
      </div>
    </header>
  )
}

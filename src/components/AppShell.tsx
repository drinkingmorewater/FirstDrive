import { CarFront, HelpCircle, Menu, Mic, Navigation, Sparkles, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Brand } from './Brand'
import { VoiceDock } from './VoiceDock'
import { useAppState } from '../state/AppState'

const navItems = [
  { to: '/me', label: '认识我', en: 'KNOW ME', icon: UserRound },
  { to: '/buy', label: '聪明买', en: 'BUY SMART', icon: CarFront },
  { to: '/firsts', label: '准备好', en: 'DRIVE SAFE', icon: Sparkles },
  { to: '/trip/drive', label: '在路上', en: 'ON THE ROAD', icon: Navigation },
  { to: '/help', label: '帮帮我', en: 'HELP ME', icon: HelpCircle },
]

export function AppShell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  const { state } = useAppState()
  const [open, setOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)

  return (
    <div className={compact ? 'app-shell app-shell-compact' : 'app-shell'}>
      <header className="topbar">
        <Brand />
        <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="五层工作区">
          {navItems.map(({ to, label, en, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <Icon size={17} /><span>{label}<small>{en}</small></span>
            </NavLink>
          ))}
        </nav>
        <div className="topbar-actions">
          <span className="demo-pill"><i /> DEMO LIVE</span>
          <button className="top-mic" onClick={() => setVoiceOpen(true)} aria-label="打开语音助手"><Mic size={18} /></button>
          <span className="profile-avatar">{state.user.name.slice(0, 1)}</span>
        </div>
        <button className="menu-button" onClick={() => setOpen(value => !value)} aria-label="展开导航">{open ? <X /> : <Menu />}</button>
      </header>
      <main>{children}</main>
      <VoiceDock open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  )
}

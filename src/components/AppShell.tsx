import { CircleUserRound, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Brand } from './Brand'
import { useAppState } from '../state/AppState'

const navItems = [
  { to: '/familiarity', label: '熟悉度' },
  { to: '/memory', label: '旅程记忆' },
  { to: '/garage', label: '我的车' },
]

export function AppShell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  const { state } = useAppState()
  const [open, setOpen] = useState(false)

  return (
    <div className={compact ? 'app-shell app-shell-compact' : 'app-shell'}>
      <header className="topbar">
        <Brand />
        <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="主导航">
          {navItems.map(item => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</NavLink>)}
        </nav>
        <div className="profile-brief"><CircleUserRound size={20} /><span>驾照 {state.user.drivingYears} 年 · {state.user.actualDrivingFrequency}</span></div>
        <button className="menu-button" onClick={() => setOpen(value => !value)} aria-label="展开导航">{open ? <X /> : <Menu />}</button>
      </header>
      <main>{children}</main>
    </div>
  )
}

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AgentMesh } from './AgentMesh'
import { FirstTimeCoachMark } from './FirstTimeCoachMark'
import { PersistentTopNav } from './PersistentTopNav'
import { VoiceDock } from './VoiceDock'

export function GlobalFrame() {
  const { pathname } = useLocation()
  const driveMode = pathname === '/trip/drive'
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [meshOpen, setMeshOpen] = useState(false)
  return <div className={`global-frame ${driveMode ? 'drive-mode' : ''}`}>
    <PersistentTopNav driveMode={driveMode} onVoice={() => setVoiceOpen(true)} onMesh={() => setMeshOpen(value => !value)} meshOpen={meshOpen} />
    <div className="global-content"><Outlet /></div>
    {driveMode ? <div className="global-mini-agent"><AgentMesh mini /></div> : null}
    {meshOpen && !driveMode ? <aside className="global-agent-drawer"><AgentMesh /></aside> : null}
    <FirstTimeCoachMark />
    <VoiceDock open={voiceOpen} onClose={() => setVoiceOpen(false)} driveMode={driveMode} />
  </div>
}

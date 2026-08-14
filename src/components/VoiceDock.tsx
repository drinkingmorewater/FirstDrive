import { ChevronDown, Mic, Sparkles, Volume2, X } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { answerVoiceIntent, createRecognition, routeVoiceIntent, scriptedUtterances, speak } from '../voice'
import { createTaskGraph, executeTaskGraph, extractProfileDraft } from '../agents'
import { useAppState } from '../state/AppState'
import type { VoiceStage } from '../types'

const stages: Array<{ id: VoiceStage; label: string }> = [
  { id: 'listening', label: 'Listening' }, { id: 'understanding', label: 'Understanding' },
  { id: 'working', label: 'Agent Working' }, { id: 'speaking', label: 'Speaking' },
]

export function VoiceDock({ open, onClose, driveMode = false }: { open: boolean; onClose: () => void; driveMode?: boolean }) {
  const navigate = useNavigate()
  const { state, emitAgentEvent, patchLiveContext, setProfileDraft, setActiveTaskId } = useAppState()
  const [stage, setStage] = useState<VoiceStage>('idle')
  const [utterance, setUtterance] = useState('')
  const [answer, setAnswer] = useState('')

  const run = async (text: string) => {
    setUtterance(text); setAnswer(''); setStage('understanding')
    const intent = routeVoiceIntent(text)
    const task = createTaskGraph(intent, text, state)
    setActiveTaskId(task.id)
    if (intent === 'profile_intake' || intent === 'profile_update') setProfileDraft(text, extractProfileDraft(text))
    setStage('working')
    await executeTaskGraph(task, emitAgentEvent, { delay: 170 })
    if (intent === 'navigation') patchLiveContext({ routeVersion: 2, etaMinutes: 41 })
    const nextAnswer = answerVoiceIntent(text, state)
    setAnswer(nextAnswer); setStage('speaking'); setActiveTaskId(null)
    speak(nextAnswer, () => setStage('idle'))
    if (intent === 'profile_intake') { onClose(); navigate('/me/analysis') }
  }

  const listen = () => {
    setStage('listening'); setUtterance(''); setAnswer('')
    createRecognition().listen(text => void run(text), () => { void run(scriptedUtterances[0]) })
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.section className={driveMode ? 'voice-dock voice-dock-drive' : 'voice-dock'} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} aria-label="Voice Copilot">
          <header><div><Sparkles /><strong>Voice Copilot</strong><span>说一句就好，其余交给 Agents</span></div><button onClick={onClose} aria-label="关闭语音助手"><X /></button></header>
          <div className="voice-stages">{stages.map((item, index) => <span key={item.id} className={stage === item.id ? 'active' : ''}><i>{index + 1}</i>{item.label}</span>)}</div>
          <div className="voice-body">
            <button className={'voice-orb ' + (stage !== 'idle' ? 'active' : '')} onClick={listen} aria-label="开始语音输入"><Mic /></button>
            <div><small>你说</small><strong>{utterance || (stage === 'listening' ? '正在听…' : '点击麦克风，或选择一句演示指令')}</strong>{answer ? <><small>FirstDrive 说</small><p><Volume2 />{answer}</p></> : null}</div>
          </div>
          <div className="voice-scripts"><span>你可以这样说 <ChevronDown /></span>{scriptedUtterances.slice(0, 4).map(item => <button key={item} onClick={() => void run(item)}>{item}</button>)}</div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}

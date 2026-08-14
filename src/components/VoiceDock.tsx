import { ChevronDown, Mic, Sparkles, Volume2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { answerVoiceIntent, createRecognition, scriptedUtterances, speak } from '../voice'
import { useAppState } from '../state/AppState'
import type { VoiceStage } from '../types'

const stages: Array<{ id: VoiceStage; label: string }> = [
  { id: 'listening', label: 'Listening' }, { id: 'understanding', label: 'Understanding' },
  { id: 'working', label: 'Agent Working' }, { id: 'speaking', label: 'Speaking' },
]

export function VoiceDock({ open, onClose, driveMode = false }: { open: boolean; onClose: () => void; driveMode?: boolean }) {
  const { emitAgentEvent, patchLiveContext } = useAppState()
  const [stage, setStage] = useState<VoiceStage>('idle')
  const [utterance, setUtterance] = useState('')
  const [answer, setAnswer] = useState('')
  const timers = useRef<number[]>([])
  const clearTimers = () => { timers.current.forEach(window.clearTimeout); timers.current = [] }
  useEffect(() => clearTimers, [])

  const run = (text: string) => {
    clearTimers(); setUtterance(text); setAnswer(''); setStage('understanding')
    timers.current.push(window.setTimeout(() => {
      setStage('working')
      emitAgentEvent({ agent: 'road', status: 'running', title: '正在理解你的问题', detail: text })
    }, 520))
    timers.current.push(window.setTimeout(() => {
      const nextAnswer = answerVoiceIntent(text)
      if (text.includes('路线')) patchLiveContext({ routeVersion: 2, etaMinutes: 41 })
      setAnswer(nextAnswer); setStage('speaking')
      emitAgentEvent({ agent: 'road', status: 'completed', title: '语音任务已完成', detail: nextAnswer })
      speak(nextAnswer, () => setStage('idle'))
    }, 1280))
  }

  const listen = () => {
    setStage('listening'); setUtterance(''); setAnswer('')
    createRecognition().listen(run, () => {
      timers.current.push(window.setTimeout(() => run(scriptedUtterances[0]), 650))
    })
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
          <div className="voice-scripts"><span>你可以这样说 <ChevronDown /></span>{scriptedUtterances.slice(0, 4).map(item => <button key={item} onClick={() => run(item)}>{item}</button>)}</div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}

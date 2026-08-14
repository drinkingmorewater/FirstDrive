import { ArrowRight, Keyboard, Mic, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTaskGraph, executeTaskGraph, extractProfileDraft } from '../agents'
import { useAppState } from '../state/AppState'
import { createRecognition } from '../voice'

const demoText = '我驾照拿了十多年，但是平时很少开。普通市区还行，我最害怕高架和复杂立交。平时主要自己开，偶尔带家里人。'

export function VoiceIntake() {
  const navigate = useNavigate()
  const { state, emitAgentEvent, setActiveTaskId, setOnboardingStatus, setProfileDraft } = useAppState()
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'voice' | 'text'>('text')
  const [status, setStatus] = useState<'idle' | 'listening' | 'working'>('idle')

  const submit = async (input: string) => {
    const value = input.trim()
    if (value.length < 8) return
    setStatus('working')
    const draft = extractProfileDraft(value)
    setProfileDraft(value, draft)
    const task = createTaskGraph('profile_intake', value, state)
    setActiveTaskId(task.id)
    await executeTaskGraph(task, emitAgentEvent, { delay: 220 })
    setActiveTaskId(null)
    navigate('/me/analysis')
  }

  const listen = () => {
    setMode('voice'); setStatus('listening'); setOnboardingStatus('started')
    createRecognition().listen(value => { setText(value); void submit(value) }, () => { setText(demoText); void submit(demoText) })
  }

  return <section className={`voice-intake ${status}`}>
    <header><Sparkles /><span>{status === 'listening' ? '正在听…' : status === 'working' ? 'ME Agent 正在理解…' : '跟 FirstDrive 说说你和开车有关的情况。'}</span></header>
    <textarea value={text} onChange={event => { setText(event.target.value); setMode('text'); setOnboardingStatus('started') }} placeholder="例如：我驾照拿了十多年，但是一直不太敢自己开高架……" aria-label="描述你的汽车生活情况" />
    <footer>
      <div><button className={mode === 'voice' ? 'active' : ''} onClick={listen}><Mic />直接说</button><button className={mode === 'text' ? 'active' : ''} onClick={() => setMode('text')}><Keyboard />打字告诉我</button></div>
      <button className="intake-submit" disabled={text.trim().length < 8 || status === 'working'} onClick={() => void submit(text)}>开始理解 <ArrowRight /></button>
    </footer>
  </section>
}

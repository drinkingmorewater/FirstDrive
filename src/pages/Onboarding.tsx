import { ArrowRight, Check, CarFront, Map, Route } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { useAppState } from '../state/AppState'

const questions = [
  { title: '驾照拿了多久？', options: ['不到 1 年', '1–3 年', '4–8 年', '8 年以上'], icon: Route },
  { title: '过去一年，你实际开车多频繁？', options: ['每周多次', '每月几次', '偶尔', '几乎没有'], icon: Map },
  { title: '哪些场景想先熟悉？', options: ['快速路', '高架', '复杂变道', '夜间驾驶'], icon: CarFront },
]

export function Onboarding() {
  const navigate = useNavigate()
  const { resetDemo } = useAppState()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const question = questions[step]
  const Icon = question.icon
  const choose = (answer: string) => {
    setAnswers(current => [...current.slice(0, step), answer])
    if (step === questions.length - 1) { resetDemo(); navigate('/familiarity') } else setStep(value => value + 1)
  }
  return <AppShell compact><div className="onboarding-page page-frame narrow-frame"><div className="onboarding-progress">{questions.map((_, index) => <span key={index} className={index <= step ? 'active' : ''}>{index < step ? <Check size={14} /> : index + 1}</span>)}</div><Icon size={34} /><span>了解你真正经历过什么</span><h1>{question.title}</h1><div className="onboarding-options">{question.options.map(option => <Button key={option} variant="secondary" onClick={() => choose(option)}>{option}<ArrowRight size={16} /></Button>)}</div><button className="demo-skip" onClick={() => { resetDemo(); navigate('/familiarity') }}>载入示例用户</button></div></AppShell>
}

import { ArrowRight, Check } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { MobilityIntelligenceCanvas } from '../components/MobilityIntelligenceCanvas'
import { useAppState } from '../state/AppState'

const optionsFor = (question: string) => question.includes('哪座城市') ? ['上海', '北京', '柏林', '之后再确认'] : question.includes('自己开') ? ['主要自己', '经常带家人', '两种都有', '之后再确认'] : question.includes('固定使用') ? ['有自己的车', '经常租车', '正在准备买车', '之后再确认'] : ['是，经常', '偶尔', '很少 / 不会', '之后再确认']

export function MeAnalysis() {
  const navigate = useNavigate()
  const { state, answerProfileQuestion, confirmProfileDraft } = useAppState()
  const draft = state.profileIntake.draft
  if (!draft) return <Navigate to="/welcome" replace />
  const answered = draft.questions.every(question => Boolean(state.profileIntake.answers[question]))
  const confirm = () => { confirmProfileDraft(); navigate('/me/passport') }
  return <div className="analysis-page"><header><div><small>FIRSTDRIVE ANALYSIS</small><h1>这是我现在理解的你。</h1><p>明确事实、合理推测和待确认信息已经分开。</p></div><span><Check />{draft.evidence.filter(item => item.state === 'confirmed').length} 条已确认</span></header><MobilityIntelligenceCanvas />
    <section className="analysis-followup"><div><small>ADAPTIVE FOLLOW-UP</small><h2>再确认 {draft.questions.length} 件事</h2><p>只问原话里还没有的信息。</p></div><div>{draft.questions.map(question => <article key={question}><strong>{question}</strong><div>{optionsFor(question).map(option => <button key={option} className={state.profileIntake.answers[question] === option ? 'active' : ''} onClick={() => answerProfileQuestion(question, option)}>{option}</button>)}</div></article>)}</div><button className="confirm-profile" disabled={!answered} onClick={confirm}>确认并建立 Mobility Passport <ArrowRight /></button></section>
  </div>
}

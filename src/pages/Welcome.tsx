import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MountainMark } from '../components/MountainMark'
import { VoiceIntake } from '../components/VoiceIntake'

const examples = ['我驾照拿了十多年，但是一直不太敢自己开高架。', '我马上毕业，想买人生第一辆车。', '我刚买新能源，第一次准备跑长途。', '我准备去德国租车自驾。']

export function Welcome() {
  return <div className="welcome-page"><section className="welcome-hero"><div className="welcome-wordmark"><MountainMark size={38} /><span><strong>FirstDrive</strong><small>第一公里</small></span></div><p>每个人，都有自己的第一公里。</p><h1>先让我认识你。</h1><VoiceIntake /><div className="intake-examples">{examples.map(item => <span key={item}>“{item}”</span>)}</div><Link className="structured-entry" to="/onboarding">我想一步一步填写 <ArrowRight /></Link></section><aside className="welcome-principle"><small>PERSONAL MOBILITY AGENT</small><strong>人 × 车 × 路 × 境</strong><p>从你的真实处境开始，陪你完成汽车生活里的每一次陌生。</p></aside></div>
}

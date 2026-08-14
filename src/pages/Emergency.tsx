import { AlertOctagon, ArrowLeft, ArrowRight, Car, Check, MapPin, ShieldCheck, TriangleAlert, Wrench } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { useAppState } from '../state/AppState'

const steps = [
  { title: '先确认人员安全', body: '打开双闪，在确保安全的前提下让所有人员撤离到护栏外。不要站在车辆前后方。', icon: ShieldCheck },
  { title: '放置三角警示牌', body: '普通道路放在车后约 50–100 米；高速道路应放在更远处。以现场规则与安全为先。', icon: TriangleAlert },
  { title: '确认车辆工具', body: 'Demo Vehicle：三角警示牌与补胎工具包位于后备箱盖板下。本车无全尺寸备胎。', icon: Wrench },
  { title: '联系道路救援', body: '确认当前位置与行驶方向，联系保险或道路救援；在安全区域等待。', icon: Car },
]

export function Emergency() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [safe, setSafe] = useState<boolean | null>(null)
  const [step, setStep] = useState(0)

  return (
    <AppShell compact>
      <div className="emergency-page page-frame narrow-frame">
        <button className="text-back" onClick={() => navigate(-1)}><ArrowLeft size={17} /> 返回</button>
        <header><AlertOctagon size={37} /><div><span>爆胎 · Emergency Mode</span><h1>先保证人处在安全位置。</h1><p>当前流程为 Demo Data，仅作辅助。紧急情况下请优先遵循现场交警、道路救援与车辆说明书。</p></div></header>
        {safe === null ? (
          <section className="safety-question"><h2>你和同行人员已经离开车道，并处在安全位置吗？</h2><div><Button onClick={() => setSafe(true)}><Check size={18} /> 已经安全</Button><Button variant="danger" onClick={() => setSafe(false)}>还没有</Button></div></section>
        ) : !safe ? (
          <section className="unsafe-state"><TriangleAlert size={36} /><h2>先不要继续操作车辆。</h2><p>尽可能打开双闪，在确认周围交通安全后撤离到安全区域。若车辆停在高速行车道且无法移动，请立即联系紧急服务。</p><Button onClick={() => setSafe(true)}>我已到达安全位置 <ArrowRight size={17} /></Button></section>
        ) : (
          <section className="emergency-workflow">
            <div className="emergency-progress">{steps.map((item, index) => <span key={item.title} className={index <= step ? 'active' : ''}>{index + 1}</span>)}</div>
            {(() => { const current = steps[step]; const Icon = current.icon; return <div className="emergency-step"><Icon size={40} /><span>步骤 {step + 1} / {steps.length}</span><h2>{current.title}</h2><p>{current.body}</p>{step === 2 ? <div className="manual-source"><MapPin size={17} />来源：{state.vehicle.brand} {state.vehicle.model} Demo Manual</div> : null}<Button onClick={() => step === steps.length - 1 ? navigate('/') : setStep(value => value + 1)}>{step === steps.length - 1 ? '完成并回到首页' : '我已完成这一步'} <ArrowRight size={17} /></Button></div> })()}
          </section>
        )}
      </div>
    </AppShell>
  )
}

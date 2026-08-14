import { AlertTriangle, ArrowRight, Camera, CarFront, Check, CircleHelp, ClipboardList, FileText, Globe2, LifeBuoy, MapPin, MessageSquareText, Phone, ShieldAlert, Stethoscope, Wrench } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { helpAgent } from '../agents'
import { AgentActivity } from '../components/AgentActivity'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

const tools = [
  { id: 'emergency', label: '紧急求助', en: 'Emergency', icon: ShieldAlert, to: '/emergency' },
  { id: 'accident', label: '事故助手', en: 'Accident Assistant', icon: AlertTriangle, to: '/help/accident' },
  { id: 'repair', label: '维修翻译官', en: 'Repair Translator', icon: Wrench, to: '/help/repair' },
  { id: 'rental', label: '租车模式', en: 'Rental Mode', icon: CarFront, to: '/help/rental' },
  { id: 'abroad', label: '海外驾驶', en: 'Abroad Driving', icon: Globe2, to: '/help/abroad' },
]

export function Help() {
  const { tool } = useParams()
  const { state, emitAgentEvent } = useAppState()
  const ran = useRef(false)

  useEffect(() => {
    if (tool === 'accident' && !ran.current) {
      ran.current = true
      void helpAgent.execute({ state, emit: emitAgentEvent })
    }
  }, [emitAgentEvent, state, tool])

  return <AppShell compact><div className="help-shell">
    <aside className="help-rail"><div><span>HELP ME</span><p>一步步帮你处理</p></div>{tools.map(({ to, label, en, icon: Icon, id }) => <Link key={id} to={to} className={tool === id || (!tool && id === 'accident') ? 'active' : ''}><Icon /><span>{label}<small>{en}</small></span></Link>)}</aside>
    <main className="help-main">{!tool ? <HelpHub /> : tool === 'accident' ? <AccidentTool /> : tool === 'repair' ? <RepairTool /> : tool === 'rental' ? <RentalTool /> : <AbroadTool />}</main>
    <aside className="help-context"><section><span>车辆与位置</span><div><CarFront /><strong>{state.vehicle.brand} {state.vehicle.model}</strong><small>燃油 68% · 车辆状态正常</small></div><p><MapPin />上海 · 浦东新区<br />张杨路近世纪大道</p></section><AgentActivity emptyText="Help Agent 等待任务" /></aside>
  </div></AppShell>
}

function HelpHub() {
  return <section className="help-hub"><span className="eyebrow">HELP ME · 帮帮我</span><h1>遇到问题时，<br />先做下一件正确的事。</h1><p>FirstDrive 不替你判断责任或给出医疗结论，而是把复杂现场拆成清晰步骤。</p><div>{tools.slice(1).map(({ to, label, en, icon: Icon }) => <Link to={to} key={to}><Icon /><span><small>{en}</small><strong>{label}</strong></span><ArrowRight /></Link>)}</div></section>
}

function AccidentTool() {
  const { addIncidentRecord, emitAgentEvent } = useAppState()
  const steps = ['先确认人员安全', '现场照片清单', '收集对方信息', '整理事故经过', '保险材料']
  const [step, setStep] = useState(0)
  const checklists = [
    ['车辆已移至安全位置（如可移动）', '已开启双闪', '已设置警示标志', '车内外人员均处于安全区域', '确认是否有人受伤，必要时拨打 120'],
    ['全景：道路、车道与双方车辆', '近景：碰撞点与受损部位', '标识：车牌、道路标志与信号灯', '不要为了拍照进入危险车道'],
    ['对方姓名与联系电话', '车牌、驾驶证与行驶证', '保险公司与保单信息'],
    ['时间、地点与天气', '双方行驶方向', '只记录事实，不判断责任'],
    ['事故照片原图', '双方证件信息', '事故经过记录', '报警或报案编号'],
  ]
  const [checked, setChecked] = useState<number[]>([])
  const [saved, setSaved] = useState(false)
  const next = () => {
    if (step < 4) { setStep(value => value + 1); setChecked([]); return }
    const record = { id: `incident-${Date.now()}`, time: new Date().toISOString(), location: '上海 · 浦东新区 · 张杨路近世纪大道', photos: ['现场全景', '碰撞点', '双方车牌'], peopleSafe: true, otherPartyInfo: '已记录驾驶证、行驶证与联系方式', description: '双方同向行驶，低速接触；仅记录事实，未判断责任。', insuranceChecklist: checklists[4], status: 'ready' as const }
    addIncidentRecord(record)
    emitAgentEvent({ agent: 'help', status: 'completed', title: 'Incident Record 已保存', detail: '照片、对方信息、事故经过与保险清单已写入 Incident Memory' })
    setSaved(true)
  }
  return <section className="accident-tool">
    <header><span>事故助手 · ACCIDENT ASSISTANT</span><h1>{steps[step]}</h1><p>步骤 {step + 1} / 5 · 只收集与整理，不判断事故责任。</p></header>
    <div className="stepper">{steps.map((label, index) => <button key={label} className={index === step ? 'active' : index < step ? 'done' : ''} onClick={() => { setStep(index); setChecked([]) }}><i>{index < step ? <Check /> : index + 1}</i><span>{label}</span></button>)}</div>
    <div className="accident-card">
      <div className="accident-copy"><span>安全检查清单</span><h2>{steps[step]}</h2><p>{step === 0 ? '确保自己与他人处于安全位置，开启双闪，必要时设置警示标志。' : '按现场顺序逐项完成，已确认的内容会进入本次事故记录。'}</p>
        <div>{checklists[step].map((item, index) => <button key={item} className={checked.includes(index) ? 'checked' : ''} onClick={() => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index])}><Check />{item}</button>)}</div>
      </div>
      <aside>{step === 0 ? <><ShieldAlert /><strong>先保护人，再处理车。</strong><p>如有人受伤或现场仍有危险，请立即联系 120 / 110。</p><a href="tel:120"><Phone /> 拨打 120</a></> : step === 1 ? <><Camera /><strong>照片要完整，但不要冒险。</strong><p>保持原图，不编辑时间与位置信息。</p></> : <><FileText /><strong>Help Agent 正在整理</strong><p>你确认的信息会进入一份可继续补充的材料包。</p></>}</aside>
    </div>
    <button className="primary-action" onClick={next} disabled={saved}>{saved ? '事故材料包已保存' : step === 4 ? '保存事故材料包' : checked.length ? '已完成当前步骤，继续' : '我已确认，继续'} <ArrowRight /></button>
  </section>
}

function RepairTool() {
  const { addTimeline } = useAppState()
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [repaired, setRepaired] = useState(false)
  return <section className="simple-help-tool"><span className="eyebrow">REPAIR TRANSLATOR</span><h1>把维修术语，翻译成<br />你能做决定的信息。</h1><p>粘贴维修店的检测结论或报价，FirstDrive 会拆成“要做什么、为什么、现在是否必要”。</p>
    <div className="repair-box"><MessageSquareText /><textarea value={text} onChange={event => setText(event.target.value)} placeholder="例如：建议更换前减震器顶胶、清洗节气门…" /><button onClick={() => { if (!text) setText('右前减震器顶胶老化，建议更换；节气门积碳，建议清洗。工时费 680 元。'); setDone(true) }}>翻译维修建议</button></div>
    {done ? <><div className="translation-results"><article><Stethoscope /><span><small>现在需要处理</small><strong>右前减震器顶胶老化</strong><p>如果已有异响或转向卡顿，建议近期处理；请让技师展示松旷或开裂证据。</p></span></article><article><CircleHelp /><span><small>可以继续追问</small><strong>节气门清洗依据是什么？</strong><p>询问是否有怠速不稳、故障码或可见积碳，不必仅凭里程更换。</p></span></article></div><button className="primary-action" disabled={repaired} onClick={() => { addTimeline({ id: `repair-${Date.now()}`, date: new Date().toISOString().slice(0,10), domain: 'vehicle', title: '维修完成：右前减震器顶胶', detail: '维修建议、追问与完成状态已同步 Vehicle Memory。' }); setRepaired(true) }}>{repaired ? '已写入 Vehicle Memory' : '标记为已维修并保存'}</button></> : null}
  </section>
}

function RentalTool() {
  const { addTimeline } = useAppState()
  const items = ['拍摄车辆四周与已有划痕', '确认油量 / 电量与归还要求', '检查轮胎、灯光和随车工具', '在车辆静止时熟悉挡位与手刹', '确认保险免赔额与道路救援']
  const [checked, setChecked] = useState<number[]>([])
  const [saved, setSaved] = useState(false)
  return <><ChecklistHelp eyebrow="RENTAL MODE" title="陌生的车，先花三分钟建立掌控感。" items={items} checked={checked} setChecked={setChecked} />{checked.length === items.length ? <button className="primary-action" disabled={saved} onClick={() => { addTimeline({ id: `rental-${Date.now()}`, date: new Date().toISOString().slice(0,10), domain: 'vehicle', title: '创建 Rental Session', detail: '取车外观、里程、能源、保险和归还规则已记录。' }); setSaved(true) }}>{saved ? 'Rental Session 已保存' : '保存 Rental Session'}</button> : null}</>
}

function AbroadTool() {
  const [country, setCountry] = useState('日本')
  return <section className="simple-help-tool"><span className="eyebrow">ABROAD DRIVING</span><h1>在陌生规则里，<br />先抓住最容易出错的三件事。</h1><label className="country-select">目的地<select value={country} onChange={event => setCountry(event.target.value)}><option>日本</option><option>德国</option><option>英国</option></select></label><div className="abroad-cards"><article><Globe2 /><small>行驶方向</small><strong>{country === '德国' ? '右侧通行' : '左侧通行'}</strong><p>转弯和驶出停车场时最容易回到习惯方向。</p></article><article><ClipboardList /><small>出发前</small><strong>确认驾照与租车保险</strong><p>不同国家与租车公司要求不同，以当地官方规则和合同为准。</p></article><article><LifeBuoy /><small>紧急号码</small><strong>{country === '日本' ? '110 / 119' : '112'}</strong><p>保存租车公司道路救援电话与车辆位置。</p></article></div></section>
}

function ChecklistHelp({ eyebrow, title, items, checked, setChecked }: { eyebrow: string; title: string; items: string[]; checked: number[]; setChecked: (value: number[]) => void }) {
  return <section className="simple-help-tool"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><div className="rental-checks">{items.map((item, index) => <button key={item} className={checked.includes(index) ? 'checked' : ''} onClick={() => setChecked(checked.includes(index) ? checked.filter(value => value !== index) : [...checked, index])}><Check /><span><small>0{index + 1}</small><strong>{item}</strong></span></button>)}</div></section>
}

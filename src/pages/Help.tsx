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
  { id: 'rental', label: '租车模式', en: 'Rental Mode', icon: CarFront, to: '/rental/session' },
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
    {saved ? <Link className="primary-action" to="/help/repair">事故材料包已保存，继续维修流程 <ArrowRight /></Link> : <button className="primary-action" onClick={next}>{step === 4 ? '保存事故材料包' : checked.length ? '已完成当前步骤，继续' : '我已确认，继续'} <ArrowRight /></button>}
  </section>
}

function RepairTool() {
  const { state, addTimeline } = useAppState()
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [repaired, setRepaired] = useState(false)
  const incident = state.memory.incident.records[0]
  return <section className="simple-help-tool"><span className="eyebrow">REPAIR TRANSLATOR</span><h1>把维修术语，翻译成<br />你能做决定的信息。</h1><p>{incident ? `已接续 ${incident.location} 的 Incident Record；维修结果会继续写入同一车辆时间线。` : '粘贴维修店的检测结论或报价，FirstDrive 会拆成“要做什么、为什么、现在是否必要”。'}</p>
    <div className="repair-box"><MessageSquareText /><textarea value={text} onChange={event => setText(event.target.value)} placeholder="例如：建议更换前减震器顶胶、清洗节气门…" /><button onClick={() => { if (!text) setText('右前减震器顶胶老化，建议更换；节气门积碳，建议清洗。工时费 680 元。'); setDone(true) }}>翻译维修建议</button></div>
    {done ? <><div className="translation-results"><article><Stethoscope /><span><small>现在需要处理</small><strong>右前减震器顶胶老化</strong><p>如果已有异响或转向卡顿，建议近期处理；请让技师展示松旷或开裂证据。</p></span></article><article><CircleHelp /><span><small>可以继续追问</small><strong>节气门清洗依据是什么？</strong><p>询问是否有怠速不稳、故障码或可见积碳，不必仅凭里程更换。</p></span></article></div><button className="primary-action" disabled={repaired} onClick={() => { addTimeline({ id: `repair-${Date.now()}`, date: new Date().toISOString().slice(0,10), domain: 'vehicle', title: '维修完成：右前减震器顶胶', detail: '维修建议、追问与完成状态已同步 Vehicle Memory。' }); setRepaired(true) }}>{repaired ? '已写入 Vehicle Memory' : '标记为已维修并保存'}</button></> : null}
  </section>
}

function RentalTool() {
  return <section className="simple-help-tool"><span className="eyebrow">RENTAL FULL LOOP</span><h1>从取车证据，到归还对照。</h1><p>建立 Rental Session 后，里程、能源、照片与已有损伤会持续到归还。</p><Link className="primary-action" to="/rental/session">开始取车检查 <ArrowRight /></Link></section>
}

function AbroadTool() {
  const [country, setCountry] = useState('日本')
  const [licenseCountry, setLicenseCountry] = useState('中国')
  const [status, setStatus] = useState('游客租车')
  const rules = country === '德国' ? { side: '右侧通行', documents: '中国驾照 + 合规翻译件；租车公司可能有额外要求', parking: '注意居民停车区、停车盘与环保区', toll: '普通小客车高速通常不收通行费', emergency: '112' } : country === '英国' ? { side: '左侧通行', documents: '中国驾照 + 英文翻译材料，按租车公司要求核验', parking: '黄线、居民区与拥堵收费区域需单独确认', toll: '部分桥梁与城市道路收费', emergency: '999 / 112' } : { side: '左侧通行', documents: '通常需要符合日本要求的国际驾照材料；出发前核验官方规则', parking: '禁止路边随意停车，优先使用计时停车场', toll: '高速公路收费，租车可确认 ETC', emergency: '110 / 119' }
  return <section className="simple-help-tool"><span className="eyebrow">ABROAD DRIVING</span><h1>在陌生规则里，<br />先确认自己到底能不能开。</h1><div className="abroad-inputs"><label>Country<select value={country} onChange={event => setCountry(event.target.value)}><option>日本</option><option>德国</option><option>英国</option></select></label><label>License Country<select value={licenseCountry} onChange={event => setLicenseCountry(event.target.value)}><option>中国</option><option>德国</option></select></label><label>Residence / Tourist<select value={status} onChange={event => setStatus(event.target.value)}><option>游客租车</option><option>当地居民</option></select></label></div><div className="abroad-cards"><article><Globe2 /><small>驾照与方向</small><strong>{licenseCountry}驾照 · {rules.side}</strong><p>{rules.documents}</p></article><article><ClipboardList /><small>停车与收费</small><strong>{rules.parking}</strong><p>{rules.toll}</p></article><article><LifeBuoy /><small>紧急号码</small><strong>{rules.emergency}</strong><p>{status} · 保存租车公司道路救援电话与车辆位置。</p></article></div><p className="mock-source">Mock Source · 当地交通主管部门 / 租车条款摘要 · updatedAt 2026-08-14</p></section>
}

function ChecklistHelp({ eyebrow, title, items, checked, setChecked }: { eyebrow: string; title: string; items: string[]; checked: number[]; setChecked: (value: number[]) => void }) {
  return <section className="simple-help-tool"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><div className="rental-checks">{items.map((item, index) => <button key={item} className={checked.includes(index) ? 'checked' : ''} onClick={() => setChecked(checked.includes(index) ? checked.filter(value => value !== index) : [...checked, index])}><Check /><span><small>0{index + 1}</small><strong>{item}</strong></span></button>)}</div></section>
}

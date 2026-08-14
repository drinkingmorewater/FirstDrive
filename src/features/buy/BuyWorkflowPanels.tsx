import { AlertCircle, Camera, Check, CheckCircle2, ChevronRight, ClipboardCheck, FileSearch, FileText, ImagePlus, Save, ShieldCheck, Upload } from 'lucide-react'
import { useState } from 'react'
import { buyTools } from '../../tools'
import type { VehicleFitResult } from '../../types'
import { useAppState } from '../../state/AppState'

const sampleDeal = `裸车价 259900 元\n优惠 8000 元（贷款方案）\n保险 6370 元\n上牌 1500 元\n服务费 3000 元\n贷款 5 年，月供 4280 元\n赠品：脚垫、玻璃膜、充电桩`

export function DealWorkflow({ selected }: { selected: VehicleFitResult }) {
  const { addTimeline, emitAgentEvent } = useAppState()
  const [text, setText] = useState(sampleDeal)
  const [result, setResult] = useState<ReturnType<typeof buyTools.parseDeal> | null>(null)
  const [fileName, setFileName] = useState('')

  const analyze = () => {
    emitAgentEvent({ agent: 'buy', status: 'running', title: '正在解析报价内容', detail: `识别 ${selected.vehicle.brand} ${selected.vehicle.model} 的价格、金融与附加费用` })
    const parsed = buyTools.parseDeal(text)
    setResult(parsed)
    emitAgentEvent({ agent: 'buy', status: 'completed', title: 'Deal Checker 已完成', detail: `识别车价 ¥${parsed.vehiclePrice.toLocaleString()}，生成 ${parsed.questions.length} 个销售追问` })
  }

  const save = () => {
    if (!result) return
    addTimeline({ id: `deal-${Date.now()}`, date: new Date().toISOString().slice(0, 10), domain: 'cost', title: '保存报价检查结果', detail: `${selected.vehicle.brand} ${selected.vehicle.model} · ${result.questions.length} 个待追问问题。` })
  }

  return <section className="buy-workflow deal-workflow">
    <header><div><small>DEAL CHECKER</small><h2>把报价单里的每一笔钱说清楚。</h2><p>上传报价截图、金融方案或粘贴合同文本，Buy Agent 会整理“已明确 / 待确认 / 值得追问”。</p></div><FileSearch /></header>
    <div className="deal-input-grid">
      <label className="upload-tile"><Upload /><strong>{fileName || '上传报价截图或文本'}</strong><span>PNG / JPG / TXT · Demo 本地解析</span><input type="file" accept="image/*,.txt" onChange={event => {
        const file = event.target.files?.[0]
        if (!file) return
        setFileName(file.name)
        if (file.type.startsWith('text')) void file.text().then(setText)
      }} /></label>
      <label className="deal-text"><span>报价 / 合同文本</span><textarea value={text} onChange={event => setText(event.target.value)} /></label>
      <button className="workflow-primary" onClick={analyze}><FileSearch />开始检查</button>
    </div>
    {result ? <>
      <div className="deal-summary"><CheckCircle2 /><span><strong>检查完成</strong>识别裸车、保险与服务费；金融总利息和提前还款条款仍需确认。</span><button onClick={save}><Save />写入 Cost Memory</button></div>
      <div className="deal-columns">
        <DealColumn tone="good" title="已明确" icon={<CheckCircle2 />} items={[`裸车价 ¥${result.vehiclePrice.toLocaleString()}`, `保险 ¥${result.insurance.toLocaleString()}`, `上牌 ¥${result.registration.toLocaleString()}`]} />
        <DealColumn tone="pending" title="待确认" icon={<AlertCircle />} items={['贷款实际年化利率', '提前还款违约金', '优惠是否绑定店内保险']} />
        <DealColumn tone="ask" title="值得追问" icon={<FileText />} items={[`服务费 ¥${result.serviceFee.toLocaleString()} 能否取消？`, '赠品品牌与型号是否写进合同？', '交付延期如何补偿？']} />
      </div>
      <section className="sales-questions"><header><div><small>由当前报价生成</small><h3>问销售的 7 个问题</h3></div><button onClick={() => navigator.clipboard?.writeText(result.questions.map((item, index) => `${index + 1}. ${item}`).join('\n'))}>复制全部</button></header>{result.questions.map((item, index) => <p key={item}><b>{index + 1}</b>{item}<ChevronRight /></p>)}</section>
    </> : <div className="workflow-empty"><FileText /><strong>等待一份报价</strong><span>上面的示例内容可以直接检查，也可以换成你的文本。</span></div>}
  </section>
}

function DealColumn({ tone, title, icon, items }: { tone: string; title: string; icon: React.ReactNode; items: string[] }) {
  return <section className={`deal-column ${tone}`}><header>{icon}<strong>{title}</strong><b>{items.length}</b></header>{items.map(item => <p key={item}>{item}</p>)}</section>
}

const deliveryItems = ['核对 VIN 与合同配置', '检查生产日期', '检查漆面与钣金缝隙', '检查玻璃日期与破损', '检查轮胎日期与胎压', '确认表显里程', '测试灯光与雨刷', '测试空调与车机', '确认两把钥匙', '确认随车工具', '核对保险与发票', '拍摄交付全车照片']

export function DeliveryWorkflow({ selected }: { selected: VehicleFitResult }) {
  const { commitDeliveryRecord, emitAgentEvent } = useAppState()
  const [checked, setChecked] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const progress = Math.round(checked.length / deliveryItems.length * 100)
  const toggle = (item: string) => setChecked(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item])
  const finish = () => {
    const now = new Date().toISOString()
    commitDeliveryRecord({ id: `delivery-${Date.now()}`, vehicleName: `${selected.vehicle.brand} ${selected.vehicle.model}`, checkedItems: checked, createdAt: now, status: checked.length === deliveryItems.length ? 'completed' : 'in_progress' })
    emitAgentEvent({ agent: 'buy', status: 'completed', title: 'Vehicle Birth Record 已建立', detail: `${checked.length} 项现场检查与 ${photos.length} 张照片已写入 Vehicle Memory` })
    setSaved(true)
  }
  return <section className="buy-workflow delivery-workflow">
    <header><div><small>DELIVERY CHECK</small><h2>提车现场，按真实顺序一步步完成。</h2><p>{selected.vehicle.brand} {selected.vehicle.model} · 检查结果会形成 Vehicle Birth Record。</p></div><ClipboardCheck /></header>
    <div className="workflow-progress"><span><b>{progress}%</b>现场检查进度</span><i><b style={{ width: `${progress}%` }} /></i><strong>{checked.length} / {deliveryItems.length}</strong></div>
    <div className="delivery-layout"><div className="delivery-checks">{deliveryItems.map((item, index) => <button key={item} className={checked.includes(item) ? 'checked' : ''} onClick={() => toggle(item)}><span>{checked.includes(item) ? <Check /> : index + 1}</span><strong>{item}</strong><small>{index < 2 ? '证件与车辆身份' : index < 6 ? '外观与基础状态' : index < 9 ? '功能测试' : '文件与留存'}</small></button>)}</div><aside className="photo-capture"><Camera /><h3>现场照片</h3><p>照片只保存在当前 Demo 浏览器中，记录文件名用于 Birth Record。</p><label><ImagePlus />添加照片<input type="file" accept="image/*" multiple onChange={event => setPhotos(Array.from(event.target.files ?? []).map(file => file.name))} /></label>{photos.map(photo => <span key={photo}>{photo}<CheckCircle2 /></span>)}</aside></div>
    <footer><div>{saved ? <><CheckCircle2 /><span><strong>记录已保存</strong>可以在 Vehicle Memory 查看</span></> : <><ShieldCheck /><span><strong>安全保存</strong>至少完成 6 项即可保存进行中的记录</span></>}</div><button className="workflow-primary" disabled={checked.length < 6} onClick={finish}><Save />建立 Vehicle Birth Record</button></footer>
  </section>
}

const usedItems = ['核对登记证与 VIN', '读取维保与出险记录', '检查结构件与焊点', '检查漆膜异常', '检查轮胎与玻璃日期', '检查发动机 / 电池工况', '核对市场价格区间', '预约第三方复检']

export function UsedCarWorkflow() {
  const { commitUsedCarReport, emitAgentEvent } = useAppState()
  const [description, setDescription] = useState('2022 款纯电轿车，里程 48,000 km，卖家称无事故')
  const [checked, setChecked] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const risk = description.includes('事故') && !description.includes('无事故') ? 'high' : checked.length >= 6 ? 'low' : 'medium'
  const save = () => {
    commitUsedCarReport({ id: `used-${Date.now()}`, vehicleDescription: description, checkedItems: checked, riskLevel: risk, createdAt: new Date().toISOString() })
    emitAgentEvent({ agent: 'buy', status: 'completed', title: 'Used Car Inspection Report 已保存', detail: `${checked.length} 项检查 · ${risk === 'low' ? '低' : risk === 'medium' ? '中' : '高'}风险` })
    setSaved(true)
  }
  return <section className="buy-workflow used-workflow">
    <header><div><small>USED CAR MODE</small><h2>先验证证据，再决定价格。</h2><p>资料 → 外观 → 机械 / 电池 → 价格 → 第三方检查，结果进入 Vehicle Memory。</p></div><ShieldCheck /></header>
    <div className="used-summary"><label><span>车辆描述</span><textarea value={description} onChange={event => setDescription(event.target.value)} /></label><section><small>当前风险</small><strong className={risk}>{risk === 'low' ? '低' : risk === 'medium' ? '中' : '高'}</strong><p>{risk === 'low' ? '关键证据较完整，仍建议完成第三方复检。' : '证据尚不完整，不建议进入价格谈判。'}</p></section></div>
    <div className="used-checks">{usedItems.map((item, index) => <button key={item} className={checked.includes(item) ? 'checked' : ''} onClick={() => setChecked(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item])}><span>{checked.includes(item) ? <Check /> : index + 1}</span><strong>{item}</strong><ChevronRight /></button>)}</div>
    <footer><div>{saved ? <><CheckCircle2 /><span><strong>检查报告已保存</strong>Vehicle Memory 已同步</span></> : <><FileText /><span><strong>{checked.length} / {usedItems.length} 项已完成</strong>完成越多，风险判断越可靠</span></>}</div><button className="workflow-primary" disabled={checked.length < 4} onClick={save}><Save />保存检查报告</button></footer>
  </section>
}

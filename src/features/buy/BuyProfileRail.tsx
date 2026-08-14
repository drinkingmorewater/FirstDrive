import {
  Banknote, BarChart3, BatteryCharging, BriefcaseBusiness, Gauge, Luggage,
  CircleGauge as SteeringWheel, MapPin, Pencil, Route, SquareParking, UsersRound, WalletCards, X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAppState } from '../../state/AppState'
import type { MobilityProfile } from '../../types'

type EditableKey = 'city' | 'purchaseBudget' | 'monthlyIncome' | 'dailyCommuteKm' | 'annualMileageKm' |
  'longTripFrequency' | 'parkingType' | 'homeCharging' | 'passengerPattern' | 'usageTypes' | 'vehiclePriorities' | 'assistance'

type RailItem = {
  key: EditableKey
  label: string
  value: string
  Icon: typeof MapPin
}

export function BuyProfileRail() {
  const { state, patchMobility } = useAppState()
  const profile = state.user.mobility
  const [editing, setEditing] = useState<EditableKey | null>(null)

  const items = useMemo<RailItem[]>(() => [
    { key: 'city', label: '城市', value: profile.city, Icon: MapPin },
    { key: 'purchaseBudget', label: '预算', value: `${Math.round((profile.idealBudget ?? 250000) / 10000)}–${Math.round((profile.purchaseBudget ?? 350000) / 10000)} 万元`, Icon: WalletCards },
    { key: 'monthlyIncome', label: '收入', value: `税后月收 ${Math.round(profile.monthlyIncome ?? 0).toLocaleString()} 元`, Icon: Banknote },
    { key: 'dailyCommuteKm', label: '日常通勤', value: `单程 ${profile.dailyCommuteKm} km · ${profile.commuteMinutes} 分钟`, Icon: BriefcaseBusiness },
    { key: 'annualMileageKm', label: '年里程', value: `${profile.annualMileageKm.toLocaleString()} km`, Icon: Gauge },
    { key: 'longTripFrequency', label: '长途频率', value: profile.longTripFrequency, Icon: Route },
    { key: 'parkingType', label: '停车', value: profile.parkingType, Icon: SquareParking },
    { key: 'homeCharging', label: '家充', value: profile.homeCharging ? '有（7kW 慢充桩）' : profile.homeCharging === false ? '无固定家充' : '尚未确认', Icon: BatteryCharging },
    { key: 'passengerPattern', label: '常用乘员', value: profile.passengerPattern.length ? `2–3 人（含 ${profile.passengerPattern.join('、')}）` : '以独自驾驶为主', Icon: UsersRound },
    { key: 'usageTypes', label: '用途', value: profile.usageTypes.join('，'), Icon: Luggage },
    { key: 'vehiclePriorities', label: '驾驶偏好', value: `${profile.vehiclePriorities[0] ?? '舒适'}优先，偶尔追求驾驶感`, Icon: SteeringWheel },
    { key: 'assistance', label: '成本敏感度', value: `${(profile.monthlyCarBudget ?? 5000) < 4500 ? '高' : '中'}（关注总拥有成本）`, Icon: BarChart3 },
  ], [profile])

  return (
    <aside className="buy-profile-rail">
      <div className="profile-rail-list">
        {items.map(({ key, label, value, Icon }) => (
          <button key={key} className="profile-rail-item" onClick={() => setEditing(key)} aria-label={`编辑${label}`}>
            <Icon aria-hidden="true" />
            <span><small>{label}</small><strong>{value}</strong></span>
            <Pencil aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="profile-ai-note">
        <span>基于你的输入，AI 已生成 3 款最匹配车型</span>
        <small>调整偏好将实时更新结果</small>
      </div>
      {editing ? <ProfileEditor key={editing} editing={editing} profile={profile} onClose={() => setEditing(null)} onSave={patch => { patchMobility(patch); setEditing(null) }} /> : null}
    </aside>
  )
}

function ProfileEditor({ editing, profile, onClose, onSave }: { editing: EditableKey; profile: MobilityProfile; onClose: () => void; onSave: (patch: Partial<MobilityProfile>) => void }) {
  const current = valueFor(editing, profile)
  const [value, setValue] = useState(current)
  const title = editorTitle[editing]

  const save = () => {
    if (editing === 'city') onSave({ city: value })
    else if (editing === 'purchaseBudget') onSave({ idealBudget: Number(value) * 10000, purchaseBudget: (Number(value) + 7) * 10000 })
    else if (editing === 'monthlyIncome') onSave({ monthlyIncome: Number(value) })
    else if (editing === 'dailyCommuteKm') onSave({ dailyCommuteKm: Number(value), commuteMinutes: Math.max(15, Math.round(Number(value) * 2.5)) })
    else if (editing === 'annualMileageKm') onSave({ annualMileageKm: Number(value) })
    else if (editing === 'longTripFrequency') onSave({ longTripFrequency: value })
    else if (editing === 'parkingType') onSave({ parkingType: value })
    else if (editing === 'homeCharging') onSave({ homeCharging: value === 'yes' ? true : value === 'no' ? false : null })
    else if (editing === 'passengerPattern') onSave({ passengerPattern: value.split(/[，,]/).map(item => item.trim()).filter(Boolean) })
    else if (editing === 'usageTypes') onSave({ usageTypes: value.split(/[，,]/).map(item => item.trim()).filter(Boolean) })
    else if (editing === 'vehiclePriorities') onSave({ vehiclePriorities: value.split(/[，,]/).map(item => item.trim()).filter(Boolean) })
    else onSave({ monthlyCarBudget: Number(value) })
  }

  return (
    <div className="profile-editor-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="profile-editor" role="dialog" aria-modal="true" aria-label={title}>
        <header><div><small>MY MOBILITY PASSPORT</small><h2>{title}</h2></div><button onClick={onClose} aria-label="关闭"><X /></button></header>
        <EditorControl editing={editing} value={value} onChange={setValue} />
        <p>保存后将写入 Mobility Profile，并立即触发 Buy Agent 重新计算。</p>
        <footer><button onClick={onClose}>取消</button><button className="primary" onClick={save}>保存并重新计算</button></footer>
      </section>
    </div>
  )
}

function EditorControl({ editing, value, onChange }: { editing: EditableKey; value: string; onChange: (value: string) => void }) {
  if (editing === 'homeCharging') return <select value={value} onChange={event => onChange(event.target.value)}><option value="yes">有固定家充</option><option value="no">无固定家充</option><option value="unknown">尚未确认</option></select>
  if (editing === 'longTripFrequency') return <select value={value} onChange={event => onChange(event.target.value)}><option>每周 1 次</option><option>每月 1–2 次</option><option>每季度 1 次</option><option>几乎不跑长途</option></select>
  if (editing === 'parkingType') return <select value={value} onChange={event => onChange(event.target.value)}><option>小区固定车位</option><option>固定车位</option><option>路边停车为主</option><option>无固定车位</option></select>
  const numeric = ['purchaseBudget', 'monthlyIncome', 'dailyCommuteKm', 'annualMileageKm', 'assistance'].includes(editing)
  return <input autoFocus type={numeric ? 'number' : 'text'} value={value} onChange={event => onChange(event.target.value)} />
}

const editorTitle: Record<EditableKey, string> = {
  city: '你主要在哪座城市用车？', purchaseBudget: '理想购车预算是多少？', monthlyIncome: '每月希望如何控制汽车支出？', dailyCommuteKm: '日常单程通勤多远？',
  annualMileageKm: '预计每年行驶多少公里？', longTripFrequency: '多久会有一次长途？', parkingType: '平时在哪里停车？', homeCharging: '是否有固定家充？',
  passengerPattern: '通常和谁一起用车？', usageTypes: '主要用车目的是什么？', vehiclePriorities: '选车最看重什么？', assistance: '每月汽车支出上限是多少？',
}

function valueFor(key: EditableKey, profile: MobilityProfile) {
  if (key === 'city') return profile.city
  if (key === 'purchaseBudget') return String(Math.round((profile.idealBudget ?? 250000) / 10000))
  if (key === 'monthlyIncome') return String(profile.monthlyIncome ?? 25000)
  if (key === 'dailyCommuteKm') return String(profile.dailyCommuteKm)
  if (key === 'annualMileageKm') return String(profile.annualMileageKm)
  if (key === 'longTripFrequency') return profile.longTripFrequency
  if (key === 'parkingType') return profile.parkingType
  if (key === 'homeCharging') return profile.homeCharging ? 'yes' : profile.homeCharging === false ? 'no' : 'unknown'
  if (key === 'passengerPattern') return profile.passengerPattern.join('，')
  if (key === 'usageTypes') return profile.usageTypes.join('，')
  if (key === 'vehiclePriorities') return profile.vehiclePriorities.join('，')
  return String(profile.monthlyCarBudget ?? 5000)
}

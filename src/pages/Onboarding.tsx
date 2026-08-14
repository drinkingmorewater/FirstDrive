import { ArrowLeft, ArrowRight, Check, Gauge, HeartHandshake, Map, Route, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'
import type { FamiliarityKey, FamiliarityProfile, MobilityProfile } from '../types'

type Draft = { mobility: MobilityProfile; familiarity: FamiliarityProfile }
type Question = { section: string; title: string; help: string; options: Array<{ label: string; value: string }>; apply: (draft: Draft, value: string) => Draft }

const sections = ['现在怎么开车', '平时怎么出行', '和谁一起用车', '路况经验', '希望先准备', '汽车偏好', '辅助方式']

const mobility = (draft: Draft, patch: Partial<MobilityProfile>): Draft => ({ ...draft, mobility: { ...draft.mobility, ...patch } })
const familiar = (draft: Draft, patch: Partial<Record<FamiliarityKey, FamiliarityProfile[FamiliarityKey]>>): Draft => ({ ...draft, familiarity: { ...draft.familiarity, ...patch } })

const questions: Question[] = [
  { section: sections[0], title: '驾照拿了多久？', help: '驾龄不代表熟悉程度，后面会逐场景了解。', options: [{ label: '不到 1 年', value: '0' }, { label: '1–3 年', value: '2' }, { label: '4–8 年', value: '6' }, { label: '8 年以上', value: '12' }], apply: (draft, value) => mobility(draft, { licenseYears: Number(value) }) },
  { section: sections[0], title: '过去一年，你实际开车多频繁？', help: '这比拿证多久更能帮助 FirstDrive 理解你。', options: ['几乎每天', '每周 3–4 次', '每月几次', '一年只开几次'].map(value => ({ label: value, value })), apply: (draft, value) => mobility(draft, { drivingFrequency: value, actualDrivingYears: value === '一年只开几次' ? 1 : Math.max(1, Math.min(draft.mobility.licenseYears, 4)) }) },
  { section: sections[1], title: '日常单程通勤大约多远？', help: '用于判断能源、成本与车辆尺寸。', options: [{ label: '10 km 以内', value: '8' }, { label: '10–20 km', value: '18' }, { label: '20–40 km', value: '30' }, { label: '40 km 以上', value: '50' }], apply: (draft, value) => mobility(draft, { dailyCommuteKm: Number(value), commuteMinutes: Math.round(Number(value) * 2.4) }) },
  { section: sections[1], title: '预计一年会开多少公里？', help: '这个数字会直接进入 True Cost。', options: [{ label: '约 6,000 km', value: '6000' }, { label: '约 12,000 km', value: '12000' }, { label: '约 18,000 km', value: '18000' }, { label: '25,000 km 以上', value: '26000' }], apply: (draft, value) => mobility(draft, { annualMileageKm: Number(value) }) },
  { section: sections[2], title: '通常和谁一起用车？', help: '先选择最常见的一种结构，稍后可以修改。', options: [{ label: '主要一个人', value: '' }, { label: '伴侣', value: '伴侣' }, { label: '伴侣和儿童', value: '伴侣,1 名儿童' }, { label: '父母或多人共享', value: '父母,家庭多人' }], apply: (draft, value) => mobility(draft, { passengerPattern: value ? value.split(',') : [] }) },
  { section: sections[2], title: '汽车主要为哪些生活服务？', help: '场景会影响 Life Fit 排序。', options: [{ label: '日常通勤', value: '日常通勤' }, { label: '通勤 + 家庭', value: '日常通勤,家庭出行' }, { label: '周末自驾 + 长途', value: '周末自驾,长途旅行' }, { label: '露营和户外', value: '长途旅行,露营' }], apply: (draft, value) => mobility(draft, { usageTypes: value.split(',') }) },
  { section: sections[3], title: '普通城市道路，你现在是什么状态？', help: '没有“总驾驶能力分”，只记录真实场景。', options: [{ label: '还没有经历', value: 'unexperienced' }, { label: '希望先准备', value: 'want_to_prepare' }, { label: '有人陪同完成', value: 'accompanied' }, { label: '已经熟悉', value: 'familiar' }], apply: (draft, value) => familiar(draft, { cityRoad: value as FamiliarityProfile['cityRoad'] }) },
  { section: sections[3], title: '高架或高速，你有怎样的经验？', help: '这会直接影响路线难度与提醒提前量。', options: [{ label: '从未独立完成', value: 'unexperienced' }, { label: '想先预演一次', value: 'want_to_prepare' }, { label: '有人陪同完成', value: 'accompanied' }, { label: '可以独立完成', value: 'completed_independently' }], apply: (draft, value) => familiar(draft, { elevatedRoad: value as FamiliarityProfile['elevatedRoad'], highway: value as FamiliarityProfile['highway'] }) },
  { section: sections[4], title: '下一次最想先准备哪个场景？', help: 'First-Time Center 会据此生成行动计划。', options: [{ label: '高架入口', value: 'elevatedRoad' }, { label: '高速汇入', value: 'highwayMerge' }, { label: '夜间驾驶', value: 'nightDriving' }, { label: '雨天驾驶', value: 'rainDriving' }], apply: (draft, value) => familiar(draft, { [value]: 'want_to_prepare' }) },
  { section: sections[4], title: '你最希望在哪件事上获得更多准备？', help: '不会判断能力，只决定 Assistant Style。', options: [{ label: '复杂立交', value: 'complexLaneChange' }, { label: '停车', value: 'parking' }, { label: '陌生车', value: 'charging' }, { label: '长时间驾驶', value: 'highway' }], apply: (draft, value) => familiar(draft, { [value]: 'want_to_prepare' }) },
  { section: sections[5], title: '选车时最看重什么？', help: '这些偏好会成为 Buy Agent 的排序依据。', options: [{ label: '安全与容易驾驶', value: '安全,容易驾驶,维修成本' }, { label: '舒适与空间', value: '舒适,空间,安全' }, { label: '智能化与驾驶感', value: '智能化,驾驶感,品牌' }, { label: '能耗与总成本', value: '能耗,总拥有成本,保值' }], apply: (draft, value) => mobility(draft, { vehiclePriorities: value.split(',') }) },
  { section: sections[5], title: '你有固定车位和家充吗？', help: '如果没有家充，纯电推荐会降低，但不会被直接排除。', options: [{ label: '固定车位 + 家充', value: 'yes' }, { label: '固定车位，无家充', value: 'parking' }, { label: '没有固定车位', value: 'no' }, { label: '暂时不确定', value: 'unknown' }], apply: (draft, value) => mobility(draft, { parkingType: value === 'yes' || value === 'parking' ? '小区固定车位' : value === 'no' ? '无固定车位' : '尚未确认', homeCharging: value === 'yes' ? true : value === 'unknown' ? null : false }) },
  { section: sections[6], title: '希望 FirstDrive 怎么帮助？', help: '这个选择会影响所有 Agent 的输出密度。', options: [{ label: '简洁 · 只提醒重要风险', value: 'quiet' }, { label: '平衡 · 提前提醒陌生节点', value: 'balanced' }, { label: '引导 · 出发前详细预演', value: 'guided' }], apply: (draft, value) => mobility(draft, { assistancePreference: { ...draft.mobility.assistancePreference, level: value as MobilityProfile['assistancePreference']['level'], advanceNoticeMinutes: value === 'guided' ? 8 : value === 'balanced' ? 5 : 3 } }) },
  { section: sections[6], title: '你愿意在驾驶中使用语音吗？', help: '关闭后仍可使用屏幕上的关键提醒。', options: [{ label: '开启语音助手', value: 'yes' }, { label: '仅在我主动询问时', value: 'ask' }, { label: '暂时关闭', value: 'no' }], apply: (draft, value) => mobility(draft, { assistancePreference: { ...draft.mobility.assistancePreference, voiceEnabled: value !== 'no' } }) },
]

const sectionIcons = [Route, Map, UsersRound, Gauge, ShieldCheck, HeartHandshake, Sparkles]

export function Onboarding() {
  const navigate = useNavigate()
  const { state, patchMobility, updateFamiliarity, setOnboardingStatus } = useAppState()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>(() => {
    try { return JSON.parse(localStorage.getItem('firstdrive-onboarding-draft') ?? '') as Draft } catch { return { mobility: structuredClone(state.user.mobility), familiarity: structuredClone(state.familiarity) } }
  })
  const question = questions[step]
  const sectionIndex = sections.indexOf(question.section)
  const Icon = sectionIcons[sectionIndex]
  const answeredSections = useMemo(() => new Set(questions.slice(0, step).map(item => item.section)), [step])

  useEffect(() => { localStorage.setItem('firstdrive-onboarding-draft', JSON.stringify(draft)) }, [draft])

  const finish = (next: Draft) => {
    patchMobility(next.mobility)
    ;(Object.keys(next.familiarity) as FamiliarityKey[]).forEach(key => updateFamiliarity(key, next.familiarity[key]))
    setOnboardingStatus('completed')
    localStorage.removeItem('firstdrive-onboarding-draft')
    navigate('/me/passport')
  }

  const choose = (value: string) => {
    const next = question.apply(draft, value)
    if (step === questions.length - 1) finish(next)
    else { setDraft(next); setStep(current => current + 1) }
  }

  return <AppShell compact><div className="adaptive-onboarding page-frame narrow-frame">
    <header><button onClick={() => step ? setStep(current => current - 1) : navigate('/')}><ArrowLeft />返回</button><span>MY MOBILITY PASSPORT · {step + 1} / {questions.length}</span><button onClick={() => step === questions.length - 1 ? finish(draft) : setStep(current => current + 1)}>稍后回答</button></header>
    <div className="section-progress">{sections.map((section, index) => <span key={section} className={index === sectionIndex ? 'active' : answeredSections.has(section) ? 'done' : ''}>{answeredSections.has(section) && index !== sectionIndex ? <Check /> : index + 1}<small>{section}</small></span>)}</div>
    <main><Icon /><span>{question.section}</span><h1>{question.title}</h1><p>{question.help}</p><div>{question.options.map(option => <button key={option.value} onClick={() => choose(option.value)}><span>{option.label}</span><ArrowRight /></button>)}</div></main>
  </div></AppShell>
}

import type { FamiliarityKey, FamiliarityStatus, ProfileDraft, ProfileEvidence } from '../types'

const YEAR_RE = /(?:驾照|拿证|考证)[^，。；]{0,8}?(\d{1,2}|十几|十多|十)年/
const CITY_RE = /(上海|北京|广州|深圳|杭州|成都|南京|苏州|柏林|慕尼黑|德国)/

const asYears = (value?: string) => {
  if (!value) return undefined
  if (value === '十') return 10
  if (value === '十多' || value === '十几') return 12
  return Number(value)
}

const evidence = (id: string, label: string, value: string, state: ProfileEvidence['state'], quote?: string): ProfileEvidence => ({ id, label, value, state, quote })

export function extractProfileDraft(transcript: string): ProfileDraft {
  const normalized = transcript.trim().replace(/\s+/g, '')
  const yearMatch = normalized.match(YEAR_RE)
  const years = asYears(yearMatch?.[1])
  const city = normalized.match(CITY_RE)?.[1]
  const lowFrequency = /很少开|开得少|不常开|一年.*几次|偶尔开/.test(normalized)
  const cityOkay = /普通(?:市区|道路).*还行|市区.*还行|城市道路.*(?:可以|没问题|还行)/.test(normalized)
  const elevatedConcern = /怕.*高架|高架.*怕|不敢.*高架|高架.*紧张|没上过高架/.test(normalized)
  const highwayConcern = /怕.*高速|高速.*怕|不敢.*高速|第一次.*高速|没上过高速/.test(normalized)
  const complexConcern = /复杂.*(?:路|立交|变道)|立交.*怕|变道.*紧张/.test(normalized)
  const buying = /买车|第一辆车|预算.*万/.test(normalized)
  const abroad = /德国|国外|租车自驾|海外自驾/.test(normalized)
  const family = /家里人|父母|孩子|家庭|伴侣/.test(normalized)
  const mostlySelf = /自己开|一个人开|平时就是自己/.test(normalized)
  const noCar = /没有车|暂无.*车|还没买车|准备买车/.test(normalized)
  const ev = /新能源|纯电|电车/.test(normalized)
  const fuel = /纯油|燃油车|油车/.test(normalized)
  const budgetMatch = normalized.match(/预算[^\d]{0,4}(\d{1,3})万/)

  const familiarity: Partial<Record<FamiliarityKey, FamiliarityStatus>> = {}
  if (cityOkay) familiarity.cityRoad = 'completed_independently'
  if (elevatedConcern) familiarity.elevatedRoad = 'want_to_prepare'
  if (highwayConcern) familiarity.highway = 'want_to_prepare'
  if (complexConcern) familiarity.complexLaneChange = 'want_to_prepare'

  const facts: ProfileEvidence[] = []
  if (years !== undefined) facts.push(evidence('license', '驾照年限', `${years} 年`, 'confirmed', yearMatch?.[0]))
  else facts.push(evidence('license', '驾照年限', '待确认', 'need_to_confirm'))
  if (lowFrequency) facts.push(evidence('frequency', '实际驾驶', '频率较低', 'confirmed', '平时很少开'))
  else facts.push(evidence('frequency', '实际驾驶', '偶尔驾驶', 'inferred'))
  if (cityOkay) facts.push(evidence('city-road', '城市道路', '可以独立完成', 'confirmed'))
  if (elevatedConcern) facts.push(evidence('elevated', '高架', '希望先准备', 'confirmed'))
  if (highwayConcern) facts.push(evidence('highway', '高速', '希望先准备', 'confirmed'))
  if (complexConcern) facts.push(evidence('complex', '复杂道路', '容易紧张', 'confirmed'))
  if (family) facts.push(evidence('passenger', '同行者', '偶尔带家人', 'confirmed'))
  if (mostlySelf) facts.push(evidence('self', '日常乘员', '主要自己', 'confirmed'))
  if (noCar) facts.push(evidence('vehicle', '当前车辆', '暂无个人车辆', 'confirmed'))
  else facts.push(evidence('vehicle', '当前车辆', ev ? '新能源车' : fuel ? '燃油车' : '待确认', ev || fuel ? 'confirmed' : 'need_to_confirm'))
  if (city) facts.push(evidence('city', '常驻环境', city === '德国' ? '德国 / 海外需求' : city, 'confirmed'))
  else facts.push(evidence('city', '常驻城市', '待确认', 'need_to_confirm'))
  if (abroad) facts.push(evidence('abroad', '境外驾驶', '有近期需求', 'confirmed'))
  if (buying) facts.push(evidence('buy', '汽车阶段', '正在准备买车', 'confirmed'))

  const questions: string[] = []
  if (!city) questions.push('你通常在哪座城市开车？')
  if (!family && !mostlySelf) questions.push('你通常自己开，还是会经常带家人？')
  if (!/夜间|晚上|白天/.test(normalized)) questions.push('你会经常夜间驾驶吗？')
  if (!noCar && !ev && !fuel) questions.push('你现在有固定使用的车辆吗？')

  const nextFirst: FamiliarityKey = elevatedConcern ? 'elevatedRoad' : highwayConcern ? 'highway' : complexConcern ? 'complexLaneChange' : abroad ? 'cityRoad' : 'nightDriving'
  const learned = [
    lowFrequency ? '需要按真实驾驶频率判断，而不是只看驾照年限' : '已有持续驾驶经验',
    elevatedConcern || highwayConcern || complexConcern ? '陌生复杂道路需要提前预演' : '更适合轻量提醒',
    family ? '决策需要兼顾家人乘坐' : mostlySelf ? '主要围绕单人出行优化' : '乘员模式仍需确认',
  ]

  return {
    transcript,
    mobility: {
      ...(years !== undefined ? { licenseYears: years, actualDrivingYears: lowFrequency ? Math.min(1, years) : Math.max(1, Math.round(years * .6)) } : {}),
      ...(city ? { city: city === '德国' ? '柏林' : city } : {}),
      ...(lowFrequency ? { drivingFrequency: '一年只开几次' } : {}),
      ...(budgetMatch ? { purchaseBudget: Number(budgetMatch[1]) * 10000, idealBudget: Number(budgetMatch[1]) * 10000 } : {}),
      ...(ev ? { usageTypes: ['新能源用车'] } : {}),
      ...(family || mostlySelf ? { passengerPattern: [mostlySelf ? '主要自己' : '', family ? '偶尔带家人' : ''].filter(Boolean) } : {}),
      assistancePreference: { level: elevatedConcern || highwayConcern || complexConcern ? 'guided' : 'balanced', advanceNoticeMinutes: elevatedConcern || highwayConcern ? 8 : 5, voiceEnabled: true },
    },
    familiarity,
    passengerPattern: [mostlySelf ? '主要自己' : '', family ? '偶尔带家人' : ''].filter(Boolean),
    evidence: facts,
    learned,
    questions: questions.slice(0, 2),
    nextFirst,
    createdAt: new Date().toISOString(),
  }
}

export function getNextProfileQuestion(draft: ProfileDraft, answers: Record<string, string>) {
  return draft.questions.find(question => !answers[question]) ?? null
}

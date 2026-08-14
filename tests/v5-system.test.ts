import assert from 'node:assert/strict'
import { createTaskGraph, extractProfileDraft } from '../src/agents'
import { createDemoState, vehicles } from '../src/data/demo'
import { recommendRoute, rankVehicles } from '../src/lib/engine'
import { generateRoadTripPlan } from '../src/lib/roadtrip'
import { updateFamiliarityAfterJourney } from '../src/lib/agents'
import { routeVoiceIntent } from '../src/voice/VoiceController'

const test = async (name: string, run: () => void | Promise<void>) => { await run(); console.log(`✓ ${name}`) }

await test('v5 state survives serialization with first-run and split memory', () => {
  const state = createDemoState('buyer')
  const restored = JSON.parse(JSON.stringify(state)) as typeof state
  assert.equal(restored.version, 5)
  assert.equal(restored.onboardingStatus, 'new')
  assert.deepEqual(restored.memory.rental.sessions, [])
  assert.deepEqual(restored.memory.journey.roadTripPlans, [])
})

await test('natural language intake creates evidence-aware profile draft', () => {
  const draft = extractProfileDraft('我驾照拿了十多年，但是平时很少开。普通市区还行，高架有点怕。平时主要自己开，偶尔带家里人。')
  assert.equal(draft.mobility.licenseYears, 12)
  assert.equal(draft.mobility.drivingFrequency, '一年只开几次')
  assert.equal(draft.familiarity.cityRoad, 'completed_independently')
  assert.equal(draft.familiarity.elevatedRoad, 'want_to_prepare')
  assert.equal(draft.nextFirst, 'elevatedRoad')
  assert.ok(draft.evidence.some(item => item.state === 'confirmed'))
})

await test('adaptive intake skips vehicle follow-up when user says no car', () => {
  const draft = extractProfileDraft('我还没有车，马上毕业，准备买人生第一辆车，预算二十万。平时在上海。')
  assert.ok(!draft.questions.some(question => question.includes('固定使用的车辆')))
  assert.equal(draft.evidence.find(item => item.id === 'vehicle')?.state, 'confirmed')
})

await test('task graph contains real dependency-based three-agent handoff', () => {
  const task = createTaskGraph('navigation', '明天自己去医院', createDemoState('practice'))
  assert.deepEqual([...new Set(task.nodes.map(node => node.agent))], ['me', 'ready', 'road'])
  assert.ok(task.nodes.every((node, index) => index === 0 || node.dependencies.length > 0))
  assert.ok(task.nodes.some(node => node.type === 'memory_write'))
})

await test('home charging changes Buy Agent ranking evidence', () => {
  const state = createDemoState('buyer')
  const withCharge = rankVehicles(vehicles, state.user.mobility, state.familiarity, 'commute', state.buySession.assumptions)
  const withoutCharge = rankVehicles(vehicles, { ...state.user.mobility, homeCharging: false }, state.familiarity, 'commute', state.buySession.assumptions)
  assert.ok(withCharge.find(item => item.vehicle.id === 'model3')!.score > withoutCharge.find(item => item.vehicle.id === 'model3')!.score)
  assert.match(withoutCharge.find(item => item.vehicle.id === 'model3')!.friction, /补能/)
})

await test('elevated-road familiarity alone can change route recommendation', () => {
  const before = createDemoState('buyer')
  before.familiarity.expressway = 'familiar'
  before.familiarity.elevatedRoad = 'unexperienced'
  const beforeRoute = recommendRoute(before.journey.routeOptions, before)
  const after = structuredClone(before)
  after.familiarity.elevatedRoad = 'familiar'
  const afterRoute = recommendRoute(after.journey.routeOptions, after)
  assert.equal(beforeRoute.id, 'B')
  assert.equal(afterRoute.id, 'A')
})

await test('road trip destination changes distance, nodes and plan', () => {
  const base = { origin: '北京', departureDate: '2026-08-21', vehicle: '极氪 007 新能源', passengers: 2, experience: '第一次长途', goal: '拍照', fatiguePreference: '轻松优先' }
  const qingdao = generateRoadTripPlan({ ...base, destination: '青岛' })
  const alshan = generateRoadTripPlan({ ...base, destination: '阿尔山' })
  assert.notEqual(qingdao.totalDistance, alshan.totalDistance)
  assert.notEqual(qingdao.days.length, alshan.days.length)
  assert.ok(qingdao.days.some(day => day.title.includes('青岛')))
  assert.ok(alshan.days.some(day => day.title.includes('阿尔山')))
})

await test('journey completion still updates familiarity and memory', () => {
  const after = updateFamiliarityAfterJourney(createDemoState('practice'))
  assert.equal(after.familiarity.expressway, 'completed_independently')
  assert.ok(after.memory.completedScenarios.includes('独立陌生路线'))
})

await test('global voice router covers all five agents', () => {
  assert.equal(routeVoiceIntent('我驾照十年但是很少开'), 'profile_intake')
  assert.equal(routeVoiceIntent('预算二十万买车'), 'buy')
  assert.equal(routeVoiceIntent('明天第一次上高速'), 'practice')
  assert.equal(routeVoiceIntent('帮我换一条简单路线'), 'navigation')
  assert.equal(routeVoiceIntent('我爆胎了'), 'help')
})

console.log('FirstDrive v5 system tests passed.')

import assert from 'node:assert/strict'
import { meAgent } from '../src/agents/me-agent'
import { createDemoState, vehicles } from '../src/data/demo'
import { calculateRouteDifficulty, rankVehicles } from '../src/lib/engine'
import { updateFamiliarityAfterJourney } from '../src/lib/agents'
import { findNewEvents } from '../src/live/eventRules'
import { routeVoiceIntent } from '../src/voice/VoiceController'

const test = async (name: string, run: () => void | Promise<void>) => {
  await run()
  console.log(`✓ ${name}`)
}

await test('Know Me profile survives serialization', () => {
  const state = createDemoState('buyer')
  const restored = JSON.parse(JSON.stringify(state)) as typeof state
  assert.equal(restored.user.mobility.dailyCommuteKm, 18)
  assert.equal(restored.user.mobility.homeCharging, true)
  assert.equal(restored.version, 4)
})

await test('Me Agent personalizes from Profile and Familiarity', async () => {
  const emitted: string[] = []
  const practice = await meAgent.execute({ state: createDemoState('practice'), emit: event => emitted.push(event.detail) })
  const roadtrip = await meAgent.execute({ state: createDemoState('roadtrip'), emit: event => emitted.push(event.detail) })
  assert.equal(practice.data.assistanceLevel, 'guided')
  assert.equal(roadtrip.data.assistanceLevel, 'balanced')
  assert.notEqual(practice.data.summary, roadtrip.data.summary)
})

await test('Buy recommendation changes when charging context changes', () => {
  const state = createDemoState('buyer')
  const withCharge = rankVehicles(vehicles, state.user.mobility, state.familiarity, 'commute', state.buySession.assumptions)
  const withoutCharge = rankVehicles(vehicles, { ...state.user.mobility, homeCharging: false }, state.familiarity, 'commute', state.buySession.assumptions)
  const evWith = withCharge.find(item => item.vehicle.id === 'model3')!
  const evWithout = withoutCharge.find(item => item.vehicle.id === 'model3')!
  assert.ok(evWith.score > evWithout.score)
  assert.match(evWithout.friction, /补能/)
})

await test('Route difficulty changes with Familiarity', () => {
  const state = createDemoState('practice')
  const route = state.journey.routeOptions[0]
  const unfamiliar = calculateRouteDifficulty(route, state.familiarity, '小雨')
  const familiar = calculateRouteDifficulty(route, { ...state.familiarity, expressway: 'familiar', rainDriving: 'familiar', nightDriving: 'familiar' }, '晴')
  assert.ok(unfamiliar > familiar)
})

await test('Journey completion updates Familiarity and Memory', () => {
  const before = createDemoState('practice')
  const after = updateFamiliarityAfterJourney(before)
  assert.equal(after.familiarity.expressway, 'completed_independently')
  assert.ok(after.memory.completedScenarios.includes('独立陌生路线'))
  assert.equal(after.journey.completionStatus, 'completed')
})

await test('Incident record remains serializable in Incident Memory', () => {
  const state = createDemoState('buyer')
  state.memory.incident.records.push({ id: 'incident-test', time: '2026-08-14T10:00:00Z', location: '上海', photos: [], peopleSafe: true, otherPartyInfo: '已记录', description: '低速接触', insuranceChecklist: ['现场照片'], status: 'ready' })
  const restored = JSON.parse(JSON.stringify(state)) as typeof state
  assert.equal(restored.memory.incident.records[0].status, 'ready')
})

await test('Voice Intent Router covers core intents', () => {
  assert.equal(routeVoiceIntent('帮我换一条简单一点的路线'), 'navigation')
  assert.equal(routeVoiceIntent('前面会下雨吗'), 'weather')
  assert.equal(routeVoiceIntent('还有多久要充电'), 'energy')
  assert.equal(routeVoiceIntent('我想休息一下'), 'rest')
  assert.equal(routeVoiceIntent('胎压应该是多少'), 'vehicle')
  assert.equal(routeVoiceIntent('发生事故了'), 'help')
})

await test('Live event engine emits crossed proactive events', () => {
  const state = createDemoState('buyer')
  const events = findNewEvents(30, { ...state.liveContext, progress: 43 })
  assert.deepEqual(events.map(event => event.id), ['weather-change', 'complex-road'])
})

console.log('FirstDrive v4 dependency tests passed.')

import type { RoadTripDay, RoadTripPlan } from '../types'

type RoadTripInput = Omit<RoadTripPlan, 'id' | 'totalDistance' | 'days' | 'chargingStops' | 'restStops' | 'weather' | 'packing' | 'risks' | 'createdAt'>

const routes: Record<string, { distance: number; via: string[]; weather: string }> = {
  '北京-青岛': { distance: 660, via: ['天津南', '德州', '潍坊'], weather: '沿途多云，抵达前有短时小雨' },
  '北京-阿尔山': { distance: 1420, via: ['承德', '赤峰', '霍林郭勒'], weather: '第二天下午可能降雨，夜间温差较大' },
  '上海-杭州': { distance: 178, via: ['枫泾', '嘉兴'], weather: '午后局部阵雨' },
  '上海-南京': { distance: 305, via: ['昆山', '无锡', '镇江'], weather: '晴到多云' },
  '柏林-汉堡': { distance: 289, via: ['Neuruppin', 'Ludwigslust'], weather: '多云，侧风中等' },
  '柏林-慕尼黑': { distance: 585, via: ['Leipzig', 'Nürnberg'], weather: '南段可能有阵雨' },
}

const hash = (value: string) => [...value].reduce((total, char) => total + char.charCodeAt(0), 0)

function routeMeta(origin: string, destination: string) {
  const exact = routes[`${origin}-${destination}`]
  if (exact) return exact
  const distance = 320 + hash(`${origin}-${destination}`) % 760
  return { distance, via: [`${origin}东服务区`, `${destination}方向中途节点`, `${destination}西服务区`], weather: hash(destination) % 2 ? '多云，局部路段可能有小雨' : '晴间多云，早晚温差明显' }
}

export function generateRoadTripPlan(input: RoadTripInput): RoadTripPlan {
  const meta = routeMeta(input.origin.trim(), input.destination.trim())
  const maxDaily = input.fatiguePreference === '轻松优先' ? 520 : input.experience === '第一次长途' ? 600 : 720
  const dayCount = Math.max(1, Math.ceil(meta.distance / maxDaily))
  const energyInterval = /新能源|纯电|Model|极氪|理想/.test(input.vehicle) ? 260 : 520
  const chargingStops = Math.max(0, Math.ceil(meta.distance / energyInterval) - 1)
  const restInterval = input.fatiguePreference === '轻松优先' ? 150 : 190
  const restStops = Math.max(1, Math.ceil(meta.distance / restInterval) - 1)
  const days: RoadTripDay[] = Array.from({ length: dayCount }, (_, index) => {
    const remaining = meta.distance - Math.round(meta.distance / dayCount) * index
    const distance = index === dayCount - 1 ? remaining : Math.round(meta.distance / dayCount)
    const start = index === 0 ? input.origin : meta.via[Math.min(index - 1, meta.via.length - 1)]
    const end = index === dayCount - 1 ? input.destination : meta.via[Math.min(index, meta.via.length - 1)]
    const via = meta.via[(index + 1) % meta.via.length]
    return {
      day: index + 1,
      distance,
      title: `${start} → ${end}`,
      stops: [
        { time: '08:30', place: start, action: `出发 · ${input.vehicle}` },
        { time: '10:40', place: via, action: /新能源|纯电|Model|极氪|理想/.test(input.vehicle) ? '休息并补能 30 分钟' : '休息 20 分钟，检查油量' },
        { time: '13:00', place: `${end}方向服务区`, action: '午餐与步行 45 分钟' },
        { time: dayCount === 1 ? '16:20' : '17:30', place: end, action: index === dayCount - 1 ? `抵达 · ${input.goal}` : '入住并结束当天驾驶' },
      ],
    }
  })
  return {
    ...input,
    id: `roadtrip-${Date.now()}`,
    totalDistance: meta.distance,
    days,
    chargingStops,
    restStops,
    weather: meta.weather,
    packing: /拍|星空|摄影/.test(input.goal) ? ['充电线 / 加油卡', '三脚架与备用电池', '饮水与简餐', '保暖外套', '反光背心'] : ['充电线 / 加油卡', '证件与保险', '饮水与简餐', '常用药', '反光背心'],
    risks: [input.experience === '第一次长途' ? '连续驾驶不超过 2 小时' : '每 2.5 小时安排一次休息', meta.weather, input.passengers > 2 ? '乘员较多，出发前确认行李不遮挡后窗' : '出发前确认胎压与玻璃水'],
    createdAt: new Date().toISOString(),
  }
}

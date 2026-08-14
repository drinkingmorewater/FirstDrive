import type { LiveDriveContext, ProactiveEvent } from '../types'

const rules: ProactiveEvent[] = [
  { id: 'unfamiliar-segment', type: 'unfamiliar_segment', title: '前方是你尚未独立完成的高架', detail: '我会在 2 公里和 500 米处分别提醒。', severity: 'info', atProgress: 14 },
  { id: 'weather-change', type: 'weather_change', title: '前方强降雨，正在重新评估路线', detail: 'Road Agent 正在同时评估能见度、复杂立交与熟悉度。', severity: 'warning', atProgress: 35 },
  { id: 'complex-road', type: 'complex_road_ahead', title: '8 公里后复杂立交', detail: '新路线将避开强降雨区域内的连续分流。', severity: 'warning', atProgress: 42 },
  { id: 'service-area', type: 'service_area_ahead', title: '沿途服务区可用', detail: '中环加油站 6.8 公里，当前无需停靠。', severity: 'info', atProgress: 58 },
  { id: 'arrival', type: 'destination_arrival', title: '已到达浦东嘉里医院', detail: '快速路与高架已独立完成，熟悉度正在更新。', severity: 'info', atProgress: 100 },
]

export const findNewEvents = (previousProgress: number, next: LiveDriveContext) =>
  rules.filter(rule => rule.atProgress > previousProgress && rule.atProgress <= next.progress)

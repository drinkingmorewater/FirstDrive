import { CarFront } from 'lucide-react'
import type { RehearsalPoint } from '../types'

export function RehearsalDiagram({ point }: { point: RehearsalPoint }) {
  return (
    <div className={`rehearsal-diagram rehearsal-${point.kind}`}>
      <svg viewBox="0 0 700 560" role="img" aria-label={`${point.title}简化道路示意图`}>
        <path className="diagram-road road-main" d="M180 560 C180 420 190 320 190 0" />
        <path className="diagram-road road-secondary" d={point.kind === 'merge' ? 'M530 560 C520 380 380 250 220 210' : point.kind === 'split' ? 'M190 330 C340 310 470 190 535 0' : 'M190 250 C340 250 470 340 700 340'} />
        <path className="diagram-center" d="M190 560 C190 420 200 320 200 0" />
        <path className="diagram-prep" d={point.kind === 'merge' ? 'M500 520 C490 380 360 270 225 225' : point.kind === 'split' ? 'M215 325 C350 300 450 205 510 35' : 'M215 265 C350 265 465 350 665 350'} />
        <circle cx={point.kind === 'parking' ? 520 : 200} cy={point.kind === 'parking' ? 345 : 430} r="18" className="diagram-car-dot" />
      </svg>
      <div className="diagram-car"><CarFront size={28} /></div>
      <div className="diagram-chip">准备区 500 m</div>
      <div className="diagram-legend"><span><i className="legend-arrow" />行驶方向</span><span><i className="legend-dash" />提前准备区</span></div>
    </div>
  )
}

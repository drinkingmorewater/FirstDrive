export function MobilityMap({ progress = 0, dark = false, compact = false }: { progress?: number; dark?: boolean; compact?: boolean }) {
  const p = Math.min(100, progress)
  const x = p < 32 ? 80 + p * 4.9 : p < 66 ? 238 + (p - 32) * 5.35 : 420 + (p - 66) * 5.3
  const y = 382 - p * 3.05
  return (
    <div className={'mobility-map ' + (dark ? 'dark ' : '') + (compact ? 'compact' : '')} aria-label="路线示意图">
      <svg viewBox="0 0 680 460" role="img" aria-label="从家到浦东嘉里医院的路线">
        <g className="map-grid">
          <path d="M-30 90 C120 35 220 145 360 95 S610 70 730 10" />
          <path d="M-20 280 C130 230 250 345 390 286 S580 210 720 260" />
          <path d="M125 -20 C180 110 80 205 155 300 S260 390 245 490" />
          <path d="M470 -30 C420 100 540 210 480 330 S430 410 510 490" />
          <path d="M20 390 650 130" /><path d="M40 150 650 400" />
        </g>
        <path className="route-halo" d="M80 382 C162 340 146 262 238 244 S335 156 420 178 S522 116 600 72" />
        <path className="route-line" d="M80 382 C162 340 146 262 238 244 S335 156 420 178 S522 116 600 72" />
        <circle className="map-node start" cx="80" cy="382" r="12" />
        <circle className="map-node" cx="238" cy="244" r="9" />
        <circle className="map-node" cx="420" cy="178" r="9" />
        <circle className="map-node end" cx="600" cy="72" r="13" />
        {progress > 0 ? <><circle className="map-car-halo" cx={x} cy={y} r="22" /><circle className="map-car" cx={x} cy={y} r="7" /></> : null}
      </svg>
      <span className="map-label label-home">家</span>
      <span className="map-label label-road">快速路</span>
      <span className="map-label label-junction">高架分流</span>
      <span className="map-label label-destination">医院</span>
    </div>
  )
}

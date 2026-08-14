import { MapPin, Navigation } from 'lucide-react'

export function RouteMap({ selected = 'B', compact = false }: { selected?: 'A' | 'B'; compact?: boolean }) {
  return (
    <div className={`route-map ${compact ? 'route-map-compact' : ''}`} aria-label="演示路线地图">
      <svg viewBox="0 0 900 540" role="img" aria-label="从家到医院的路线 A 与路线 B">
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#e9ece9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="900" height="540" fill="url(#grid)" />
        <path className="map-river" d="M40 420 C160 360 220 460 330 400 S530 350 620 420 S760 460 900 360" />
        <path className="route-a" d="M90 430 C180 420 220 340 300 330 S390 250 470 235 S580 170 655 160 S760 110 815 85" />
        <path className={`route-b ${selected === 'B' ? 'active' : ''}`} d="M90 430 C190 450 225 365 305 360 S410 392 475 310 S575 325 650 275 S720 210 740 150 S785 110 815 85" />
        <path className="route-familiar" d="M90 430 C190 450 225 365 305 360 S410 392 475 310" />
        {[['305','360'],['475','310'],['650','275'],['740','150']].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r="10" className={index < 2 ? 'node familiar' : 'node caution'} />)}
        <circle cx="90" cy="430" r="12" className="node start" />
        <circle cx="815" cy="85" r="15" className="node end" />
      </svg>
      <div className="map-label map-home"><Navigation size={15} /> 我的家</div>
      <div className="map-label map-hospital"><MapPin size={15} /> 医院北门</div>
      {!compact ? (
        <div className="map-legend">
          <span><i className="line line-a" />路线 A</span>
          <span><i className="line line-b" />路线 B</span>
          <span><i className="dot dot-familiar" />熟悉道路</span>
        </div>
      ) : null}
    </div>
  )
}

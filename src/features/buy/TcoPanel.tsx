import { BatteryCharging, CarFront, CircleDollarSign, Clock3, Download, Info, ParkingCircle, ShieldCheck, Wrench } from 'lucide-react'
import { useState } from 'react'
import type { TcoAssumptions, VehicleFitResult } from '../../types'

const categories = [
  { id: 'overview', label: '总览', Icon: CarFront },
  { id: 'purchase', label: '购车', Icon: CarFront },
  { id: 'insurance', label: '保险', Icon: ShieldCheck },
  { id: 'energy', label: '能源', Icon: BatteryCharging },
  { id: 'parking', label: '停车', Icon: ParkingCircle },
  { id: 'maintenance', label: '保养维护', Icon: Wrench },
  { id: 'finance', label: '金融', Icon: CircleDollarSign },
  { id: 'depreciation', label: '折旧', Icon: Clock3 },
] as const

export function TcoPanel({ results, selectedId, editable = false, assumptions, onAssumptions, onExport }: {
  results: VehicleFitResult[]
  selectedId: string
  editable?: boolean
  assumptions: TcoAssumptions
  onAssumptions: (patch: Partial<TcoAssumptions>) => void
  onExport: () => void
}) {
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('overview')
  const selected = results.find(item => item.vehicle.id === selectedId) ?? results[0]
  if (!selected) return null

  const rows = [
    { id: 'purchase', label: '购车（含税费）', source: '用户输入', value: (item: VehicleFitResult) => item.tco.purchase + item.tco.taxRegistration },
    { id: 'insurance', label: '保险（首年 / 年均）', source: 'Demo 估算', value: (item: VehicleFitResult) => item.tco.insurance },
    { id: 'energy', label: '能源（年均）', source: '用户里程', value: (item: VehicleFitResult) => item.tco.energy },
    { id: 'parking', label: '停车（年均）', source: '用户输入', value: (item: VehicleFitResult) => item.tco.parking },
    { id: 'maintenance', label: '保养与耗材（年均）', source: 'Demo 估算', value: (item: VehicleFitResult) => item.tco.maintenance + item.tco.wear },
    { id: 'finance', label: '金融成本（年均）', source: 'Demo 估算', value: (item: VehicleFitResult) => item.tco.finance },
    { id: 'depreciation', label: `${assumptions.ownershipYears} 年折旧`, source: '公开来源占位', value: (item: VehicleFitResult) => item.tco.depreciation },
  ]

  return (
    <section className={`tco-panel ${editable ? 'editable' : ''}`}>
      <header className="tco-titlebar">
        <strong>TCO 详情</strong><span>（以 {assumptions.ownershipYears} 年 / {(assumptions.annualMileageKm * assumptions.ownershipYears).toLocaleString()} km 计）</span><Info />
        {editable ? <div className="tco-assumptions-link">所有假设均可编辑，修改后即时重算</div> : <button onClick={() => setCategory('overview')}>假设与计算口径</button>}
      </header>
      {editable ? <AssumptionEditor assumptions={assumptions} onChange={onAssumptions} /> : null}
      <div className="tco-layout">
        <nav className="tco-categories" aria-label="TCO 成本分类">
          {categories.map(({ id, label, Icon }) => <button key={id} className={category === id ? 'active' : ''} onClick={() => setCategory(id)}><Icon />{label}</button>)}
        </nav>
        <div className="tco-main">
          <div className="tco-metrics">
            <Metric label="首年现金支出" value={selected.tco.firstYearCash} note="年度支出明细总和" />
            <Metric label="月均汽车成本" value={selected.tco.monthlyAverage} note={`TCO / ${assumptions.ownershipYears * 12} 个月`} />
            <Metric label={`${assumptions.ownershipYears} 年 TCO`} value={selected.tco.fiveYearTco} note={`${assumptions.ownershipYears} 年总拥有成本`} />
          </div>
          <div className="tco-table" role="table" aria-label="三款车型成本对比">
            <div className="tco-table-head" role="row"><span />{results.map(item => <span key={item.vehicle.id}><strong>{item.vehicle.brand} {item.vehicle.model}</strong><small>{item.vehicle.trim.split(' ')[2] ?? item.vehicle.trim}</small></span>)}</div>
            {rows.map(row => <div key={row.id} className={`tco-table-row ${category === row.id ? 'highlight' : ''}`} role="row"><span><b>{row.label}</b><small>{row.source}<Info /></small></span>{results.map(item => <span key={item.vehicle.id}>¥ {row.value(item).toLocaleString()}</span>)}</div>)}
            <div className="tco-table-row summary" role="row"><span>首年现金支出</span>{results.map(item => <span key={item.vehicle.id}>¥ {item.tco.firstYearCash.toLocaleString()}</span>)}</div>
            <div className="tco-table-row summary" role="row"><span>月均汽车成本</span>{results.map(item => <span key={item.vehicle.id}>¥ {item.tco.monthlyAverage.toLocaleString()}</span>)}</div>
            <div className="tco-table-row summary" role="row"><span>{assumptions.ownershipYears} 年 TCO</span>{results.map(item => <span key={item.vehicle.id}>¥ {item.tco.fiveYearTco.toLocaleString()}</span>)}</div>
          </div>
        </div>
        <aside className="tco-notes">
          <strong>对比要点</strong>
          <ul>
            <li>{results[0]?.vehicle.model} 在能源与保险上更具优势，当前场景综合适配最高。</li>
            <li>{results[1]?.vehicle.model} 在家庭与长途场景的体验更完整。</li>
            <li>{results[2]?.vehicle.model} 购车门槛更低，整体成本介于两者之间。</li>
          </ul>
          <button onClick={onExport}><Download />导出对比报告</button>
        </aside>
      </div>
    </section>
  )
}

function Metric({ label, value, note }: { label: string; value: number; note: string }) {
  return <article><small>{label}</small><strong>¥ {value.toLocaleString()}</strong><span>{note}</span></article>
}

function AssumptionEditor({ assumptions, onChange }: { assumptions: TcoAssumptions; onChange: (patch: Partial<TcoAssumptions>) => void }) {
  return <div className="assumption-editor">
    <label><span>年行驶里程<em>用户输入</em></span><input type="number" step="1000" min="3000" value={assumptions.annualMileageKm} onChange={event => onChange({ annualMileageKm: Number(event.target.value) })} /><b>km</b></label>
    <label><span>持有年限<em>用户输入</em></span><input type="number" min="1" max="10" value={assumptions.ownershipYears} onChange={event => onChange({ ownershipYears: Number(event.target.value) })} /><b>年</b></label>
    <label><span>每月停车<em>用户输入</em></span><input type="number" step="50" min="0" value={assumptions.parkingMonthly} onChange={event => onChange({ parkingMonthly: Number(event.target.value) })} /><b>元</b></label>
    <label><span>电价<em>Demo 估算</em></span><input type="number" step="0.1" min="0.2" value={assumptions.electricityPrice} onChange={event => onChange({ electricityPrice: Number(event.target.value) })} /><b>元/kWh</b></label>
    <label><span>油价<em>公开来源占位</em></span><input type="number" step="0.1" min="4" value={assumptions.fuelPrice} onChange={event => onChange({ fuelPrice: Number(event.target.value) })} /><b>元/L</b></label>
  </div>
}

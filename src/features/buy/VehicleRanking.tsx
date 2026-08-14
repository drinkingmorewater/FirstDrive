import { CheckCircle2, ChevronRight, CircleDollarSign, Route, UsersRound, CarFront } from 'lucide-react'
import type { VehicleFitResult } from '../../types'

export function VehicleRanking({ results, selectedId, onSelect }: { results: VehicleFitResult[]; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <section className="vehicle-ranking" aria-label="车型适配排名">
      <div className="ranking-header">
        <span>排名</span><span>车型</span><span>Fit Score</span><span>为什么适合</span><span>可能的取舍</span><span>场景匹配</span>
      </div>
      {results.map((result, index) => (
        <button key={result.vehicle.id} className={`ranking-row ${selectedId === result.vehicle.id ? 'selected' : ''}`} onClick={() => onSelect(result.vehicle.id)}>
          <span className="ranking-index"><i />{index + 1}</span>
          <span className="ranking-car">
            <img src={result.vehicle.image} alt={`${result.vehicle.brand} ${result.vehicle.model}`} />
            <span><strong>{result.vehicle.brand} {result.vehicle.model}</strong><small>{result.vehicle.trim}</small><em>{result.vehicle.category}</em><b>¥ {result.vehicle.price.toLocaleString()} 起</b></span>
          </span>
          <span className="ranking-score"><FitScore score={result.score} /><small>{result.score >= 90 ? '非常匹配' : result.score >= 85 ? '很匹配' : '较匹配'}</small></span>
          <span className="ranking-reasons">{result.fit.slice(0, 3).map(item => <span key={item}><CheckCircle2 />{item}</span>)}</span>
          <span className="ranking-tradeoffs">{[...result.tradeoffs, result.friction].slice(0, 3).map(item => <span key={item}><i />{item}</span>)}</span>
          <span className="ranking-scenarios">
            <ScenarioBar icon={<CarFront />} label="日常通勤" value={result.scenarioScores.commute} />
            <ScenarioBar icon={<Route />} label="长途出行" value={result.scenarioScores.roadtrip} />
            <ScenarioBar icon={<UsersRound />} label="家庭出行" value={result.scenarioScores.family} />
            <ScenarioBar icon={<CircleDollarSign />} label="用车成本" value={result.scenarioScores.cost} />
            <ChevronRight className="row-chevron" />
          </span>
        </button>
      ))}
    </section>
  )
}

function FitScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 29
  const offset = circumference * (1 - score / 100)
  return (
    <span className="fit-score" aria-label={`适配分 ${score}`}>
      <svg viewBox="0 0 68 68" aria-hidden="true"><circle cx="34" cy="34" r="29" /><circle className="value" cx="34" cy="34" r="29" strokeDasharray={circumference} strokeDashoffset={offset} /></svg>
      <strong>{score}</strong><em>/100</em>
    </span>
  )
}

function ScenarioBar({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <span className="scenario-bar"><i>{icon}</i><small>{label}</small><b><em style={{ width: `${value}%` }} /></b><strong>{value}%</strong></span>
}

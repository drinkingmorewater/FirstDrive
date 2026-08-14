import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function RecommendedNextAction({ title, detail, to }: { title: string; detail: string; to: string }) {
  return <aside className="recommended-next"><small>RECOMMENDED NEXT ACTION</small><div><strong>{title}</strong><p>{detail}</p></div><Link to={to}>开始 <ArrowRight /></Link></aside>
}

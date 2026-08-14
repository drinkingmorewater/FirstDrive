import { statusMeta } from '../data/demo'
import type { FamiliarityStatus } from '../types'

export function StatusDot({ status, selected = false }: { status: FamiliarityStatus; selected?: boolean }) {
  return <span className={`status-dot ${statusMeta[status].className} ${selected ? 'selected' : ''}`} aria-label={statusMeta[status].label} />
}

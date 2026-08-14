import type { ReactNode } from 'react'

export function ContextQuadrant({ index, title, en, icon, children }: { index: string; title: string; en: string; icon: ReactNode; children: ReactNode }) {
  return <article className="context-quadrant"><header><span>{icon}</span><div><small>{index} · {en}</small><strong>{title}</strong></div></header><div>{children}</div></article>
}

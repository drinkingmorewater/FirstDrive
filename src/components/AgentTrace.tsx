import { Bot, CheckCircle2, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { publicTrace } from '../lib/agents'

export function AgentTrace() {
  const [open, setOpen] = useState(false)
  return (
    <section className={`agent-trace ${open ? 'open' : ''}`}>
      <button onClick={() => setOpen(value => !value)} aria-expanded={open}>
        <span><Bot size={18} /> 看看 FirstDrive 如何规划</span>
        <ChevronDown size={18} />
      </button>
      {open ? (
        <div className="trace-steps">
          {publicTrace.map((step, index) => (
            <div key={step} style={{ '--delay': `${index * 45}ms` } as React.CSSProperties}>
              <CheckCircle2 size={16} /><span>{step}</span>
            </div>
          ))}
          <p>这是可公开的结构化执行日志，不包含模型内部推理。</p>
        </div>
      ) : null}
    </section>
  )
}

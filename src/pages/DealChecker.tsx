import { AlertCircle, ArrowLeft, Check, CircleDollarSign, FileSearch, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../state/AppState'

const demoQuote = '宋 PLUS DM-i 2025款\n裸车 149,800 元\n保险 6,800 元\n上牌服务费 2,000 元\n金融服务费 3,000 元\n装潢礼包 5,800 元\n落地合计 167,400 元'

export function DealChecker() {
  const [quote, setQuote] = useState('')
  const [analyzed, setAnalyzed] = useState(false)
  const { emitAgentEvent } = useAppState()

  const analyze = () => {
    if (!quote.trim()) setQuote(demoQuote)
    setAnalyzed(true)
    emitAgentEvent({ agent: 'buy', status: 'completed', title: '报价单检查完成', detail: '确认 3 项，需追问 2 项，识别潜在额外费用 10,800 元' })
  }

  return <AppShell><div className="workspace-page deal-page">
    <Link to="/buy" className="text-link"><ArrowLeft /> 返回 BUY SMART</Link>
    <header className="workspace-heading"><div><span className="eyebrow">DEAL CHECKER</span><h1>把销售话术，变成一份<br />可以逐项确认的交易清单。</h1></div></header>
    <div className="deal-input"><FileSearch /><textarea value={quote} onChange={event => setQuote(event.target.value)} placeholder="粘贴车型报价、费用项目或销售发来的文字…" /><button onClick={analyze}>检查报价单</button><button className="ghost-action" onClick={() => setQuote(demoQuote)}>载入示例报价</button></div>
    {analyzed ? <div className="deal-results">
      <section><header><Check /> 已确认 <b>3</b></header><p>裸车价 ¥149,800</p><p>首年保险 ¥6,800</p><p>落地总价 ¥167,400</p></section>
      <section><header><HelpCircle /> 需要追问 <b>2</b></header><p>保险险种和保额明细是什么？</p><p>装潢礼包是否可取消或折现？</p></section>
      <section><header><AlertCircle /> 潜在额外费用 <b>¥10,800</b></header><p>金融服务费偏高：¥3,000</p><p>上牌费高于常见区间：¥2,000</p><p>装潢礼包需确认自愿性：¥5,800</p></section>
      <aside><CircleDollarSign /><div><small>BUY AGENT 建议</small><strong>先确认保险与装潢可选性，再比较“真实落地价”。</strong></div></aside>
    </div> : null}
  </div></AppShell>
}

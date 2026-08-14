import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'

export function NotFound() {
  const navigate = useNavigate()
  return <AppShell><div className="not-found"><span>404</span><h1>这条路还没有被记录。</h1><p>回到 FirstDrive，重新选择一次出发。</p><Button onClick={() => navigate('/')}><ArrowLeft size={17} /> 回到首页</Button></div></AppShell>
}

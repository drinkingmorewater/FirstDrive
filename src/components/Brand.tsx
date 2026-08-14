import { Link } from 'react-router-dom'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand ${inverse ? 'brand-inverse' : ''}`} to="/" aria-label="FirstDrive 第一公里首页">
      <span>First<span className="brand-accent">D</span>rive</span>
      <i />
      <span className="brand-cn">第一公里</span>
    </Link>
  )
}

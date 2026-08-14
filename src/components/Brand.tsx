import { Link } from 'react-router-dom'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={inverse ? 'brand brand-inverse' : 'brand'} aria-label="FirstDrive 第一公里首页">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 22 14.4 6.8c.8-1.2 2.6-1.2 3.4 0L28 22" />
        <path d="m10.8 20.5 5.1-7.4 5.2 7.4" />
      </svg>
      <span><b>FirstDrive</b><i>第一公里</i></span>
    </Link>
  )
}

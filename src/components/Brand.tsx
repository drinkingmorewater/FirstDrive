import { Link } from 'react-router-dom'
import { MountainMark } from './MountainMark'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={inverse ? 'brand brand-inverse' : 'brand'} aria-label="FirstDrive 第一公里首页">
      <MountainMark inverse={inverse} />
      <span><b>FirstDrive</b><i>第一公里</i></span>
    </Link>
  )
}

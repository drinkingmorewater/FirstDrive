export function MountainMark({ inverse = false, size = 32 }: { inverse?: boolean; size?: number }) {
  return (
    <svg className="mountain-mark" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M3.8 22.5 14.1 7.3c.9-1.35 2.85-1.35 3.75 0l10.35 15.2" stroke={inverse ? '#fff' : 'currentColor'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m10.7 20.8 5.25-7.65 5.35 7.65" stroke={inverse ? '#fff' : 'currentColor'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

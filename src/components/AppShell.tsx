export function AppShell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={compact ? 'app-shell app-shell-compact' : 'app-shell'}>
      <main>{children}</main>
    </div>
  )
}

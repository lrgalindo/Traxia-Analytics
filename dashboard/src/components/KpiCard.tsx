interface KpiCardProps {
  label: string
  value: string
  sub?: string
  delta?: string
  deltaUp?: boolean
  dark?: boolean
  live?: boolean
}

export function KpiCard({ label, value, sub, delta, deltaUp, dark, live }: KpiCardProps) {
  if (dark) {
    return (
      <div style={{
        background: '#0E0925', borderRadius: 14, padding: '17px 19px',
        backgroundImage: 'radial-gradient(130% 100% at 100% 0%, #2A1A6E 0%, #0E0925 65%)',
      }}>
        {live && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#67E8F9', animation: 'tx-pulse 1.6s ease-in-out infinite', display: 'inline-block' }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: '#A78BFF' }}>{label}</span>
          </div>
        )}
        {!live && (
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: '#A78BFF', marginBottom: 10 }}>{label}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{value}</span>
          {sub && <span style={{ fontSize: 13, color: '#B6ADE0' }}>{sub}</span>}
        </div>
      </div>
    )
  }

  const deltaColor = delta ? (deltaUp ? 'var(--success-fg)' : 'var(--error-fg)') : undefined

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '17px 19px',
      boxShadow: '0 1px 2px rgba(14,9,37,.04)',
    }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{value}</span>
        {sub && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{sub}</span>}
      </div>
      {delta && (
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: deltaColor, marginTop: 6 }}>{delta}</div>
      )}
    </div>
  )
}

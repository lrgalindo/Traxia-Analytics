interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  title?: string
  sub?: string
}

export function Card({ children, style, title, sub }: CardProps) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 22px',
      boxShadow: '0 1px 2px rgba(14,9,37,.04)',
      ...style,
    }}>
      {(title || sub) && (
        <div style={{ marginBottom: 18 }}>
          {title && <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 3px' }}>{title}</h2>}
          {sub && <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)', margin: 0 }}>{sub}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export function StatusBadge({ status, label }: { status: 'success' | 'warning' | 'error' | 'neutral'; label: string }) {
  const map = {
    success: { bg: 'var(--success-bg)', fg: 'var(--success-fg)', dot: 'var(--success)' },
    warning: { bg: 'var(--warning-bg)', fg: 'var(--warning-fg)', dot: 'var(--warning)' },
    error:   { bg: 'var(--error-bg)',   fg: 'var(--error-fg)',   dot: 'var(--error)' },
    neutral: { bg: 'var(--bg)',         fg: 'var(--muted)',      dot: 'var(--mono-muted)' },
  }
  const c = map[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '4px 10px', fontSize: 11.5, fontWeight: 600, background: c.bg, color: c.fg }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot }} />
      {label}
    </span>
  )
}

export function MonoBadge({ label }: { label: string }) {
  return (
    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, background: 'var(--primary-bg)', color: 'var(--primary-deeper)', borderRadius: 4, padding: '3px 7px' }}>
      {label}
    </span>
  )
}

export function PrimaryButton({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 16px',
      border: 0, background: 'var(--primary)', color: '#fff',
      borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
      whiteSpace: 'nowrap', flexShrink: 0,
      boxShadow: '0 6px 18px rgba(91,52,242,.24)',
      ...style,
    }}>
      {children}
    </button>
  )
}

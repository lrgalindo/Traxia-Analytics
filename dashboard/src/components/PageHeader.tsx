interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 22, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: '.12em', color: 'var(--mono-muted)', marginBottom: 7 }}>
          {eyebrow}
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 27, fontWeight: 700, color: 'var(--ink)', margin: '0 0 5px', letterSpacing: '-.02em' }}>
          {title}
        </h1>
        {description && (
          <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

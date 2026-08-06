import { useEffect, useState } from 'react'
import { backoffice } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { Card, PrimaryButton, StatusBadge } from '../components/Card'
import { useNavigate } from 'react-router-dom'
import type { PartnerListItem } from '../types'

function expiryLabel(access_expires_at: string | null): string {
  if (!access_expires_at) return 'Indefinido'
  const d = new Date(access_expires_at)
  const diffDays = Math.round((d.getTime() - Date.now()) / 86_400_000)
  if (diffDays < 0) return 'Vencido'
  if (diffDays === 0) return 'Vence hoy'
  return `en ${diffDays} día${diffDays === 1 ? '' : 's'}`
}

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function Partners() {
  const [partners, setPartners] = useState<PartnerListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    backoffice.listPartners()
      .then(ps => {
        setPartners(ps)
        setEmpty(ps.length === 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const active   = partners.filter(p => p.status === 'active').length
  const expiring = partners.filter(p => {
    if (p.status !== 'active' || !p.access_expires_at) return false
    return (new Date(p.access_expires_at).getTime() - Date.now()) < 30 * 86_400_000
  }).length
  const inactive = partners.filter(p => p.status === 'inactive' || p.status === 'sync_error').length

  return (
    <div className="tx-page">
      <PageHeader
        eyebrow="OPERACIÓN / ACCESO COMPARTIDO"
        title="Partners"
        description="Marcas y proveedores con acceso restringido a las zonas que tú les asignas."
        action={
          <PrimaryButton onClick={() => nav('/reventa')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Dar de alta partner
          </PrimaryButton>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
        <Card>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>PARTNERS ACTIVOS</div>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{active}</span>
        </Card>
        <Card style={{ border: '1px solid var(--warning-border)' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--warning-fg)', marginBottom: 10 }}>VENCEN EN 30 DÍAS</div>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--warning)' }}>{expiring}</span>
        </Card>
        <Card style={{ border: inactive > 0 ? '1px solid var(--error-border)' : undefined }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>INACTIVOS / ERROR</div>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: inactive > 0 ? 'var(--error)' : 'var(--ink)' }}>{inactive}</span>
        </Card>
      </div>

      {loading ? (
        <div style={{ height: 200, background: 'var(--surface)', borderRadius: 14, animation: 'tx-pulse 1.5s infinite' }} />
      ) : empty ? (
        <div data-testid="partners-list" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--mono-muted)', marginBottom: 12 }}>SIN PARTNERS AÚN</div>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>Usa "Dar de alta partner" para crear el primer acceso compartido.</p>
          <PrimaryButton onClick={() => nav('/reventa')}>Dar de alta partner</PrimaryButton>
        </div>
      ) : (
        <div data-testid="partners-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16 }}>
          {partners.map(p => {
            const statusVariant: 'success' | 'warning' | 'error' =
              p.status === 'active' ? 'success' :
              p.status === 'inactive' ? 'error' : 'error'
            const statusLabel =
              p.status === 'active' ? 'Activo' :
              p.status === 'inactive' ? 'Inactivo' : 'Error sync'
            const exp = expiryLabel(p.access_expires_at)
            return (
              <div key={p.id} data-testid="partner-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, boxShadow: '0 1px 2px rgba(14,9,37,.04)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, background: 'var(--primary-bg)', color: 'var(--primary-deeper)' }}>
                    {initials(p.name)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.admin_email ?? '—'}
                    </div>
                  </div>
                  <StatusBadge status={statusVariant} label={statusLabel} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border-soft)', marginTop: 'auto' }}>
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)' }}>Vence</div>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: exp === 'Vencido' ? 'var(--error-fg)' : 'var(--on-surface)' }}>{exp}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ height: 32, padding: '0 12px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 8, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500, color: 'var(--on-surface)', cursor: 'pointer' }}>Ver</button>
                    <button style={{ height: 32, padding: '0 12px', border: '1px solid var(--error-border)', background: 'var(--surface)', borderRadius: 8, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500, color: 'var(--error-fg)', cursor: 'pointer' }}>Revocar</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

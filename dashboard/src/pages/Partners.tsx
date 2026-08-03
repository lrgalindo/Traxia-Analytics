import { useEffect, useState } from 'react'
import { backoffice } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { Card, PrimaryButton, StatusBadge } from '../components/Card'
import { useNavigate } from 'react-router-dom'
import type { PartnerResponse } from '../types'

const FALLBACK_PARTNERS = [
  { id: '1', name: 'Lácteos CA', initials: 'LC', contact_email: 'analytics@lacteosca.com', status: 'active', zones: 8, sites: 4, zoneChips: ['Góndola Lácteos · S. Centro', 'Góndola Lácteos · S. Norte', '+6 más'], expiry: 'Indefinido', avatarBg: '#EDE7FF', avatarFg: 'var(--primary-deeper)' },
  { id: '2', name: 'Bebidas Centroamérica', initials: 'BC', contact_email: 'datos@bebidascam.com', status: 'active', zones: 6, sites: 3, zoneChips: ['Góndola Bebidas · S. Sur', 'Pasillo 4 · S. Centro', '+4 más'], expiry: 'Indefinido', avatarBg: '#DFF6FB', avatarFg: '#075E6B' },
  { id: '3', name: 'Snacks Group', initials: 'SG', contact_email: 'insights@snacksgroup.com', status: 'expiring', zones: 3, sites: 2, zoneChips: ['Pasillo 4 · S. Norte', 'Entrada · S. Sur', '+1 más'], expiry: 'en 14 días · 14 ago', avatarBg: '#FEF3E2', avatarFg: 'var(--warning-fg)' },
]

export function Partners() {
  const [partners, setPartners] = useState<(typeof FALLBACK_PARTNERS[0] | PartnerResponse)[]>(FALLBACK_PARTNERS)
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    backoffice.listPartners().then(ps => {
      if (ps.length) setPartners(ps.map(p => ({
        id: p.id, name: p.name, initials: p.name.slice(0, 2).toUpperCase(),
        contact_email: p.contact_email, status: p.status,
        zones: 0, sites: 0, zoneChips: [], expiry: p.access_expires_at ?? 'Indefinido',
        avatarBg: 'var(--primary-bg)', avatarFg: 'var(--primary-deeper)',
      })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const active = partners.filter(p => p.status === 'active').length
  const expiring = partners.filter(p => p.status === 'expiring' || p.status === 'inactive').length
  const totalZones = partners.reduce((s, p) => s + ((p as typeof FALLBACK_PARTNERS[0]).zones ?? 0), 0)

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
        <Card><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>PARTNERS ACTIVOS</div><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{active}</span></Card>
        <Card><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>ZONAS COMPARTIDAS</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{totalZones}</span><span style={{ fontSize: 13, color: 'var(--muted)' }}>en varias sedes</span></div></Card>
        <Card style={{ border: '1px solid var(--warning-border)' }}><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--warning-fg)', marginBottom: 10 }}>VENCEN EN 30 DÍAS</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--warning)' }}>{expiring}</span><span style={{ fontSize: 13, color: 'var(--muted)' }}>{expiring === 1 ? 'Snacks Group' : 'partners'}</span></div></Card>
      </div>

      {loading ? (
        <div style={{ height: 200, background: 'var(--surface)', borderRadius: 14, animation: 'tx-pulse 1.5s infinite' }} />
      ) : (
        <div data-testid="partners-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16 }}>
          {partners.map(p => {
            const fp = p as typeof FALLBACK_PARTNERS[0]
            const status: 'success' | 'warning' | 'error' = p.status === 'active' ? 'success' : p.status === 'expiring' ? 'warning' : 'error'
            const statusLabel = p.status === 'active' ? 'Activo' : p.status === 'expiring' ? 'Por vencer' : 'Inactivo'
            return (
              <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, boxShadow: '0 1px 2px rgba(14,9,37,.04)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, background: fp.avatarBg, color: fp.avatarFg }}>
                    {fp.initials}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.contact_email}</div>
                  </div>
                  <StatusBadge status={status} label={statusLabel} />
                </div>

                {fp.zones > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={{ background: '#FBFAFE', borderRadius: 9, padding: '10px 12px' }}>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.1em', color: 'var(--mono-muted)', marginBottom: 4 }}>ZONAS</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{fp.zones}</div>
                    </div>
                    <div style={{ background: '#FBFAFE', borderRadius: 9, padding: '10px 12px' }}>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.1em', color: 'var(--mono-muted)', marginBottom: 4 }}>SEDES</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{fp.sites}</div>
                    </div>
                  </div>
                )}

                {fp.zoneChips?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {fp.zoneChips.map(c => (
                      <span key={c} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, background: 'var(--primary-bg)', color: 'var(--primary-deeper)', borderRadius: 5, padding: '4px 8px' }}>{c}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border-soft)', marginTop: 'auto' }}>
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)' }}>Vence</div>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: status === 'warning' ? 'var(--warning-fg)' : 'var(--on-surface)' }}>{fp.expiry}</div>
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

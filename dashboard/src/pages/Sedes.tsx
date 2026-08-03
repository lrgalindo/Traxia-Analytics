import { useEffect, useState } from 'react'
import { sites } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { Card, PrimaryButton } from '../components/Card'
import type { Site } from '../types'

const FALLBACK: (Site & { city: string; cams: number; zones: number; partners: number; gw: string; gwStatus: 'ok' | 'warn' | 'error'; last: string })[] = [
  { id: '1', name: 'Sucursal Centro', status: 'active', city: 'Ciudad de Guatemala', cams: 6, zones: 11, partners: 2, gw: 'En línea · 2s', gwStatus: 'ok', last: 'hace 2s' },
  { id: '2', name: 'Sucursal Norte', status: 'active', city: 'Ciudad de Guatemala', cams: 5, zones: 9, partners: 3, gw: 'En línea · 4s', gwStatus: 'ok', last: 'hace 4s' },
  { id: '3', name: 'Sucursal Sur', status: 'active', city: 'Villa Nueva', cams: 4, zones: 8, partners: 1, gw: 'En línea · 1s', gwStatus: 'ok', last: 'hace 1s' },
  { id: '4', name: 'Sucursal Oeste', status: 'inactive', city: 'Mixco', cams: 4, zones: 7, partners: 0, gw: 'Sin latido · 8m', gwStatus: 'error', last: 'hace 8 min' },
  { id: '5', name: 'Sucursal Aeropuerto', status: 'degraded', city: 'Ciudad de Guatemala', cams: 3, zones: 5, partners: 1, gw: 'Degradado · 12 fps', gwStatus: 'warn', last: 'hace 6s' },
  { id: '6', name: 'Sucursal Antigua', status: 'active', city: 'Antigua Guatemala', cams: 3, zones: 6, partners: 0, gw: 'En línea · 3s', gwStatus: 'ok', last: 'hace 3s' },
  { id: '7', name: 'Centro de Distribución', status: 'active', city: 'Amatitlán', cams: 8, zones: 12, partners: 0, gw: 'En línea · 2s', gwStatus: 'ok', last: 'hace 2s' },
]

const GW_COLOR: Record<string, { fg: string; dot: string }> = {
  ok:    { fg: 'var(--success-fg)', dot: 'var(--success)' },
  warn:  { fg: 'var(--warning-fg)', dot: 'var(--warning)' },
  error: { fg: 'var(--error-fg)',   dot: 'var(--error)' },
}

type Filter = 'all' | 'active' | 'incident'

export function Sedes() {
  const [rows, setRows] = useState(FALLBACK)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    sites.list().then(sl => {
      if (sl.length) {
        setRows(sl.map(s => ({ ...s, city: '—', cams: 0, zones: 0, partners: 0, gw: s.status === 'active' ? 'En línea' : 'Sin conexión', gwStatus: s.status === 'active' ? 'ok' : 'error' as const, last: '—' })))
      }
    }).catch(() => {})
  }, [])

  const visible = rows.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.city.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'active') return r.status === 'active'
    if (filter === 'incident') return r.status !== 'active'
    return true
  })

  const incidentRow = rows.find(r => r.gwStatus === 'error')

  const FilterBtn = ({ id, label }: { id: Filter; label: string }) => (
    <span onClick={() => setFilter(id)} style={{
      borderRadius: 999, padding: '6px 13px', fontSize: 12.5, cursor: 'pointer',
      fontWeight: filter === id ? 600 : 500,
      background: filter === id ? 'var(--primary-bg)' : 'transparent',
      color: filter === id ? 'var(--primary-deeper)' : 'var(--muted)',
      border: filter === id ? '1px solid var(--primary-border)' : '1px solid var(--border)',
    }}>{label}</span>
  )

  return (
    <div className="tx-page">
      <PageHeader
        eyebrow="OPERACIÓN / INFRAESTRUCTURA"
        title="Sedes y cámaras"
        description={`${rows.length} sedes · ${rows.reduce((s, r) => s + r.cams, 0)} cámaras activas · ${rows.length} Edge Gateways`}
        action={
          <PrimaryButton>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Agregar sede
          </PrimaryButton>
        }
      />

      {incidentRow && (
        <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 12, padding: '14px 17px', display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16 }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>
            <path d="M12 9v4.5M12 17.5v.01"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--error-fg)' }}>Edge Gateway sin conexión — {incidentRow.name}</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: '#8B4A44' }}>Sin latido desde hace 8 minutos · última conexión 14:32</div>
          </div>
          <a href="#" style={{ fontSize: 13, fontWeight: 600, color: 'var(--error-fg)', flexShrink: 0 }}>Ver guía de solución →</a>
        </div>
      )}

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, maxWidth: 320, height: 36, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', background: '#FBFAFE' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--mono-muted)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar sede o ciudad…" style={{ border: 0, background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: 13.5, color: 'var(--on-surface)', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <FilterBtn id="all" label="Todas" />
            <FilterBtn id="active" label="Activas" />
            <FilterBtn id="incident" label="Con incidencia" />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FBFAFE', borderBottom: '1px solid var(--border)' }}>
              {['SEDE', 'CIUDAD', 'CÁMARAS', 'ZONAS', 'PARTNERS', 'GATEWAY', 'ÚLT. ACTIVIDAD'].map((h, i) => (
                <th key={h} style={{ textAlign: i >= 2 && i <= 4 ? 'right' : 'left', padding: '10px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.1em', color: 'var(--mono-muted)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(s => {
              const gc = GW_COLOR[s.gwStatus] ?? GW_COLOR.ok
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' }}>
                  <td style={{ padding: '13px 14px', fontSize: 13.5, fontWeight: 500, color: 'var(--on-surface)' }}>{s.name}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, color: 'var(--muted)' }}>{s.city}</td>
                  <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: 'var(--on-surface)' }}>{s.cams}</td>
                  <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: 'var(--on-surface)' }}>{s.zones}</td>
                  <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: 'var(--muted)' }}>{s.partners}</td>
                  <td style={{ padding: '13px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: gc.fg }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: gc.dot }} />{s.gw}
                    </span>
                  </td>
                  <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, color: 'var(--mono-muted)' }}>{s.last}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { sites } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { Card, PrimaryButton } from '../components/Card'
import type { Site } from '../types'

type GwStatus = 'ok' | 'warn' | 'error'

interface SiteRow {
  id: string
  name: string
  status: string
  gwStatus: GwStatus
  gw: string
}

const GW_COLOR: Record<GwStatus, { fg: string; dot: string }> = {
  ok:    { fg: 'var(--success-fg)', dot: 'var(--success)' },
  warn:  { fg: 'var(--warning-fg)', dot: 'var(--warning)' },
  error: { fg: 'var(--error-fg)',   dot: 'var(--error)' },
}

function toRow(s: Site): SiteRow {
  const gwStatus: GwStatus =
    s.status === 'active' ? 'ok' :
    s.status === 'onboarding' ? 'warn' : 'error'
  return {
    id: s.id, name: s.name, status: s.status, gwStatus,
    gw: s.status === 'active' ? 'En línea' : s.status === 'onboarding' ? 'Configurando' : 'Sin conexión',
  }
}

type Filter = 'all' | 'active' | 'incident'

export function Sedes() {
  const [rows, setRows]     = useState<SiteRow[] | null>(null)  // null = loading
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    sites.list()
      .then(sl => setRows(sl.map(toRow)))
      .catch(() => setRows([]))
  }, [])

  const loading = rows === null

  const visible = (rows ?? []).filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'active')   return r.status === 'active'
    if (filter === 'incident') return r.gwStatus !== 'ok'
    return true
  })

  const incidentRow = (rows ?? []).find(r => r.gwStatus === 'error')

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
        description={rows ? `${rows.length} sedes` : 'Cargando…'}
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
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--error-fg)' }}>Sede sin conexión — {incidentRow.name}</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: '#8B4A44' }}>Estado: {incidentRow.gw}</div>
          </div>
        </div>
      )}

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, maxWidth: 320, height: 36, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', background: '#FBFAFE' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--mono-muted)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar sede…" style={{ border: 0, background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: 13.5, color: 'var(--on-surface)', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <FilterBtn id="all" label="Todas" />
            <FilterBtn id="active" label="Activas" />
            <FilterBtn id="incident" label="Con incidencia" />
          </div>
        </div>

        {loading ? (
          <div style={{ height: 120, background: 'var(--bg)', borderRadius: 10, animation: 'tx-pulse 1.5s infinite' }} />
        ) : rows!.length === 0 ? (
          <div data-testid="sedes-empty" style={{ padding: '32px 0', textAlign: 'center' }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--mono-muted)' }}>Sin sedes configuradas aún</span>
          </div>
        ) : (
          <table data-testid="sedes-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FBFAFE', borderBottom: '1px solid var(--border)' }}>
                {['SEDE', 'ESTADO', 'GATEWAY'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.1em', color: 'var(--mono-muted)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(s => {
                const gc = GW_COLOR[s.gwStatus]
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' }}>
                    <td style={{ padding: '13px 14px', fontSize: 13.5, fontWeight: 500, color: 'var(--on-surface)' }}>{s.name}</td>
                    <td style={{ padding: '13px 14px', fontSize: 13, color: 'var(--muted)' }}>{s.status}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: gc.fg }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: gc.dot }} />{s.gw}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

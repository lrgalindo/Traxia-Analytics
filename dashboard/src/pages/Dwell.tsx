import { useEffect, useState } from 'react'
import { analytics } from '../api/client'
import { KpiCard } from '../components/KpiCard'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import type { ZoneDwellDay } from '../types'

const DWELL_BARS = [
  { name: 'Panadería', site: 'Sucursal Centro', label: '2m 14s', w: '100%', color: '#F04438' },
  { name: 'Zona de Cajas', site: 'Sucursal Norte', label: '1m 52s', w: '84%', color: '#F04438' },
  { name: 'Góndola Bebidas', site: 'Sucursal Sur', label: '58s', w: '43%', color: '#F79009' },
  { name: 'Góndola Lácteos', site: 'Sucursal Norte', label: '49s', w: '37%', color: '#F79009' },
  { name: 'Pasillo 4', site: 'Sucursal Centro', label: '44s', w: '33%', color: '#7C5BFF' },
  { name: 'Zona de Espera', site: 'Sucursal Sur', label: '38s', w: '28%', color: '#7C5BFF' },
  { name: 'Entrada Principal', site: 'Sucursal Centro', label: '12s', w: '9%', color: '#12B76A' },
]

const DWELL_ROWS = [
  { zone: 'Panadería', site: 'Sucursal Centro', type: 'góndola', avg: '134s', d7: '128s', d30: '131s', delta: '+4.7%', up: true },
  { zone: 'Zona de Cajas', site: 'Sucursal Norte', type: 'caja', avg: '112s', d7: '118s', d30: '109s', delta: '−5.1%', up: false },
  { zone: 'Góndola Bebidas', site: 'Sucursal Sur', type: 'góndola', avg: '58s', d7: '61s', d30: '60s', delta: '−4.9%', up: false },
  { zone: 'Góndola Lácteos', site: 'Sucursal Norte', type: 'góndola', avg: '49s', d7: '72s', d30: '81s', delta: '−42.0%', up: false },
  { zone: 'Pasillo 4', site: 'Sucursal Centro', type: 'pasillo', avg: '44s', d7: '58s', d30: '62s', delta: '−31.0%', up: false },
  { zone: 'Zona de Espera', site: 'Sucursal Sur', type: 'zona_espera', avg: '38s', d7: '36s', d30: '35s', delta: '+5.5%', up: true },
  { zone: 'Entrada Principal', site: 'Sucursal Centro', type: 'entrada', avg: '12s', d7: '12s', d30: '13s', delta: '0.0%', up: true },
]

export function Dwell() {
  const [data, setData] = useState<ZoneDwellDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analytics.dwellSummary().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const avgDwell = data.length
    ? Math.round(data.reduce((s, d) => s + d.avg_dwell_seconds, 0) / data.length)
    : 72

  return (
    <div className="tx-page">
      <PageHeader eyebrow="ANALÍTICA / PERMANENCIA" title="Permanencia" description="Tiempo promedio que las personas pasan en cada zona." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
        <KpiCard label="PERMANENCIA PROMEDIO" value={`${avgDwell}s`} delta="+4.2% vs sem. previa" deltaUp />
        <KpiCard label="ZONA MÁS LARGA" value="Panadería" sub="2m 14s" />
        <KpiCard label="ZONAS CON CAÍDA >20%" value="2" sub="requieren revisión" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {[
          { zone: 'Góndola Lácteos', site: 'Sucursal Norte', delta: '−42%' },
          { zone: 'Pasillo 4', site: 'Sucursal Centro', delta: '−31%' },
        ].map(a => (
          <div key={a.zone} style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>
              <path d="M12 9v4.5M12 17.5v.01"/>
            </svg>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--error-fg)' }}>Caída de permanencia {a.delta} — {a.zone}</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: '#8B4A44' }}>{a.site}</span>
          </div>
        ))}
      </div>

      <Card title="Permanencia por zona" sub="promedio · período seleccionado" style={{ marginBottom: 16 }}>
        {loading ? (
          <div data-testid="dwell-loading" style={{ height: 220, background: 'var(--bg)', borderRadius: 10, animation: 'tx-pulse 1.5s infinite' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(data.length ? data.slice(0, 7).map(d => ({
              name: d.zone_name, site: '', label: `${d.avg_dwell_seconds}s`,
              w: `${Math.min(100, (d.avg_dwell_seconds / 140) * 100)}%`,
              color: d.avg_dwell_seconds > 100 ? '#F04438' : d.avg_dwell_seconds > 55 ? '#F79009' : '#7C5BFF',
            })) : DWELL_BARS).map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 150, flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                  {b.site && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)' }}>{b.site}</div>}
                </div>
                <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: b.w, height: '100%', background: b.color, borderRadius: 4 }} />
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--on-surface)', width: 52, textAlign: 'right', flexShrink: 0 }}>{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div data-testid="dwell-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FBFAFE', borderBottom: '1px solid var(--border)' }}>
                {['ZONA', 'SEDE', 'TIPO', 'HOY', '7D', '30D', 'Δ'].map((h, i) => (
                  <th key={h} style={{ textAlign: i >= 3 ? 'right' : 'left', padding: '10px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.1em', color: 'var(--mono-muted)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.length ? data.map(d => ({
                zone: d.zone_name, site: '', type: d.zone_type, avg: `${d.avg_dwell_seconds}s`, d7: '—', d30: '—', delta: '—', up: true,
              })) : DWELL_ROWS).map(r => (
                <tr key={r.zone + r.type} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13.5, fontWeight: 500, color: 'var(--on-surface)' }}>{r.zone}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--muted)' }}>{r.site || '—'}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, background: 'var(--primary-bg)', color: 'var(--primary-deeper)', borderRadius: 4, padding: '3px 7px' }}>{r.type}</span></td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: 'var(--on-surface)' }}>{r.avg}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: 'var(--muted)' }}>{r.d7}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: 'var(--muted)' }}>{r.d30}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, color: r.delta === '—' ? 'var(--muted)' : r.up ? 'var(--success-fg)' : 'var(--error-fg)' }}>{r.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

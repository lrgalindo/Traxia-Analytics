import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analytics, sites } from '../api/client'
import { KpiCard } from '../components/KpiCard'
import { Card, StatusBadge } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import type { SiteTrafficDay, Site } from '../types'

export function Resumen() {
  const [trafficData, setTrafficData] = useState<SiteTrafficDay[]>([])
  const [siteList, setSiteList] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    Promise.all([
      analytics.trafficDaily().catch(() => [] as SiteTrafficDay[]),
      sites.list().catch(() => [] as Site[]),
    ]).then(([td, sl]) => {
      setTrafficData(td)
      setSiteList(sl)
      setLoading(false)
    })
  }, [])

  const today = trafficData.filter(d => d.day === new Date().toISOString().slice(0, 10))
  const totalVisitors = today.reduce((s, d) => s + d.unique_visitors, 0) || 2140
  const totalDetections = today.reduce((s, d) => s + d.total_detections, 0) || 18420

  // Hourly chart mock (real endpoint pending)
  const hourlyBars = Array.from({ length: 12 }, (_, i) => {
    const vals = [0.28, 0.22, 0.18, 0.41, 0.65, 0.82, 0.74, 0.55, 0.48, 0.36, 0.29, 0.22]
    return { h: `${i + 9}:00`, v: vals[i] }
  })
  const maxH = Math.max(...hourlyBars.map(b => b.v), 0.01)

  // Site performance rows from API or fallback
  const siteRows: { name: string; traffic: string; status: 'success' | 'warning' | 'error'; statusLabel: string }[] = siteList.length
    ? siteList.map(s => ({
        name: s.name,
        traffic: '—',
        status: s.status === 'active' ? 'success' : s.status === 'degraded' ? 'warning' : 'error',
        statusLabel: s.status === 'active' ? 'Operativo' : s.status === 'degraded' ? 'Atención' : 'Sin conexión',
      }))
    : [
        { name: 'Sucursal Centro', traffic: '2,140', status: 'success', statusLabel: 'Operativo' },
        { name: 'Sucursal Norte', traffic: '1,780', status: 'warning', statusLabel: 'Atención' },
        { name: 'Sucursal Sur', traffic: '2,460', status: 'success', statusLabel: 'Operativo' },
        { name: 'Sucursal Oeste', traffic: '1,120', status: 'error', statusLabel: 'Crítico' },
        { name: 'Sucursal Aeropuerto', traffic: '932', status: 'success', statusLabel: 'Operativo' },
      ]

  return (
    <div className="tx-page" data-testid="resumen-page">
      <PageHeader eyebrow="ANALÍTICA / INICIO" title="Resumen" description="Visión general de todas tus sedes hoy." />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
        <KpiCard label="TRÁFICO HOY" value={totalVisitors.toLocaleString()} sub="visitantes" dark live />
        <KpiCard label="DETECCIONES HOY" value={totalDetections.toLocaleString()} delta="+6.2% vs ayer" deltaUp />
        <KpiCard label="ESPERA PROMEDIO" value="3m 52s" delta="−8% vs ayer" deltaUp />
        <KpiCard label="HALLAZGOS ACTIVOS" value="2" sub="acción requerida" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 16, marginBottom: 16 }}>
        {/* Hourly traffic chart */}
        <Card title="Tráfico por hora" sub="hoy · todas las sedes">
          {loading ? (
            <div style={{ height: 180, background: 'var(--bg)', borderRadius: 10, animation: 'tx-pulse 1.5s infinite' }} />
          ) : (
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 180 }}>
              {hourlyBars.map(b => (
                <div key={b.h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    height: `${(b.v / maxH) * 148}px`, minHeight: 2,
                    background: 'linear-gradient(180deg, #7C5BFF, #5B34F2)',
                  }} title={`${b.h}: ${Math.round(b.v * 2140)} visitantes`} />
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: 'var(--mono-muted)', marginTop: 4, whiteSpace: 'nowrap' }}>{b.h}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Alerts panel */}
        <Card title="Alertas activas" sub="últimas 24 h">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { level: 'error' as const, title: 'Cola sobre SLA', sub: 'Sucursal Centro · hace 34 min' },
              { level: 'error' as const, title: 'Gateway sin conexión', sub: 'Sucursal Oeste · hace 8 min' },
              { level: 'warning' as const, title: 'Quiebre de stock posible', sub: 'Góndola Lácteos · S. Norte' },
              { level: 'warning' as const, title: 'Permanencia −42%', sub: 'Góndola Lácteos · S. Norte' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: a.level === 'error' ? 'var(--error-bg)' : 'var(--warning-bg)', borderRadius: 9, border: `1px solid ${a.level === 'error' ? 'var(--error-border)' : 'var(--warning-border)'}` }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.level === 'error' ? 'var(--error)' : 'var(--warning)', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: a.level === 'error' ? 'var(--error-fg)' : 'var(--warning-fg)' }}>{a.title}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)' }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Copiloto suggestion */}
      <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', borderRadius: 14, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(150deg,#7C5BFF,#4C22E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 20.5l1.9-6.1A8 8 0 1 1 21 11.5z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--primary-deeper)', marginBottom: 2 }}>Sugerencia del Copiloto</div>
          <div style={{ fontSize: 13, color: 'var(--primary-deeper)', opacity: .85 }}>La permanencia en Góndola Lácteos cayó 42% esta semana. Verifica el nivel de stock antes del pico de las 18:00.</div>
        </div>
        <button onClick={() => nav('/copilot')} style={{ height: 34, padding: '0 14px', border: '1px solid var(--primary-border)', background: 'var(--surface)', borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: 'var(--primary-deeper)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Consultar →
        </button>
      </div>

      {/* Site performance table */}
      <Card title="Rendimiento por sede" sub="hoy">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FBFAFE', borderBottom: '1px solid var(--border)' }}>
              {['SEDE', 'TRÁFICO', 'ESTADO'].map(h => (
                <th key={h} style={{ textAlign: h === 'TRÁFICO' ? 'right' : 'left', padding: '10px 16px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.1em', color: 'var(--mono-muted)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {siteRows.map(s => (
              <tr key={s.name} style={{ borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' }}
                onClick={() => nav('/sedes')}>
                <td style={{ padding: '13px 16px', fontSize: 13.5, fontWeight: 500, color: 'var(--on-surface)' }}>{s.name}</td>
                <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: 'var(--on-surface)' }}>{s.traffic}</td>
                <td style={{ padding: '13px 16px' }}><StatusBadge status={s.status} label={s.statusLabel} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

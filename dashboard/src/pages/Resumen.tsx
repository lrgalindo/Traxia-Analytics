import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analytics, sites, findings as findingsApi } from '../api/client'
import { KpiCard } from '../components/KpiCard'
import { Card, StatusBadge } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import type { SiteTrafficDay, ZoneDwellDay, Site, AgentFinding } from '../types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function fmtSeconds(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

export function Resumen() {
  const [trafficData, setTrafficData] = useState<SiteTrafficDay[]>([])
  const [dwellData, setDwellData]     = useState<ZoneDwellDay[]>([])
  const [siteList, setSiteList]       = useState<Site[]>([])
  const [findingList, setFindingList] = useState<AgentFinding[]>([])
  const [loading, setLoading]         = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    Promise.all([
      analytics.trafficDaily().catch(() => [] as SiteTrafficDay[]),
      analytics.dwellSummary().catch(() => [] as ZoneDwellDay[]),
      sites.list().catch(() => [] as Site[]),
      findingsApi.list().catch(() => [] as AgentFinding[]),
    ]).then(([td, dd, sl, fl]) => {
      setTrafficData(td)
      setDwellData(dd)
      setSiteList(sl)
      setFindingList(fl)
      setLoading(false)
    })
  }, [])

  // KPIs from real data — no hardcoded fallback
  const todayRows = trafficData.filter(d => d.day === today())
  const totalVisitors    = todayRows.reduce((s, d) => s + d.unique_visitors, 0)
  const totalDetections  = todayRows.reduce((s, d) => s + d.total_detections, 0)
  const todayDwell       = dwellData.filter(d => d.day === today())
  const avgDwellSeconds  = todayDwell.length
    ? todayDwell.reduce((s, d) => s + d.avg_dwell_seconds, 0) / todayDwell.length
    : null
  const actionRequired   = findingList.filter(f => f.severity === 'action_required').length

  // Last 7 days traffic for bar chart (real daily data, not hourly mock)
  const last7 = [...trafficData]
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-7)
  const maxVisitors = Math.max(...last7.map(d => d.unique_visitors), 1)

  // Site table — real API only, no hardcoded rows
  const siteRows = siteList.map(s => ({
    name: s.name,
    status: (s.status === 'active' ? 'success' : s.status === 'onboarding' ? 'warning' : 'error') as 'success' | 'warning' | 'error',
    statusLabel: s.status === 'active' ? 'Operativo' : s.status === 'onboarding' ? 'Configurando' : 'Sin conexión',
  }))

  // Alerts from real findings (action_required + warning)
  const alertFindings = findingList
    .filter(f => f.severity === 'action_required' || f.severity === 'warning')
    .slice(0, 4)

  return (
    <div className="tx-page" data-testid="resumen-page">
      <PageHeader eyebrow="ANALÍTICA / INICIO" title="Resumen" description="Visión general de todas tus sedes hoy." />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
        <KpiCard
          label="TRÁFICO HOY"
          value={loading ? '…' : totalVisitors > 0 ? totalVisitors.toLocaleString() : '—'}
          sub="visitantes únicos"
          dark
          live
        />
        <KpiCard
          label="DETECCIONES HOY"
          value={loading ? '…' : totalDetections > 0 ? totalDetections.toLocaleString() : '—'}
        />
        <KpiCard
          label="ESPERA PROMEDIO"
          value={loading ? '…' : avgDwellSeconds !== null ? fmtSeconds(avgDwellSeconds) : '—'}
          sub="dwell promedio hoy"
        />
        <KpiCard
          label="HALLAZGOS ACTIVOS"
          value={loading ? '…' : String(actionRequired)}
          sub="acción requerida"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 16, marginBottom: 16 }}>
        {/* Daily traffic chart — real data, last 7 days */}
        <Card title="Tráfico diario" sub="últimos 7 días · todas las sedes">
          {loading ? (
            <div style={{ height: 180, background: 'var(--bg)', borderRadius: 10, animation: 'tx-pulse 1.5s infinite' }} />
          ) : last7.length === 0 ? (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--mono-muted)' }}>Sin datos de tráfico aún</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 180 }}>
              {last7.map(d => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    height: `${(d.unique_visitors / maxVisitors) * 148}px`, minHeight: 2,
                    background: 'linear-gradient(180deg, #7C5BFF, #5B34F2)',
                  }} title={`${d.day}: ${d.unique_visitors.toLocaleString()} visitantes`} />
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: 'var(--mono-muted)', marginTop: 4, whiteSpace: 'nowrap' }}>
                    {d.day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Alerts from real findings */}
        <Card title="Alertas activas" sub="últimas 24 h">
          {loading ? (
            <div style={{ height: 120, background: 'var(--bg)', borderRadius: 10, animation: 'tx-pulse 1.5s infinite' }} />
          ) : alertFindings.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--mono-muted)' }}>Sin alertas activas</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alertFindings.map(f => {
                const isError = f.severity === 'action_required'
                return (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: isError ? 'var(--error-bg)' : 'var(--warning-bg)', borderRadius: 9, border: `1px solid ${isError ? 'var(--error-border)' : 'var(--warning-border)'}` }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: isError ? 'var(--error)' : 'var(--warning)', marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: isError ? 'var(--error-fg)' : 'var(--warning-fg)' }}>{f.task_type.replace(/_/g, ' ')}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)' }}>{f.zone_id}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Site performance table — real API only */}
      <Card title="Rendimiento por sede" sub="hoy">
        {loading ? (
          <div style={{ height: 120, background: 'var(--bg)', borderRadius: 10, animation: 'tx-pulse 1.5s infinite' }} />
        ) : siteRows.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--mono-muted)' }}>Sin sedes configuradas aún</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FBFAFE', borderBottom: '1px solid var(--border)' }}>
                {['SEDE', 'ESTADO'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.1em', color: 'var(--mono-muted)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {siteRows.map(s => (
                <tr key={s.name} style={{ borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' }} onClick={() => nav('/sedes')}>
                  <td style={{ padding: '13px 16px', fontSize: 13.5, fontWeight: 500, color: 'var(--on-surface)' }}>{s.name}</td>
                  <td style={{ padding: '13px 16px' }}><StatusBadge status={s.status} label={s.statusLabel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

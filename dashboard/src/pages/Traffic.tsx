import { useEffect, useState } from 'react'
import { analytics } from '../api/client'
import { KpiCard } from '../components/KpiCard'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import type { SiteTrafficDay } from '../types'

const ZONE_SHARE = [
  { name: 'Entrada Principal', value: '18,420', pct: '31%', w: '100%', color: '#5B34F2' },
  { name: 'Zona de Cajas', value: '14,880', pct: '25%', w: '81%', color: '#7C5BFF' },
  { name: 'Góndola Lácteos', value: '9,640', pct: '16%', w: '52%', color: '#06B6D4' },
  { name: 'Panadería', value: '7,210', pct: '12%', w: '39%', color: '#A855F7' },
  { name: 'Góndola Bebidas', value: '5,930', pct: '10%', w: '32%', color: '#FB7C56' },
  { name: 'Pasillo 4', value: '3,510', pct: '6%', w: '19%', color: '#12B76A' },
]

export function Traffic() {
  const [data, setData] = useState<SiteTrafficDay[]>([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<'hoy' | '7d' | '30d'>('hoy')

  useEffect(() => {
    analytics.trafficDaily().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const last7 = data.slice(-7)
  const max = Math.max(...last7.map(d => d.unique_visitors), 1)
  const totalVisitors = last7.reduce((s, d) => s + d.unique_visitors, 0) || 59_000
  const peak = last7.length ? last7.reduce((a, b) => a.unique_visitors > b.unique_visitors ? a : b, last7[0]) : null

  const weekBars = last7.length ? last7 : [
    { day: 'Lun', label: '9.4K', h: 52 }, { day: 'Mar', label: '8.8K', h: 48 },
    { day: 'Mié', label: '11.2K', h: 64 }, { day: 'Jue', label: '12.1K', h: 70 },
    { day: 'Vie', label: '14.6K', h: 84 }, { day: 'Sáb', label: '17.3K', h: 100 },
    { day: 'Dom', label: '13.0K', h: 75 },
  ].map(b => ({ ...b, unique_visitors: b.h * 200, total_detections: b.h * 400, site_id: '', day: b.day }))

  const realMax = Math.max(...weekBars.map(b => b.unique_visitors), 1)

  const RangeBtn = ({ id, label }: { id: 'hoy' | '7d' | '30d'; label: string }) => (
    <button onClick={() => setRange(id)} style={{
      border: 0, borderRadius: 7, padding: '7px 14px', fontFamily: 'inherit', fontSize: 13,
      fontWeight: range === id ? 600 : 500, cursor: 'pointer',
      background: range === id ? 'var(--primary-bg)' : 'transparent',
      color: range === id ? 'var(--primary-deeper)' : 'var(--muted)',
    }}>{label}</button>
  )

  return (
    <div className="tx-page">
      <PageHeader eyebrow="ANALÍTICA / TRÁFICO" title="Tráfico" description="Afluencia de personas en todas las zonas y sedes." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
        <KpiCard label="VISITANTES HOY" value={(totalVisitors / 7).toLocaleString('es', { maximumFractionDigits: 0 })} delta="+8.3% vs ayer" deltaUp />
        <KpiCard label="TOTAL SEMANA" value={totalVisitors.toLocaleString('es', { maximumFractionDigits: 0 })} sub="personas" />
        <KpiCard label="PICO DEL DÍA" value="14:00–15:00" sub="mayor afluencia" />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 3px' }}>Afluencia diaria</h2>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)', margin: 0 }}>todas las sedes · visitantes únicos</p>
          </div>
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 3 }}>
            <RangeBtn id="hoy" label="Hoy" />
            <RangeBtn id="7d" label="7 días" />
            <RangeBtn id="30d" label="30 días" />
          </div>
        </div>

        {loading ? (
          <div data-testid="traffic-chart" style={{ height: 180, background: 'var(--bg)', borderRadius: 10, animation: 'tx-pulse 1.5s infinite' }} />
        ) : (
          <div data-testid="traffic-chart" style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 180 }}>
            {weekBars.map((b, i) => {
              const h = ((b.unique_visitors ?? 0) / realMax) * 148
              const dayLabel = typeof b.day === 'string' ? b.day.slice(-5) : b.day
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: 'var(--on-surface)', marginBottom: 4 }}>
                    {Math.round((b.unique_visitors ?? 0) / 1000 * 10) / 10}K
                  </div>
                  <div style={{
                    width: '100%', borderRadius: '5px 5px 0 0', minHeight: 2,
                    height: `${Math.max(h, 2)}px`,
                    background: 'linear-gradient(180deg,#7C5BFF,#5B34F2)',
                  }} title={`${dayLabel}: ${b.unique_visitors?.toLocaleString() ?? 0} visitantes`} />
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--mono-muted)', marginTop: 5 }}>{dayLabel}</span>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card title="Distribución por zona" sub="detecciones · semana actual">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ZONE_SHARE.map(z => (
            <div key={z.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 140, fontSize: 13, color: 'var(--on-surface)', flexShrink: 0, fontWeight: 500 }}>{z.name}</div>
              <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: z.w, height: '100%', background: z.color, borderRadius: 4 }} />
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--on-surface)', width: 52, textAlign: 'right', flexShrink: 0 }}>{z.value}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)', width: 34, textAlign: 'right', flexShrink: 0 }}>{z.pct}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

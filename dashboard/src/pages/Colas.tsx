import { KpiCard } from '../components/KpiCard'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'

const LIVE_QUEUES = [
  { zone: 'Zona de Cajas', site: 'Sucursal Centro', n: 14, wait: '6m 40s', pct: 100, color: '#F04438' },
  { zone: 'Caja rápida', site: 'Sucursal Centro', n: 9, wait: '4m 10s', pct: 64, color: '#F79009' },
  { zone: 'Zona de Cajas', site: 'Sucursal Norte', n: 8, wait: '3m 55s', pct: 57, color: '#F79009' },
  { zone: 'Atención al cliente', site: 'Sucursal Norte', n: 3, wait: '1m 30s', pct: 21, color: '#12B76A' },
  { zone: 'Zona de Cajas', site: 'Sucursal Sur', n: 4, wait: '1m 48s', pct: 28, color: '#12B76A' },
  { zone: 'Autoservicio', site: 'Sucursal Sur', n: 2, wait: '1m 01s', pct: 14, color: '#12B76A' },
  { zone: 'Zona de Cajas', site: 'Sucursal Oeste', n: 11, wait: '5m 21s', pct: 78, color: '#F04438' },
  { zone: 'Mostrador', site: 'Sucursal Aeropuerto', n: 5, wait: '2m 12s', pct: 36, color: '#12B76A' },
]

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
const BASE = [0.12, 0.2, 0.42, 0.58, 0.5, 0.34, 0.28, 0.36, 0.62, 0.78, 0.55, 0.3]
const DAY_MUL = [0.85, 0.88, 0.94, 1.0, 1.12, 1.32, 1.18]

function heatBg(v: number) {
  const a = Math.min(1, 0.1 + v * 0.85)
  return `rgba(91,52,242,${a.toFixed(3)})`
}

export function Colas() {
  return (
    <div className="tx-page">
      <PageHeader eyebrow="ANALÍTICA / COLAS" title="Colas y tiempos de espera" description="Profundidad de cola en vivo y cumplimiento del SLA de 5 minutos." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
        <KpiCard label="COLA AHORA" value="7" sub="personas en cajas" dark live />
        <KpiCard label="ESPERA PROMEDIO HOY" value="4m 12s" />
        <KpiCard label="INCUMPLIMIENTOS DE SLA" value="2" sub="hoy" />
        <KpiCard label="MEJOR SEDE" value="1m 48s" sub="Sucursal Sur" />
      </div>

      {/* Live queue grid */}
      <Card title="Profundidad de cola en vivo" sub="refresco cada 30s" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
          <div style={{ flex: 1 }} />
          {[['#12B76A', '0–5'], ['#F79009', '6–10'], ['#F04438', '11+']].map(([c, l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--muted)' }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />{l}
            </span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14 }}>
          {LIVE_QUEUES.map(q => (
            <div key={q.zone + q.site} style={{ border: '1px solid var(--border)', borderRadius: 11, padding: '13px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 2 }}>{q.zone}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)', marginBottom: 11 }}>{q.site}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 600, color: q.color }}>{q.n}</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: 'var(--muted)' }}>{q.wait}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: '#F1EFF9', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${q.pct}%`, background: q.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Heatmap */}
      <Card title="Mapa de calor de colas · día y hora" sub="profundidad promedio de cola · semana actual">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)' }}>bajo</span>
          <div style={{ width: 110, height: 8, borderRadius: 4, background: 'linear-gradient(90deg,#EDE7FF,#7C5BFF,#3A1CA6)' }} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)' }}>alto</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 38, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 24 }}>
            {DAYS.map(d => (
              <div key={d} style={{ height: 34, display: 'flex', alignItems: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: 'var(--muted)' }}>{d}</div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${HOURS.length},minmax(0,1fr))`, gap: 6, marginBottom: 8 }}>
              {HOURS.map(h => (
                <div key={h} style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)' }}>{h}</div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DAYS.map((d, di) => (
                <div key={d} style={{ display: 'grid', gridTemplateColumns: `repeat(${HOURS.length},minmax(0,1fr))`, gap: 6 }}>
                  {BASE.map((v, hi) => {
                    const t = Math.min(1, v * DAY_MUL[di])
                    const n = Math.round(2 + t * 15)
                    return (
                      <div key={hi} title={`${d} ${HOURS[hi]}:00 · ${n} personas en cola`} style={{ height: 34, borderRadius: 7, background: heatBg(t), cursor: 'pointer' }} />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

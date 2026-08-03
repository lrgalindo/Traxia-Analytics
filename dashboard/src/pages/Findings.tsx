import { useEffect, useState } from 'react'
import { findings } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { useNavigate } from 'react-router-dom'
import type { AgentFinding } from '../types'

type Severity = 'action_required' | 'warning' | 'informational'

const SEVERITY_MAP: Record<Severity, { label: string; bg: string; fg: string; accent: string }> = {
  action_required: { label: 'Acción requerida', bg: 'var(--error-bg)', fg: 'var(--error-fg)', accent: 'var(--error)' },
  warning:         { label: 'Advertencia',       bg: 'var(--warning-bg)', fg: 'var(--warning-fg)', accent: 'var(--warning)' },
  informational:   { label: 'Informativo',       bg: 'var(--bg)',         fg: 'var(--muted)',      accent: 'var(--mono-muted)' },
}

const FALLBACK_FINDINGS = [
  { id: '1', severity: 'action_required' as Severity, task_type: 'stock_audit', zone_name: 'Góndola Lácteos', site_name: 'Sucursal Norte', cam: 'CAM-07', created_at: new Date(Date.now() - 18 * 60_000).toISOString(), title: 'Quiebre de stock sostenido en góndola de lácteos', summary: 'Dos niveles de la góndola aparecen vacíos desde las 10:20. La permanencia en la zona cayó 42% respecto a la semana previa y el tráfico se desvió hacia el pasillo contiguo.', blob: 'rgba(240,68,56,.65)' },
  { id: '2', severity: 'action_required' as Severity, task_type: 'queue_analysis', zone_name: 'Zona de Cajas', site_name: 'Sucursal Centro', cam: 'CAM-02', created_at: new Date(Date.now() - 34 * 60_000).toISOString(), title: 'Cola sobre el SLA por 22 minutos continuos', summary: 'La profundidad de cola superó las 10 personas entre 13:05 y 13:27 con solo dos cajas abiertas. Espera máxima estimada: 8m 40s.', blob: 'rgba(240,68,56,.55)' },
  { id: '3', severity: 'warning' as Severity, task_type: 'compliance_check', zone_name: 'Caja rápida', site_name: 'Sucursal Norte', cam: 'CAM-05', created_at: new Date(Date.now() - 60 * 60_000).toISOString(), title: 'Puesto sin personal durante horario operativo', summary: 'La caja rápida estuvo sin personal 9 minutos en plena franja de las 12:00, mientras la cola general crecía.', blob: 'rgba(247,144,9,.55)' },
  { id: '4', severity: 'warning' as Severity, task_type: 'dwell_drop', zone_name: 'Pasillo 4', site_name: 'Sucursal Centro', cam: 'CAM-11', created_at: new Date(Date.now() - 2 * 60 * 60_000).toISOString(), title: 'Caída de permanencia del 31% en pasillo 4', summary: 'El promedio pasó de 64s a 44s en siete días. La reubicación del exhibidor central coincide con el inicio de la caída.', blob: 'rgba(247,144,9,.45)' },
  { id: '5', severity: 'informational' as Severity, task_type: 'traffic_pattern', zone_name: 'Entrada Principal', site_name: 'Sucursal Sur', cam: 'CAM-01', created_at: new Date(Date.now() - 3 * 60 * 60_000).toISOString(), title: 'Nuevo pico de entrada detectado a las 18:00', summary: 'Se consolidó un segundo pico de afluencia a las 18:00 durante cinco días consecutivos, distinto al patrón histórico de las 19:00.', blob: 'rgba(124,91,255,.45)' },
]

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 3600) return `hace ${Math.round(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.round(diff / 3600)} h`
  return `hace ${Math.round(diff / 86400)} d`
}

type FilterType = 'all' | Severity

export function Findings() {
  const [data, setData] = useState<(typeof FALLBACK_FINDINGS[0] | AgentFinding)[]>(FALLBACK_FINDINGS)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const nav = useNavigate()

  useEffect(() => {
    findings.list().then(d => {
      if (d.length) setData(d.map(f => ({ ...f, cam: 'CAM-??', blob: 'rgba(91,52,242,.5)', site_name: '' })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: data.length },
    { id: 'action_required', label: 'Acción requerida', count: data.filter(f => f.severity === 'action_required').length },
    { id: 'warning', label: 'Advertencia', count: data.filter(f => f.severity === 'warning').length },
    { id: 'informational', label: 'Informativo', count: data.filter(f => f.severity === 'informational').length },
  ]
  const visible = filter === 'all' ? data : data.filter(f => f.severity === filter)

  return (
    <div className="tx-page">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 22, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: '.12em', color: 'var(--mono-muted)', marginBottom: 7 }}>INTELIGENCIA / AUDITORÍA AUTOMÁTICA</div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 27, fontWeight: 700, color: 'var(--ink)', margin: '0 0 5px', letterSpacing: '-.02em' }}>Hallazgos</h1>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>
            Detecciones que el agente escribió tras auditar tus zonas · <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5 }}>actualizado hace 18 min</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {filters.map(f => {
            const active = filter === f.id
            const sv = f.id === 'action_required' ? 'action_required' : f.id === 'warning' ? 'warning' : null
            const accent = sv === 'action_required' ? 'var(--error-border)' : sv === 'warning' ? 'var(--warning-border)' : 'var(--border)'
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                border: `1px solid ${active ? 'var(--primary)' : accent}`,
                borderRadius: 999, padding: '6px 14px', fontSize: 12.5, background: 'transparent',
                fontWeight: active ? 600 : 500, cursor: 'pointer',
                color: active ? 'var(--primary-deeper)' : f.id === 'action_required' ? 'var(--error-fg)' : f.id === 'warning' ? 'var(--warning-fg)' : 'var(--muted)',
                fontFamily: 'inherit',
              }}>
                {f.label} <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{f.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ height: 200, background: 'var(--surface)', borderRadius: 14, animation: 'tx-pulse 1.5s infinite' }} />
      ) : (
        <div data-testid="findings-list" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visible.map(f => {
            const sev = (f.severity ?? 'informational') as Severity
            const s = SEVERITY_MAP[sev] ?? SEVERITY_MAP.informational
            return (
              <div key={f.id} data-testid="finding-row" style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderLeft: `3px solid ${s.accent}`, borderRadius: 14,
                padding: '18px 20px', boxShadow: '0 1px 2px rgba(14,9,37,.04)',
                display: 'flex', gap: 18, alignItems: 'flex-start',
              }}>
                {/* Thumbnail — real snapshot when available, otherwise synthetic placeholder */}
                <div style={{ width: 132, height: 88, flexShrink: 0, borderRadius: 9, background: '#1A1730', backgroundImage: 'linear-gradient(115deg,#241F42 0%,#15122A 60%)', position: 'relative', overflow: 'hidden' }}>
                  {(f as AgentFinding).snapshot_url
                    ? <img data-testid="finding-snapshot" src={(f as AgentFinding).snapshot_url!} alt="snapshot" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
                        <div style={{ position: 'absolute', left: '34%', top: '52%', width: '56%', aspectRatio: '1', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${(f as typeof FALLBACK_FINDINGS[0]).blob ?? 'rgba(91,52,242,.5)'} 0%, rgba(91,52,242,0) 72%)`, filter: 'blur(5px)' }} />
                        <div style={{ position: 'absolute', left: '14%', top: '24%', right: '22%', bottom: '22%', border: '1.2px solid rgba(167,139,255,.6)', borderRadius: 4 }} />
                      </>
                  }
                  <span style={{ position: 'absolute', bottom: 5, left: 7, fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5, color: '#B6ADE0' }}>{(f as typeof FALLBACK_FINDINGS[0]).cam ?? 'CAM'}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 9 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '4px 11px', fontSize: 12, fontWeight: 600, background: s.bg, color: s.fg }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.accent }} />
                      {s.label}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, background: 'var(--primary-bg)', color: 'var(--primary-deeper)', borderRadius: 5, padding: '4px 8px' }}>
                      {f.task_type?.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)' }}>
                      {(f as typeof FALLBACK_FINDINGS[0]).zone_name ?? ''} · {(f as typeof FALLBACK_FINDINGS[0]).site_name ?? ''}
                    </span>
                    <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)' }}>
                      {timeAgo(f.created_at ?? new Date().toISOString())}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>
                    {(f as typeof FALLBACK_FINDINGS[0]).title ?? f.task_type}
                  </h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 13px' }}>
                    {(f as typeof FALLBACK_FINDINGS[0]).summary ?? ''}
                  </p>
                  <div style={{ display: 'flex', gap: 9 }}>
                    <button style={{ height: 32, padding: '0 13px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 8, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500, color: 'var(--on-surface)', cursor: 'pointer' }}>
                      Ver detalle
                    </button>
                    <button onClick={() => nav('/copilot')} style={{ height: 32, padding: '0 13px', border: '1px solid var(--primary-border)', background: 'var(--primary-bg)', borderRadius: 8, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: 'var(--primary-deeper)', cursor: 'pointer' }}>
                      Consultar al Copiloto
                    </button>
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

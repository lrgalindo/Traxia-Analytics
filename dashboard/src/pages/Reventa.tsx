import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Card } from '../components/Card'
import { cameras as camerasApi, zones as zonesApi, backoffice } from '../api/client'
import type { Camera, Zone } from '../types'

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  const arr = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(arr, b => chars[b % chars.length]).join('')
}

interface Created {
  partnerName: string
  zonesCreated: number
  password: string
}

const inp: React.CSSProperties = {
  width: '100%', height: 42, border: '1px solid var(--border)', borderRadius: 8,
  padding: '0 12px', fontSize: 13.5, color: 'var(--on-surface)',
  background: '#FBFAFE', outline: 'none',
}

const label12: React.CSSProperties = {
  display: 'block', fontSize: 12.5, fontWeight: 600,
  color: 'var(--on-surface)', marginBottom: 6,
}

export function Reventa() {
  const [allCameras, setAllCameras] = useState<Camera[]>([])
  const [allZones, setAllZones] = useState<Zone[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expiry, setExpiry] = useState('2026-12-31')
  const [noExpiry, setNoExpiry] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [created, setCreated] = useState<Created | null>(null)

  const nav = useNavigate()

  useEffect(() => {
    Promise.all([camerasApi.list(), zonesApi.listAll()])
      .then(([cams, zns]) => {
        setAllCameras(cams)
        setAllZones(zns)
      })
      .catch(() => setDataError('No se pudieron cargar las cámaras y zonas. Recarga la página.'))
      .finally(() => setLoadingData(false))
  }, [])

  function toggle(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)

    const password = generateTempPassword()
    const chosenZones = allZones.filter(z => selectedIds.has(z.id))

    try {
      const result = await backoffice.createPartner({
        name,
        admin_email: email,
        admin_password: password,
        access_expires_at: noExpiry ? undefined : `${expiry}T00:00:00Z`,
        zones: chosenZones.map(z => ({
          camera_id: z.camera_id,
          name: z.name,
          zone_type: z.zone_type,
          coordinates: z.coordinates,
        })),
      })
      setCreated({ partnerName: result.name, zonesCreated: result.zones_created, password })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setSubmitError(`No se pudo crear el partner: ${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success panel ─────────────────────────────────────────────────────────────

  if (created) {
    return (
      <div className="tx-page" style={{ maxWidth: 640 }}>
        <PageHeader eyebrow="ADMINISTRACIÓN / MONETIZACIÓN" title="Partner activado" />
        <Card>
          <p style={{ fontSize: 14, color: 'var(--on-surface)', marginBottom: 20 }}>
            <strong>{created.partnerName}</strong> fue creado con{' '}
            <strong>{created.zonesCreated}</strong> zona{created.zonesCreated !== 1 ? 's' : ''} activa{created.zonesCreated !== 1 ? 's' : ''}.
          </p>

          <div style={{ background: '#F7F5FE', border: '1px solid var(--primary-border)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 10 }}>
              CONTRASEÑA TEMPORAL DEL PARTNER
            </p>
            <code data-testid="reventa-temp-password" style={{
              display: 'block', fontSize: 15, fontFamily: "'IBM Plex Mono', monospace",
              color: 'var(--primary-deeper)', wordBreak: 'break-all', userSelect: 'all',
            }}>
              {created.password}
            </code>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.6 }}>
            ⚠️ Comunica esta contraseña al administrador del partner por un canal seguro
            (no por correo sin cifrar). No la volverás a ver en el sistema.
          </p>

          <button
            data-testid="reventa-goto-partners"
            onClick={() => nav('/partners')}
            style={{
              height: 42, padding: '0 20px', border: 0, background: 'var(--primary)',
              color: '#fff', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5,
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            Ir a partners activos →
          </button>
        </Card>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────────

  const cameraMap = new Map(allCameras.map(c => [c.id, c.name]))
  const zonesByCamera: Record<string, Zone[]> = {}
  for (const z of allZones) {
    if (!zonesByCamera[z.camera_id]) zonesByCamera[z.camera_id] = []
    zonesByCamera[z.camera_id].push(z)
  }

  return (
    <div className="tx-page" style={{ maxWidth: 900 }}>
      <PageHeader
        eyebrow="ADMINISTRACIÓN / MONETIZACIÓN"
        title="Módulo de reventa"
        description="Comparte datos de tus zonas con una marca o proveedor, en un solo paso."
      />

      <Card style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit}>
          {/* Partner identity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={label12}>Nombre del partner</label>
              <input
                type="text"
                placeholder="Ej. Lácteos CA"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inp}
                required
              />
            </div>
            <div>
              <label style={label12}>Correo del administrador</label>
              <input
                type="email"
                placeholder="admin@partner.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inp}
                required
              />
            </div>
          </div>

          {/* Zone selector */}
          <label style={{ ...label12, marginBottom: 12 }}>Zonas a compartir</label>
          {dataError ? (
            <p style={{ fontSize: 13, color: 'var(--error, #c0392b)', marginBottom: 16 }}>{dataError}</p>
          ) : loadingData ? (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Cargando cámaras y zonas…</p>
          ) : allZones.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              No hay zonas configuradas. Ve al módulo de{' '}
              <button type="button" onClick={() => nav('/zones')} style={{ border: 0, background: 'none', color: 'var(--primary)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                Zonas / Cámaras
              </button>{' '}
              para crearlas primero.
            </p>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
              {Object.entries(zonesByCamera).map(([cameraId, czones], idx) => (
                <div key={cameraId} style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ padding: '8px 14px', background: '#F7F5FE', fontSize: 11.5, fontWeight: 700, letterSpacing: '.07em', color: 'var(--muted)' }}>
                    {cameraMap.get(cameraId) ?? cameraId}
                  </div>
                  {czones.map(z => (
                    <label key={z.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer', borderTop: '1px solid var(--border)', background: selectedIds.has(z.id) ? '#FBFAFE' : 'transparent' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(z.id)}
                        onChange={() => toggle(z.id)}
                        style={{ width: 15, height: 15, accentColor: 'var(--primary)', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 13, color: 'var(--on-surface)', flex: 1 }}>{z.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--border)', borderRadius: 4, padding: '2px 7px' }}>
                        {z.zone_type}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Expiry */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'end', marginBottom: 24 }}>
            <div>
              <label style={label12}>Fecha de expiración del acceso</label>
              <input
                type="date"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                disabled={noExpiry}
                style={{ ...inp, opacity: noExpiry ? 0.5 : 1 }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 42, fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={noExpiry}
                onChange={e => setNoExpiry(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
              />
              Acceso indefinido, sin expiración
            </label>
          </div>

          {submitError && (
            <p style={{ fontSize: 13, color: 'var(--error, #c0392b)', marginBottom: 14 }}>{submitError}</p>
          )}

          <button
            type="submit"
            data-testid="reventa-submit-btn"
            disabled={submitting || !name || !email || selectedIds.size === 0}
            style={{
              height: 44, padding: '0 22px', border: 0,
              background: submitting || !name || !email || selectedIds.size === 0
                ? 'var(--primary-border)' : 'var(--primary)',
              color: '#fff', borderRadius: 9, fontFamily: 'inherit',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(91,52,242,.24)',
            }}
          >
            {submitting ? 'Activando…' : 'Activar acceso del partner'}
          </button>
        </form>
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', borderRadius: 10, padding: '12px 16px' }}>
        <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Ya tienes partners con acceso vigente.</span>
        <button
          type="button"
          onClick={() => nav('/partners')}
          style={{ border: 0, background: 'transparent', color: 'var(--primary)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
        >
          Ver partners activos →
        </button>
      </div>
    </div>
  )
}

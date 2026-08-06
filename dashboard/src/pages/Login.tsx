import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Step = 'credentials' | 'mfa'
type RoleUI = 'tenant_admin' | 'operator' | 'partner'

interface MfaContext { factor_id: string; challenge_id: string }

const API_BASE = `${import.meta.env.VITE_API_URL ?? ''}/v1`
const ROLES: { id: RoleUI; label: string; sub: string }[] = [
  { id: 'tenant_admin', label: 'Tenant Admin', sub: 'Acceso completo' },
  { id: 'operator', label: 'Operador Regional', sub: 'Sede(s) asignadas' },
  { id: 'partner', label: 'Partner', sub: 'Zonas compartidas' },
]

export function Login() {
  const [step, setStep] = useState<Step>('credentials')
  const [role, setRole] = useState<RoleUI>('tenant_admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totp, setTotp] = useState('')
  const [mfaCtx, setMfaCtx] = useState<MfaContext | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) { setError('Ingresa email y contraseña'); return }
    setError(''); setLoading(true)
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await resp.json()
      if (resp.status === 401 && data?.detail?.code === 'mfa_required') {
        const factors: Array<{ id: string }> = data.detail.factors ?? []
        const challenge = data.detail.amr_challenge ?? {}
        setMfaCtx({ factor_id: factors[0]?.id ?? '', challenge_id: challenge.id ?? '' })
        setStep('mfa'); return
      }
      if (!resp.ok) { setError(data?.detail?.message ?? data?.detail ?? 'Error de autenticación'); return }
      const token = data.access_token
      if (!token) { setError('Respuesta inesperada del servidor'); return }
      localStorage.setItem('traxia_token', token)
      nav('/resumen', { replace: true })
    } catch { setError('No se pudo conectar con el servidor') }
    finally { setLoading(false) }
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault()
    if (!totp.trim() || totp.trim().length !== 6) { setError('Código TOTP de 6 dígitos requerido'); return }
    if (!mfaCtx) return
    setError(''); setLoading(true)
    try {
      const resp = await fetch(`${API_BASE}/auth/mfa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factor_id: mfaCtx.factor_id, challenge_id: mfaCtx.challenge_id, code: totp.trim() }),
      })
      const data = await resp.json()
      if (!resp.ok) { setError(data?.detail ?? 'Código TOTP incorrecto'); return }
      const token = data.access_token
      if (!token) { setError('Respuesta inesperada del servidor'); return }
      localStorage.setItem('traxia_token', token)
      nav('/resumen', { replace: true })
    } catch { setError('No se pudo conectar con el servidor') }
    finally { setLoading(false) }
  }

  const inp: React.CSSProperties = {
    width: '100%', height: 42, border: '1px solid var(--border)',
    borderRadius: 8, padding: '0 12px', fontSize: 13.5,
    color: 'var(--on-surface)', background: '#FBFAFE', outline: 'none',
    marginTop: 5, marginBottom: 14,
  }
  const primaryBtn: React.CSSProperties = {
    width: '100%', height: 44, border: 0,
    background: loading ? 'var(--primary-border)' : 'var(--primary)',
    color: '#fff', borderRadius: 9, fontSize: 14, fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: '0 6px 18px rgba(91,52,242,.24)',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left brand panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg,#0E0925 0%,#1E1145 60%,#2A1A6E 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(150deg,#7C5BFF,#4C22E0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
            </svg>
          </span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 21, fontWeight: 700, color: '#fff' }}>Traxia Analytics</span>
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1.22, marginBottom: 18, letterSpacing: '-.02em' }}>
          Inteligencia espacial<br />para tu operación
        </h1>
        <p style={{ fontSize: 15, color: '#B6ADE0', lineHeight: 1.7, maxWidth: 400, margin: 0 }}>
          Analítica en tiempo real desde tus cámaras CCTV existentes. Sin biometría. Sin almacenar video.
        </p>
        <div style={{ display: 'flex', gap: 32, marginTop: 56 }}>
          {[['14', 'SEDES'], ['47', 'CÁMARAS'], ['3', 'PARTNERS']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: '#fff' }}>{n}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: '#8B86A3', letterSpacing: '.12em', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: 480, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 52px', background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}>
        {step === 'credentials' ? (
          <form onSubmit={handleCredentials} data-testid="login-form">
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: '.12em', color: 'var(--mono-muted)', marginBottom: 8 }}>
              ACCESO AL PANEL
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 28 }}>
              Iniciar sesión
            </h2>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {ROLES.map(r => {
                const on = role === r.id
                return (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)} style={{
                    flex: 1, padding: '9px 6px', border: `1px solid ${on ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 9, background: on ? 'var(--primary-bg)' : 'transparent', cursor: 'pointer', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: on ? 600 : 500, color: on ? 'var(--primary-deeper)' : 'var(--muted)', lineHeight: 1.3 }}>{r.label}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: on ? 'var(--primary)' : 'var(--mono-muted)', marginTop: 2 }}>{r.sub}</div>
                  </button>
                )
              })}
            </div>

            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)' }}>Email</label>
            <input data-testid="email-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="usuario@empresa.com" autoComplete="email" style={inp} />

            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)' }}>Contraseña</label>
            <input data-testid="password-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password" style={inp} />

            {error && (
              <p style={{ color: 'var(--error-fg)', fontSize: 13, margin: '0 0 14px', padding: '9px 12px', background: 'var(--error-bg)', borderRadius: 8, border: '1px solid var(--error-border)' }} data-testid="login-error">
                {error}
              </p>
            )}
            <button type="submit" data-testid="login-submit" style={primaryBtn} disabled={loading}>
              {loading ? 'Verificando…' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfa} data-testid="mfa-form">
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: '.12em', color: 'var(--mono-muted)', marginBottom: 8 }}>
              VERIFICACIÓN EN DOS PASOS
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
              Código de autenticación
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 28 }}>
              Ingresa el código de 6 dígitos de tu app de autenticación.
            </p>
            <input data-testid="totp-input" type="text" inputMode="numeric" maxLength={6}
              value={totp} onChange={e => setTotp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000" autoComplete="one-time-code"
              style={{ ...inp, fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, letterSpacing: 12, textAlign: 'center' }} />
            {error && (
              <p style={{ color: 'var(--error-fg)', fontSize: 13, margin: '0 0 14px', padding: '9px 12px', background: 'var(--error-bg)', borderRadius: 8, border: '1px solid var(--error-border)' }} data-testid="login-error">
                {error}
              </p>
            )}
            <button type="submit" data-testid="mfa-submit" style={primaryBtn} disabled={loading}>
              {loading ? 'Verificando…' : 'Confirmar código'}
            </button>
            <button type="button" data-testid="mfa-back" onClick={() => { setStep('credentials'); setError('') }}
              style={{ ...primaryBtn, background: 'transparent', color: 'var(--muted)', boxShadow: 'none', border: '1px solid var(--border)', marginTop: 10 }}>
              Volver
            </button>
          </form>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 36, padding: '11px 14px', background: 'var(--primary-bg)', borderRadius: 10, border: '1px solid var(--primary-border)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 5.5v6c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5v-6L12 2z"/>
          </svg>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--primary-deeper)', lineHeight: 1.5 }}>
            Sin biometría · Video procesado localmente en el edge
          </span>
        </div>
      </div>
    </div>
  )
}

import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Nav } from './Nav'
import { useAuth } from '../hooks/useAuth'

export function Layout() {
  const { isAuthenticated, raw } = useAuth()
  const nav = useNavigate()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  function logout() {
    localStorage.removeItem('traxia_token')
    nav('/login', { replace: true })
  }

  // Decode org label from JWT (best-effort)
  const orgLabel = 'Retail SA'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Left sidebar */}
      <aside style={{
        width: 230, flexShrink: 0, background: 'var(--surface)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', position: 'fixed', top: 0,
        bottom: 0, left: 0, zIndex: 40, overflowY: 'auto',
      }}>
        {/* Logo area */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(150deg,#7C5BFF,#4C22E0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
              </svg>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--ink)', lineHeight: 1.2 }}>
                Traxia
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--mono-muted)', letterSpacing: '.06em' }}>
                Analytics
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '12px 0' }}>
          <Nav />
        </div>

        {/* User footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
            <span style={{
              width: 30, height: 30, borderRadius: 8, background: 'var(--primary-bg)',
              color: 'var(--primary-deeper)', fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              {orgLabel.slice(0, 2).toUpperCase()}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {orgLabel}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: 'var(--mono-muted)', letterSpacing: '.06em' }}>
                TENANT ADMIN
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%', height: 30, border: '1px solid var(--border)',
              borderRadius: 7, background: 'transparent', fontSize: 12,
              color: 'var(--muted)', cursor: 'pointer', textAlign: 'center',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 230, padding: '28px 32px', minHeight: '100vh', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

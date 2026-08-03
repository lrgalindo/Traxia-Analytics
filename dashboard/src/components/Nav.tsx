/**
 * Role-aware navigation sidebar.
 *
 * Implements the SDD §4.1 matrix across four sections:
 *
 *   ANALÍTICA
 *     Resumen, Tráfico, Permanencia, Colas, Mapa de calor
 *       → Tenant Admin ✅ · Operator ✅ · Partner ✅
 *     Comparativo (adminOnly)
 *       → Tenant Admin ✅ · Operator ❌ · Partner ❌
 *
 *   OPERACIÓN  (all adminOnly)
 *     Sedes, Zonas / Cámaras, Partners
 *       → Tenant Admin ✅ · Operator ❌ · Partner ❌
 *
 *   ADMINISTRACIÓN  (all adminOnly)
 *     Backoffice, Usuarios, Reventa, Motor de acciones
 *       → Tenant Admin ✅ · Operator ❌ · Partner ❌
 *
 *   INTELIGENCIA
 *     Copiloto, Hallazgos, Exportar
 *       → Tenant Admin ✅ · Operator ✅ · Partner ✅
 *
 * partnerHidden: true  → hidden for Partners, visible for Operator and Admin
 * adminOnly: true      → hidden for Operator AND Partner, visible only for Admin
 * (no flag)            → visible to all authenticated roles
 *
 * Fleet management y Facturación están fuera del alcance del MLP — no existen
 * como ítems de nav en ningún rol (ausentes del DOM, no solo ocultos con CSS).
 */
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface NavItem {
  label: string
  href: string
  testId: string
  /** Hidden for Partners; Operators can still see it */
  partnerHidden?: boolean
  /** Hidden for Operators and Partners; Tenant Admin only */
  adminOnly?: boolean
}

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'ANALÍTICA',
    items: [
      { label: 'Resumen',       href: '/resumen', testId: 'nav-resumen' },
      { label: 'Tráfico',       href: '/traffic', testId: 'nav-traffic' },
      { label: 'Permanencia',   href: '/dwell',   testId: 'nav-dwell' },
      { label: 'Colas',         href: '/colas',   testId: 'nav-colas' },
      { label: 'Mapa de calor', href: '/heatmap',    testId: 'nav-heatmap' },
      { label: 'Comparativo',  href: '/comparison',  testId: 'nav-comparison', adminOnly: true },
    ],
  },
  {
    title: 'OPERACIÓN',
    items: [
      { label: 'Sedes',          href: '/sedes',    testId: 'nav-sedes',    adminOnly: true },
      { label: 'Zonas / Cámaras', href: '/zones',   testId: 'nav-zones',    adminOnly: true },
      { label: 'Partners',       href: '/partners', testId: 'nav-partners', adminOnly: true },
    ],
  },
  {
    title: 'ADMINISTRACIÓN',
    items: [
      { label: 'Backoffice',       href: '/backoffice', testId: 'nav-backoffice', adminOnly: true },
      { label: 'Usuarios',         href: '/users',      testId: 'nav-users',      adminOnly: true },
      { label: 'Reventa',          href: '/reventa',    testId: 'nav-reventa',    adminOnly: true },
      { label: 'Motor de acciones', href: '/actions',   testId: 'nav-actions',    adminOnly: true },
    ],
  },
  {
    title: 'INTELIGENCIA',
    items: [
      { label: 'Copiloto',  href: '/copilot',  testId: 'nav-copilot' },
      { label: 'Hallazgos', href: '/findings', testId: 'nav-findings' },
      { label: 'Exportar',  href: '/export',   testId: 'nav-export' },
    ],
  },
]

export function Nav() {
  const { isPartner, isAdmin } = useAuth()
  const { pathname } = useLocation()

  return (
    <nav aria-label="Sidebar">
      {SECTIONS.map(section => {
        const visible = section.items.filter(item => {
          if (item.adminOnly && !isAdmin) return false
          if (item.partnerHidden && isPartner) return false
          return true
        })
        if (!visible.length) return null

        return (
          <div key={section.title} style={{ marginBottom: 6 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5,
              letterSpacing: '.12em', color: 'var(--mono-muted)',
              padding: '10px 18px 5px', fontWeight: 500,
            }}>
              {section.title}
            </div>
            {visible.map(item => {
              const active = pathname === item.href || (item.href === '/resumen' && pathname === '/')
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  data-testid={item.testId}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '8px 14px', margin: '1px 8px',
                    borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 500,
                    color: active ? 'var(--primary-deeper)' : 'var(--muted)',
                    background: active ? 'var(--primary-bg)' : 'transparent',
                    textDecoration: 'none', transition: 'background .12s, color .12s',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = '#F7F5FE'
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}

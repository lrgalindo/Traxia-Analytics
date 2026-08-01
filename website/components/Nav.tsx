'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const solucionesLinks = [
  { href: '/retail', label: 'Retail' },
  { href: '/logistica', label: 'Logística' },
  { href: '/banca', label: 'Banca' },
  { href: '/manufactura', label: 'Manufactura' },
  { href: '/hospitales', label: 'Hospitales' },
  { href: '/concesionarias', label: 'Concesionarias' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-container-max mx-auto px-gutter flex items-center justify-between h-[80px]">
        <Link href="/" className="font-display font-bold text-xl text-on-surface tracking-tight">
          Traxia Analytics
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button className="flex items-center gap-1 text-body-md text-on-surface-variant hover:text-on-surface transition-colors">
              Soluciones
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-2">
                {solucionesLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 text-body-sm hover:bg-surface-container-low transition-colors ${isActive(link.href) ? 'text-primary font-medium' : 'text-on-surface-variant'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/nosotros"
            className={`text-body-md transition-colors ${isActive('/nosotros') ? 'text-primary font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Nosotros
          </Link>

          <Link
            href="/precios"
            className={`text-body-md transition-colors ${isActive('/precios') ? 'text-primary font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Precios
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 text-body-sm font-medium text-on-surface-variant bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
            Iniciar Sesión
          </button>
          <button className="px-4 py-2 text-body-sm font-medium text-on-primary bg-primary rounded-lg hover:bg-primary/90 transition-colors">
            Agendar Demo
          </button>
        </div>

        <button
          className="md:hidden p-2 text-on-surface-variant"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-border-subtle">
          <div className="px-gutter py-4 flex flex-col gap-1">
            <p className="text-label-caps font-label-caps text-text-muted uppercase px-3 py-1">Soluciones</p>
            {solucionesLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-body-md transition-colors ${isActive(link.href) ? 'text-primary bg-primary-fixed font-medium' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border-subtle my-2" />
            <Link
              href="/nosotros"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-body-md transition-colors ${isActive('/nosotros') ? 'text-primary bg-primary-fixed font-medium' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              Nosotros
            </Link>
            <Link
              href="/precios"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-body-md transition-colors ${isActive('/precios') ? 'text-primary bg-primary-fixed font-medium' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              Precios
            </Link>
            <div className="border-t border-border-subtle my-2" />
            <div className="flex flex-col gap-2 px-3">
              <button className="w-full py-2.5 text-body-sm font-medium text-on-surface-variant bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                Iniciar Sesión
              </button>
              <button className="w-full py-2.5 text-body-sm font-medium text-on-primary bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                Agendar Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const industries = [
  { href: '/retail', label: 'Retail', icon: 'storefront', desc: 'Heatmaps, tráfico y conversión por zona' },
  { href: '/logistica', label: 'Logística', icon: 'local_shipping', desc: 'Dwell de andén, flujo de bodega' },
  { href: '/banca', label: 'Banca', icon: 'account_balance', desc: 'Colas, tiempos de espera y apertura' },
  { href: '/manufactura', label: 'Manufactura', icon: 'precision_manufacturing', desc: 'EPP, zonas restringidas, seguridad' },
  { href: '/hospitales', label: 'Hospitales', icon: 'local_hospital', desc: 'Flujo de pacientes y tiempos de espera' },
  { href: '/concesionarias', label: 'Concesionarias', icon: 'directions_car', desc: 'Conversión de visitantes, showroom' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-container-max mx-auto px-6 flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
            </svg>
          </div>
          <span className="font-bold text-[17px] tracking-tight text-on-surface">Traxia Analytics</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Industries dropdown */}
          <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-gray-50 transition-colors">
              Industrias
              <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[520px] bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
                <div className="grid grid-cols-2 gap-1">
                  {industries.map((ind) => (
                    <Link key={ind.href} href={ind.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="w-8 h-8 bg-primary-fixed rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">{ind.icon}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors">{ind.label}</p>
                        <p className="text-[12px] text-on-surface-variant mt-0.5 leading-tight">{ind.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/nosotros" className={`px-3 py-2 text-[15px] font-medium rounded-lg transition-colors ${pathname === '/nosotros' ? 'text-primary bg-primary-fixed' : 'text-on-surface-variant hover:text-on-surface hover:bg-gray-50'}`}>
            Nosotros
          </Link>
          <Link href="/precios" className={`px-3 py-2 text-[15px] font-medium rounded-lg transition-colors ${pathname === '/precios' ? 'text-primary bg-primary-fixed' : 'text-on-surface-variant hover:text-on-surface hover:bg-gray-50'}`}>
            Precios
          </Link>
        </div>

        {/* CTA buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Link href="https://traxia-analytics.pages.dev" className="px-4 py-2 text-[14px] font-medium text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-gray-50 transition-colors">
            Acceder
          </Link>
          <Link href="/#demo" className="px-4 py-2 text-[14px] font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-blue">
            Agendar Demo
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="lg:hidden p-2 text-on-surface-variant rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-2">Industrias</p>
          <div className="grid grid-cols-2 gap-1 mb-4">
            {industries.map((ind) => (
              <Link key={ind.href} href={ind.href} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-primary text-[18px]">{ind.icon}</span>
                <span className="text-[14px] font-medium text-on-surface">{ind.label}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
            <Link href="/nosotros" className="px-3 py-2.5 text-[15px] font-medium text-on-surface rounded-lg hover:bg-gray-50 transition-colors">Nosotros</Link>
            <Link href="/precios" className="px-3 py-2.5 text-[15px] font-medium text-on-surface rounded-lg hover:bg-gray-50 transition-colors">Precios</Link>
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex flex-col gap-2">
            <Link href="https://traxia-analytics.pages.dev" className="w-full py-2.5 text-[14px] font-medium text-center text-on-surface border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Acceder
            </Link>
            <Link href="/#demo" className="w-full py-2.5 text-[14px] font-semibold text-center text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
              Agendar Demo Gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const industries = [
  { href: '/retail', label: 'Retail', icon: 'storefront', desc: 'Heatmaps, zonas calientes, conversión' },
  { href: '/logistica', label: 'Logística', icon: 'local_shipping', desc: 'Dwell de andén, flujo de bodega' },
  { href: '/banca', label: 'Banca', icon: 'account_balance', desc: 'Colas, tiempos de espera, apertura' },
  { href: '/manufactura', label: 'Manufactura', icon: 'precision_manufacturing', desc: 'EPP, zonas restringidas, seguridad' },
  { href: '/hospitales', label: 'Hospitales', icon: 'local_hospital', desc: 'Flujo de pacientes, tiempos de espera' },
  { href: '/concesionarias', label: 'Concesionarias', icon: 'directions_car', desc: 'Visitantes, showroom, conversión' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Homepage is now light; vertical pages and nosotros/precios use dark heroes
  const isDark = pathname.startsWith('/retail') || pathname.startsWith('/logistica') || pathname.startsWith('/banca') || pathname.startsWith('/manufactura') || pathname.startsWith('/hospitales') || pathname.startsWith('/concesionarias') || pathname.startsWith('/nosotros') || pathname.startsWith('/precios')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const navBase = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
    : isDark
      ? 'bg-transparent border-b border-white/[0.06]'
      : 'bg-white border-b border-slate-200/80'

  const textColor = !scrolled && isDark ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-900'
  const logoColor = !scrolled && isDark ? 'text-white' : 'text-slate-900'
  const activeColor = !scrolled && isDark ? 'text-white bg-white/10' : 'text-primary bg-primary-fixed'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}>
      <div className="max-w-container-max mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-blue-sm" style={{background:'linear-gradient(135deg,#6366f1 0%,#7c3aed 100%)'}}>

            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
            </svg>
          </div>
          <span className={`font-bold text-[15px] tracking-tight transition-colors ${logoColor}`}>
            Traxia Analytics
          </span>
        </Link>

        {/* Desktop center nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={`flex items-center gap-1 px-3 py-1.5 text-[14px] font-medium rounded-lg transition-colors ${textColor}`}>
              Soluciones
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              /* transparent bridge that covers the gap between button and panel */
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] pt-2">
              <div className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-lg p-3">
                <div className="grid grid-cols-2 gap-0.5">
                  {industries.map((ind) => (
                    <Link key={ind.href} href={ind.href}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-primary-fixed rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[17px]">{ind.icon}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800 group-hover:text-primary transition-colors">{ind.label}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5 leading-tight">{ind.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              </div>
            )}
          </div>

          <Link href="/nosotros" className={`px-3 py-1.5 text-[14px] font-medium rounded-lg transition-colors ${pathname === '/nosotros' ? activeColor : textColor}`}>
            Nosotros
          </Link>
          <Link href="/precios" className={`px-3 py-1.5 text-[14px] font-medium rounded-lg transition-colors ${pathname === '/precios' ? activeColor : textColor}`}>
            Precios
          </Link>
        </div>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="https://traxia-analytics.pages.dev"
            className={`px-3.5 py-1.5 text-[14px] font-medium rounded-lg transition-colors ${!scrolled && isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/#demo"
            className="btn-gradient px-4 py-2 text-[13px] rounded-lg shadow-blue-sm"
          >
            Agendar Demo
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${!scrolled && isDark ? 'text-white/70 hover:bg-white/8' : 'text-slate-500 hover:bg-slate-100'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
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
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 px-2 mb-2">Soluciones</p>
          <div className="grid grid-cols-2 gap-0.5 mb-3">
            {industries.map((ind) => (
              <Link key={ind.href} href={ind.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-primary text-[17px]">{ind.icon}</span>
                <span className="text-[14px] font-medium text-slate-800">{ind.label}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-0.5">
            <Link href="/nosotros" className="px-3 py-2.5 text-[14px] font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">Nosotros</Link>
            <Link href="/precios" className="px-3 py-2.5 text-[14px] font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">Precios</Link>
          </div>
          <div className="border-t border-slate-100 mt-3 pt-3 flex flex-col gap-2">
            <Link href="https://traxia-analytics.pages.dev" className="w-full py-2.5 text-center text-[14px] font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/#demo" className="btn-gradient w-full py-2.5 text-center text-[14px] rounded-xl">
              Agendar Demo Gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

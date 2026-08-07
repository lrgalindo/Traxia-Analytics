import Link from 'next/link'

const industries = [
  { href: '/retail', label: 'Retail' },
  { href: '/logistica', label: 'Logística' },
  { href: '/banca', label: 'Banca' },
  { href: '/manufactura', label: 'Manufactura' },
  { href: '/hospitales', label: 'Hospitales' },
  { href: '/concesionarias', label: 'Concesionarias' },
]

export default function Footer() {
  return (
    <footer className="bg-hero border-t border-hero-border">
      <div className="max-w-container-max mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-gradient flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
                </svg>
              </div>
              <span className="font-bold text-[15px] text-white">Traxia Analytics</span>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed mb-5">
              AI-Native Spatial Intelligence para operaciones B2B en LATAM.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="live-dot inline-block" />
              <span className="text-[12px] text-emerald-400 font-medium">API online</span>
            </div>
          </div>

          {/* Soluciones */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-5">Soluciones</p>
            <ul className="space-y-3">
              {industries.map((ind) => (
                <li key={ind.href}>
                  <Link href={ind.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
                    {ind.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-5">Empresa</p>
            <ul className="space-y-3">
              {[
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/precios', label: 'Precios' },
                { href: '/#demo', label: 'Agendar Demo' },
                { href: 'https://traxia-analytics.pages.dev', label: 'Acceder al Dashboard' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tecnología */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-5">Tecnología</p>
            <ul className="space-y-3">
              {[
                'Edge AI Processing',
                'Zero Biometrics Policy',
                'RTSP / ONVIF Integration',
                'Privacy by Design',
              ].map((item) => (
                <li key={item} className="text-[14px] text-white/40">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-hero-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/25">
            © 2026 Traxia Analytics. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[12px] text-white/25 hover:text-white/60 transition-colors">Privacidad</Link>
            <Link href="#" className="text-[12px] text-white/25 hover:text-white/60 transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-auto">
      <div className="max-w-container-max mx-auto px-gutter py-xxl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl">
          <div className="md:col-span-1">
            <p className="font-display font-bold text-lg text-white mb-2">Traxia Analytics</p>
            <p className="text-body-sm text-inverse-on-surface/70">
              AI-Native Spatial Intelligence para empresas B2B en LATAM y USA.
            </p>
          </div>

          <div>
            <p className="text-label-caps font-label-caps text-inverse-on-surface/50 uppercase tracking-widest mb-4">Soluciones</p>
            <ul className="flex flex-col gap-3">
              <li><Link href="/retail" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Retail</Link></li>
              <li><Link href="/logistica" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Logística</Link></li>
              <li><Link href="/banca" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Banca</Link></li>
              <li><Link href="/manufactura" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Manufactura</Link></li>
              <li><Link href="/hospitales" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Hospitales</Link></li>
              <li><Link href="/concesionarias" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Concesionarias</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-label-caps font-label-caps text-inverse-on-surface/50 uppercase tracking-widest mb-4">Tecnología</p>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Hardware-Free Tech</Link></li>
              <li><Link href="#" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Zero Biometrics Policy</Link></li>
              <li><Link href="/nosotros" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/precios" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Precios</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-label-caps font-label-caps text-inverse-on-surface/50 uppercase tracking-widest mb-4">Legal</p>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Privacy Center</Link></li>
              <li><Link href="#" className="text-body-sm text-inverse-on-surface/70 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-xxl pt-xl">
          <p className="text-body-sm text-inverse-on-surface/50 text-center">
            © 2024 Traxia Analytics. AI-Native Spatial Intelligence.
          </p>
        </div>
      </div>
    </footer>
  )
}

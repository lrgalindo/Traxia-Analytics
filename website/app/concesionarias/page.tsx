import type { Metadata } from 'next'
import Link from 'next/link'
import VerticalHero from '@/components/VerticalHero'

export const metadata: Metadata = {
  title: 'Concesionarias — Inteligencia de Showroom',
  description: 'Convierte tu showroom en datos de negocio. Analítica de visitantes, tiempo de permanencia y conversión — con las cámaras que ya tienes.',
}

export default function ConcesionariasPage() {
  return (
    <main>
      <VerticalHero
        badge="Concesionarias · Inteligencia Espacial"
        icon="directions_car"
        h1={<>Convierte tu showroom en <span className="gradient-text">datos de negocio.</span></>}
        subtitle="Descubre qué vehículos generan más interés, cuánto tiempo pasan los visitantes en cada zona y cómo optimizar la disposición de tu showroom para maximizar conversiones."
        stats={[
          { value: '0', label: 'Hardware nuevo' },
          { value: '0', label: 'Biométricos' },
          { value: '< 24 h', label: 'Go-live' },
        ]}
        secondaryCta="Ver Precios"
        liveStat="47"
        liveLabel="visitantes hoy — showroom norte"
      />

      {/* Live metrics */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Telemetría en Vivo</p>
            <h2 className="text-headline-lg text-on-surface">Métricas de showroom en tiempo real</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: 'directions_walk', label: 'Visitantes Hoy', value: '47', unit: '', trend: '+18% vs ayer', up: true },
              { icon: 'schedule', label: 'Tiempo Promedio en Showroom', value: '12.4', unit: 'min', trend: 'Alta intención de compra', up: true },
              { icon: 'star', label: 'Zona de Mayor Interés', value: 'SUV', unit: '', trend: 'Zona C — 4.7 min avg', up: true },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-primary text-[20px]">{m.icon}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-500">EN VIVO</span>
                  </div>
                </div>
                <p className="text-4xl font-black text-on-surface mb-1">
                  {m.value}<span className="text-lg text-on-surface-variant font-normal ml-1">{m.unit}</span>
                </p>
                <p className="text-[14px] text-on-surface-variant mb-3">{m.label}</p>
                <p className="text-[12px] font-medium text-emerald-500">{m.trend}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-on-surface-variant/50 mt-5">Ejemplo ilustrativo — datos de muestra, no de cliente real</p>
        </div>
      </section>

      {/* Integration */}
      <section className="py-24 bg-surface-alt">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Integración</p>
              <h2 className="text-headline-lg text-on-surface mb-5">Hardware-free para tu concesionaria</h2>
              <p className="text-body-lg text-on-surface-variant mb-7 leading-relaxed">
                Traxia se conecta a tus cámaras CCTV existentes mediante RTSP. Sin obras, sin instalaciones complejas, sin reemplazar equipos.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Compatible con cualquier cámara IP con RTSP',
                  'Procesamiento en el edge — video no sale del local',
                  'Dashboard web accesible desde cualquier dispositivo',
                  'Alertas de oportunidad de venta en tiempo real',
                  'Reportes semanales automáticos por email',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Terminal */}
            <div className="bg-hero rounded-2xl border border-hero-border overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-hero-border">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <span className="ml-3 text-[11px] text-white/20 font-mono">traxia-edge — concesionaria-norte</span>
              </div>
              <div className="p-5 font-mono text-[12px] space-y-1">
                <p><span className="text-emerald-400">$</span> <span className="text-white/70">traxia connect --rtsp rtsp://192.168.1.100/cam1</span></p>
                <p className="text-white/30">Connecting to camera feed...</p>
                <p className="text-emerald-400">✓ Camera connected (1920×1080@30fps)</p>
                <p><span className="text-emerald-400">$</span> <span className="text-white/70">traxia start --model showroom-v3</span></p>
                <p className="text-white/30">Loading spatial AI model...</p>
                <p className="text-emerald-400">✓ Model loaded (edge inference active)</p>
                <p className="text-white/30">✓ Zones: Entrada, SUV, Sedán, Pickup</p>
                <p className="text-emerald-400">✓ Dashboard live: traxia.io/d/showroom</p>
                <p className="text-white/20 mt-3"># Video permanece en tus instalaciones</p>
                <p className="text-white/20"># Solo metadatos anonimizados → cloud</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-20 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-4">Transforma visitas en ventas con datos reales.</h2>
          <p className="text-body-lg text-white/50 mb-8 max-w-xl mx-auto">Agenda una demo para tu concesionaria y ve el sistema funcionando en vivo.</p>
          <Link href="/#demo" className="btn-gradient inline-flex px-8 py-4 rounded-xl text-[15px]">
            Agendar Demo Gratuita
          </Link>
        </div>
      </section>
    </main>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Concesionarias',
  description: 'Convierte tu Showroom en Datos de Negocio. Analítica de visitantes, tiempo de permanencia y conversión para concesionarias automotrices.',
}

export default function ConcesionariasPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">directions_car</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">Automotive Intelligence</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Convierte tu Showroom en Datos de Negocio.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg">
                Descubre qué vehículos generan más interés, cuánto tiempo pasan los visitantes en cada zona y cómo optimizar la disposición de tu showroom para maximizar conversiones.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                  Agendar Demo
                </button>
                <button className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                  Ver Precios
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-inverse-surface rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-inverse-primary text-5xl">showroom</span>
                  </div>
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">SHOWROOM INTELLIGENCE — EN VIVO</p>
                </div>
                <div className="absolute top-4 left-4 bg-success/20 border border-success/40 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success text-label-caps font-label-caps">EN VIVO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Telemetría en Vivo</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Métricas de Showroom en Tiempo Real</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">directions_walk</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">47</p>
              <p className="text-body-md text-on-surface-variant mt-1">Visitantes Hoy</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_up</span>
                +18% vs ayer
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">12.4<span className="text-headline-md text-on-surface-variant"> min</span></p>
              <p className="text-body-md text-on-surface-variant mt-1">Tiempo Promedio en Showroom</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_up</span>
                Alta intención de compra
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">star</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">SUV</p>
              <p className="text-body-md text-on-surface-variant mt-1">Zona de Mayor Interés</p>
              <p className="text-body-sm text-primary mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">location_on</span>
                Zona C — 4.7 min avg
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Integración</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
                Analítica Hardware-Free para tu Concesionaria
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-6">
                Traxia se conecta a tus cámaras CCTV existentes mediante RTSP. Sin obras, sin instalaciones complejas, sin reemplazar equipos.
              </p>
              <ul className="flex flex-col gap-4 mb-8">
                {[
                  'Compatible con cualquier cámara IP con RTSP',
                  'Procesamiento en el edge — video no sale del local',
                  'Dashboard web accesible desde cualquier dispositivo',
                  'Alertas de oportunidad de venta en tiempo real',
                  'Reportes semanales automáticos por email',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-success text-base mt-0.5">check_circle</span>
                    <span className="text-body-md text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-inverse-surface rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-error/60" />
                <div className="w-3 h-3 rounded-full bg-[#FBBF24]/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="text-inverse-on-surface/40 text-code-data font-code-data text-xs ml-2">traxia-edge — concesionaria-norte</span>
              </div>
              <div className="font-code-data text-code-data space-y-1">
                <p><span className="text-success">$</span> <span className="text-inverse-on-surface">traxia connect --rtsp rtsp://192.168.1.100/cam1</span></p>
                <p className="text-inverse-on-surface/50">Connecting to camera feed...</p>
                <p className="text-success">✓ Camera connected (1920x1080@30fps)</p>
                <p><span className="text-success">$</span> <span className="text-inverse-on-surface">traxia start --model showroom-v3</span></p>
                <p className="text-inverse-on-surface/50">Loading spatial AI model...</p>
                <p className="text-success">✓ Model loaded (edge inference active)</p>
                <p className="text-inverse-on-surface/50">✓ Zones configured: Entrada, SUV, Sedán, Pickup</p>
                <p className="text-success">✓ Dashboard live: traxia.io/d/concesionaria-norte</p>
                <p className="text-inverse-on-surface/40 mt-3"># Video permanece en tus instalaciones</p>
                <p className="text-inverse-on-surface/40"># Solo metadatos anonimizados → cloud</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            Transforma visitas en ventas con datos reales.
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Agenda una demo para tu concesionaria y ve el sistema funcionando en vivo.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Agendar Demo Gratuita
          </button>
        </div>
      </section>
    </main>
  )
}

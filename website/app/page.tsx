'use client'

import Link from 'next/link'
import FAQ from '@/components/FAQ'

const verticals = [
  { href: '/retail', icon: 'storefront', label: 'Retail', desc: 'Heatmaps de clientes, análisis de zonas calientes y conversión por sección.' },
  { href: '/logistica', icon: 'local_shipping', label: 'Logística', desc: 'Trazabilidad de pallets, zonas de exclusión y optimización de muelles.' },
  { href: '/banca', icon: 'account_balance', label: 'Banca', desc: 'Inteligencia de sucursales seguras, colas y análisis de utilización espacial.' },
  { href: '/manufactura', icon: 'precision_manufacturing', label: 'Manufactura', desc: 'Seguridad de planta en tiempo real, cumplimiento de EPP y detección de riesgos.' },
  { href: '/hospitales', icon: 'local_hospital', label: 'Hospitales', desc: 'Analítica de flujo de pacientes, tiempos de espera y utilización de zonas.' },
  { href: '/concesionarias', icon: 'directions_car', label: 'Concesionarias', desc: 'Conversión de visitantes, tiempo de permanencia y análisis de showroom.' },
]

const steps = [
  { icon: 'videocam', label: 'Conecta tus cámaras', desc: 'RTSP/ONVIF — sin hardware adicional' },
  { icon: 'dvr', label: 'Edge Processing', desc: 'IA corre localmente en tu infraestructura' },
  { icon: 'memory', label: 'Modelos AI', desc: 'Detección, tracking y analítica espacial' },
  { icon: 'dashboard', label: 'Dashboard en Vivo', desc: 'Métricas operacionales en tiempo real' },
  { icon: 'insights', label: 'Insights Accionables', desc: 'Alertas, reportes y copiloto AI' },
]

const stats = [
  { value: '30%', label: 'Reducción en costos operativos' },
  { value: '60%', label: 'Mejora en tiempo de respuesta' },
  { value: '<3 días', label: 'Tiempo de implementación' },
  { value: '0', label: 'Datos biométricos almacenados' },
]

export default function HomePage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">AI-Native Spatial Intelligence</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Convierte tus cámaras en inteligencia operacional
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg">
                Traxia Analytics transforma tu infraestructura CCTV existente en analítica espacial en tiempo real — sin reemplazar hardware, sin datos biométricos.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                  Agendar Demo
                </button>
                <Link href="/precios" className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                  Ver Precios
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['#4200d8', '#603be2', '#605a7a', '#4813cb'].map((color, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  <span className="font-medium text-on-surface">+50 empresas</span> confían en Traxia
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-inverse-surface rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-inverse-primary text-5xl">spatial_tracking</span>
                  </div>
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">LIVE SPATIAL INTELLIGENCE</p>
                </div>
                <div className="absolute top-4 left-4 bg-success/20 border border-success/40 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success text-label-caps font-label-caps">LIVE</span>
                </div>
                <div className="absolute bottom-4 right-4 glass-card rounded-xl p-3">
                  <p className="text-inverse-on-surface text-code-data font-code-data text-xs">Dwell: 4.2 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Verticales</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Diseñado para Verticales Clave</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {verticals.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="group bg-surface-container-lowest border border-border-subtle rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-fixed rounded-xl mb-4 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">{v.icon}</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">{v.label}</h3>
                <p className="text-body-sm text-on-surface-variant mb-4">{v.desc}</p>
                <span className="inline-flex items-center gap-1 text-primary text-body-sm font-medium">
                  Más información
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Cómo Funciona</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Implementación Simple</h2>
            <p className="text-body-lg text-on-surface-variant mt-3 max-w-2xl mx-auto">
              Desde tus cámaras existentes hasta insights accionables en menos de 3 días.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] right-0 h-px bg-border-subtle" />
                )}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
                  <span className="material-symbols-outlined text-on-primary">{step.icon}</span>
                </div>
                <div className="inline-flex items-center justify-center w-5 h-5 bg-surface-container rounded-full text-label-caps font-label-caps text-on-surface-variant mb-2 text-xs">
                  {i + 1}
                </div>
                <p className="text-body-md font-medium text-on-surface mb-1">{step.label}</p>
                <p className="text-body-sm text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Copiloto AI</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
                Tu analista de operaciones, siempre disponible
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-6">
                El Copiloto AI de Traxia responde preguntas en lenguaje natural sobre tus operaciones. Detecta anomalías, genera reportes y sugiere acciones correctivas.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Alertas en tiempo real con contexto espacial',
                  'Reportes automáticos configurables',
                  'Integración con Slack, Teams y email',
                  'Historial y tendencias de hasta 12 meses',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-success text-base mt-0.5">check_circle</span>
                    <span className="text-body-md text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                Ver Demostración
              </button>
            </div>
            <div className="bg-inverse-surface rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-error/60" />
                <div className="w-3 h-3 rounded-full bg-[#FBBF24]/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="text-inverse-on-surface/40 text-code-data font-code-data text-xs ml-2">traxia-copilot</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-inverse-on-surface/60 text-code-data font-code-data text-xs mb-1">Usuario</p>
                  <p className="text-inverse-on-surface text-body-sm">¿Cuál fue la zona con mayor tráfico hoy?</p>
                </div>
                <div className="bg-primary/20 rounded-lg p-3">
                  <p className="text-inverse-primary text-code-data font-code-data text-xs mb-1">Copiloto AI</p>
                  <p className="text-inverse-on-surface text-body-sm">La Zona B (Entrada Principal) registró 847 personas entre 12:00-14:00h, un 34% más que ayer. Tiempo promedio de permanencia: 4.2 min.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Resultados</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Impacto Operacional Medido</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {stats.map((stat, i) => (
              <div key={i} className="text-center bg-surface-container-low rounded-xl p-6">
                <p className="text-display font-display text-primary mb-2">{stat.value}</p>
                <p className="text-body-sm text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low" id="demo">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-xl">
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Contacto</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface">Agenda tu demo personalizada</h2>
              <p className="text-body-lg text-on-surface-variant mt-3">
                Muéstranos tu operación y te mostramos cómo Traxia transforma tus datos espaciales en decisiones.
              </p>
            </div>
            <form className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="nombre" className="block text-body-sm font-medium text-on-surface mb-1.5">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 bg-surface-container border border-border-subtle rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="empresa" className="block text-body-sm font-medium text-on-surface mb-1.5">Empresa</label>
                  <input
                    id="empresa"
                    type="text"
                    placeholder="Tu empresa"
                    className="w-full px-4 py-3 bg-surface-container border border-border-subtle rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-body-sm font-medium text-on-surface mb-1.5">Email corporativo</label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  className="w-full px-4 py-3 bg-surface-container border border-border-subtle rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="vertical" className="block text-body-sm font-medium text-on-surface mb-1.5">Vertical / Industria</label>
                <select
                  id="vertical"
                  className="w-full px-4 py-3 bg-surface-container border border-border-subtle rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Selecciona tu industria</option>
                  <option value="retail">Retail</option>
                  <option value="logistica">Logística</option>
                  <option value="banca">Banca</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="hospitales">Hospitales</option>
                  <option value="concesionarias">Concesionarias</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-body-sm font-medium text-on-surface mb-1.5">¿Qué quieres resolver?</label>
                <textarea
                  id="mensaje"
                  rows={3}
                  placeholder="Cuéntanos sobre tu operación..."
                  className="w-full px-4 py-3 bg-surface-container border border-border-subtle rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors"
              >
                Agendar Demo Gratuita
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-xl">
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface">Preguntas Frecuentes</h2>
            </div>
            <FAQ />
          </div>
        </div>
      </section>
    </main>
  )
}

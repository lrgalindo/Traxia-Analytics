import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manufactura',
  description: 'Seguridad y cumplimiento de planta en tiempo real. Detección de EPP, zonas de riesgo y telemetría operacional para plantas industriales.',
}

export default function ManufacturaPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">precision_manufacturing</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">Manufacturing Intelligence</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Seguridad y Cumplimiento de Planta en Tiempo Real.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg">
                Analítica espacial AI para plantas industriales. Detección de EPP, zonas de exclusión y alertas de seguridad — sin reemplazar tu infraestructura de cámaras.
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
                    <span className="material-symbols-outlined text-inverse-primary text-5xl">factory</span>
                  </div>
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">PLANTA INDUSTRIAL — MONITOREO EN VIVO</p>
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-inverse-surface rounded-2xl p-8">
              <div className="inline-flex items-center gap-2 bg-success/20 rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-success text-sm">verified_user</span>
                <span className="text-label-caps font-label-caps text-success uppercase">Diferenciador Clave</span>
              </div>
              <h2 className="text-headline-lg font-headline-lg text-inverse-on-surface mb-4">
                Seguridad sin comprometer la privacidad
              </h2>
              <p className="text-body-lg text-inverse-on-surface/70 mb-6">
                A diferencia de las soluciones tradicionales de seguridad industrial, Traxia detecta riesgos — EPP faltante, incursión en zonas peligrosas, aglomeraciones — sin identificar personas ni almacenar datos biométricos.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: 'safety_check', label: 'Detección EPP' },
                  { icon: 'block', label: 'Zonas de Exclusión' },
                  { icon: 'person_off', label: 'Zero Biometrics' },
                  { icon: 'notifications_active', label: 'Alertas Inmediatas' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                    <span className="material-symbols-outlined text-inverse-primary">{item.icon}</span>
                    <span className="text-body-sm text-inverse-on-surface">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Telemetría en Vivo</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">KPIs de Planta en Tiempo Real</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">safety_check</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">94<span className="text-headline-md text-on-surface-variant">%</span></p>
              <p className="text-body-md text-on-surface-variant mt-1">Cumplimiento EPP</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_up</span>
                +7% este mes
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">block</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">0</p>
              <p className="text-body-md text-on-surface-variant mt-1">Incursiones a Zonas Peligrosas</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Hoy sin incidentes
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">speed</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">1.8<span className="text-headline-md text-on-surface-variant">s</span></p>
              <p className="text-body-md text-on-surface-variant mt-1">Latencia de Alerta Promedio</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">bolt</span>
                Respuesta en tiempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Integración</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
                Se integra con tu planta tal como está
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-6">
                Traxia no requiere reemplazar cámaras ni instalar hardware especializado. Conecta vía RTSP u ONVIF en horas.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  'Compatible con Hikvision, Dahua, Axis, Bosch y más',
                  'Procesamiento en el edge — video nunca sale de tu planta',
                  'Dashboards configurables por línea de producción',
                  'Alertas en tiempo real vía Slack, email o webhook',
                  'Reportes de cumplimiento automáticos',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-success text-base mt-0.5">check_circle</span>
                    <span className="text-body-md text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-inverse-surface rounded-2xl p-6 aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-2xl mb-4">
                  <span className="material-symbols-outlined text-inverse-primary text-6xl">factory</span>
                </div>
                <p className="text-inverse-on-surface/70 text-body-sm font-code-data">FLOOR PLAN INTELLIGENCE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            Planta más segura. Sin nuevo hardware.
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Agenda una demo personalizada para tu planta y ve cómo Traxia mejora la seguridad desde el primer día.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Agendar Demo Gratuita
          </button>
        </div>
      </section>
    </main>
  )
}

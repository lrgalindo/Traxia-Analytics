import type { Metadata } from 'next'
import Link from 'next/link'
import VerticalHero from '@/components/VerticalHero'

export const metadata: Metadata = {
  title: 'Manufactura — Seguridad de Planta con AI',
  description: 'Detección de EPP, zonas de exclusión y alertas de seguridad en tiempo real. Sin reemplazar tu infraestructura de cámaras.',
}

export default function ManufacturaPage() {
  return (
    <main>
      <VerticalHero
        badge="Manufactura · Inteligencia Espacial"
        icon="precision_manufacturing"
        h1={<>Seguridad de planta en <span className="gradient-text">tiempo real.</span></>}
        subtitle="Detección de EPP, zonas de exclusión y alertas de seguridad — sin reemplazar tu infraestructura de cámaras. Sin reconocimiento facial."
        stats={[
          { value: '0', label: 'Biométricos' },
          { value: '0', label: 'Hardware nuevo' },
          { value: '1.8 s', label: 'Latencia de alerta' },
        ]}
        secondaryCta="Ver Precios"
        liveStat="94 %"
        liveLabel="cumplimiento EPP — Turno actual"
      />

      {/* Key differentiator */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Diferenciador Clave</p>
              <h2 className="text-headline-lg text-on-surface mb-5">Seguridad sin comprometer la privacidad</h2>
              <p className="text-body-lg text-on-surface-variant mb-7 leading-relaxed">
                A diferencia de las soluciones tradicionales de seguridad industrial, Traxia detecta riesgos —
                EPP faltante, incursión en zonas peligrosas, aglomeraciones — sin identificar personas ni almacenar datos biométricos.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'safety_check', label: 'Detección EPP' },
                  { icon: 'block', label: 'Zonas de Exclusión' },
                  { icon: 'person_off', label: 'Zero Biometrics' },
                  { icon: 'notifications_active', label: 'Alertas Inmediatas' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface-alt border border-slate-200 rounded-xl px-4 py-3.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                    <span className="text-[14px] font-medium text-on-surface">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* KPI cards */}
            <div className="space-y-4">
              {[
                { icon: 'safety_check', label: 'Cumplimiento EPP', value: '94 %', trend: '+7% este mes', up: true },
                { icon: 'block', label: 'Incursiones Zonas Peligrosas', value: '0', trend: 'Hoy sin incidentes', up: true },
                { icon: 'speed', label: 'Latencia de Alerta Promedio', value: '1.8 s', trend: 'Respuesta en tiempo real', up: true },
              ].map((m, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">{m.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-on-surface-variant mb-1">{m.label}</p>
                    <p className="text-2xl font-black text-on-surface">{m.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span className="text-[12px] font-medium">{m.trend}</span>
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-on-surface-variant/50 text-center">Ejemplo ilustrativo — datos de muestra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="hero-bg py-24 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-3">Integración</p>
              <h2 className="text-headline-lg text-white mb-5">Se integra con tu planta tal como está</h2>
              <p className="text-body-lg text-white/50 mb-7 leading-relaxed">
                Sin reemplazar cámaras ni hardware especializado. Conecta vía RTSP u ONVIF en horas.
              </p>
              <ul className="space-y-4">
                {[
                  'Compatible con Hikvision, Dahua, Axis, Bosch y más',
                  'Procesamiento en el edge — video nunca sale de tu planta',
                  'Dashboards configurables por línea de producción',
                  'Alertas en tiempo real vía Slack, email o webhook',
                  'Reportes de cumplimiento automáticos',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-white/60">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card glow-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-blue-400 text-[40px]">factory</span>
              </div>
              <p className="text-[12px] text-white/30 font-mono uppercase tracking-widest">Floor Plan Intelligence</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-on-surface mb-4">Planta más segura. Sin nuevo hardware.</h2>
          <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">Agenda una demo personalizada y ve cómo Traxia mejora la seguridad desde el primer día.</p>
          <Link href="/#demo" className="btn-gradient inline-flex px-8 py-4 rounded-xl text-[15px]">
            Agendar Demo Gratuita
          </Link>
        </div>
      </section>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import VerticalHero from '@/components/VerticalHero'

export const metadata: Metadata = {
  title: 'Hospitales — Analítica de Flujo de Pacientes',
  description: 'Optimiza tiempos de espera, utilización de consultorios y flujo de pacientes con IA espacial. Sin biometría, cumpliendo normativas de salud.',
}

export default function HospitalesPage() {
  return (
    <main>
      <VerticalHero
        badge="Hospitales · Inteligencia Espacial"
        icon="local_hospital"
        h1={<>Analítica de flujo de pacientes <span className="gradient-text">para centros de salud.</span></>}
        subtitle="Optimiza la experiencia del paciente y la eficiencia operacional con analítica espacial en tiempo real — sin biometría, cumpliendo con todas las normativas de privacidad de salud."
        stats={[
          { value: '0', label: 'Biométricos' },
          { value: '0', label: 'Hardware nuevo' },
          { value: '< 24 h', label: 'Go-live' },
        ]}
        secondaryCta="Ver Cumplimiento"
        liveStat="18 min"
        liveLabel="tiempo promedio de espera"
      />

      {/* Live KPIs */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Telemetría en Vivo</p>
            <h2 className="text-headline-lg text-on-surface">KPIs de salud en tiempo real</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: 'pending', label: 'Tiempo Promedio de Espera', value: '18', unit: 'min', trend: '-22% este mes', up: true },
              { icon: 'meeting_room', label: 'Utilización de Consultorios', value: '73', unit: '%', trend: 'Óptimo', up: true },
              { icon: 'groups', label: 'Pacientes en Sala de Espera', value: '12', unit: '', trend: 'Capacidad al 80%', up: false, warn: true },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-primary text-[20px]">{m.icon}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${m.warn ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <span className={`text-[11px] font-semibold ${m.warn ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {m.warn ? 'AVISO' : 'EN VIVO'}
                    </span>
                  </div>
                </div>
                <p className="text-4xl font-black text-on-surface mb-1">
                  {m.value}<span className="text-lg text-on-surface-variant font-normal ml-1">{m.unit}</span>
                </p>
                <p className="text-[14px] text-on-surface-variant mb-3">{m.label}</p>
                <p className={`text-[12px] font-medium ${m.warn ? 'text-amber-500' : 'text-emerald-500'}`}>{m.trend}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-on-surface-variant/50 mt-5">Ejemplo ilustrativo — datos de muestra, no de cliente real</p>
        </div>
      </section>

      {/* Compliance + Integration */}
      <section className="py-24 bg-surface-alt">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Integración y Cumplimiento</p>
            <h2 className="text-headline-lg text-on-surface">Diseñado para el sector salud</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card-hover bg-white border border-slate-200 rounded-2xl p-7">
              <div className="w-11 h-11 bg-primary-fixed rounded-xl flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
              </div>
              <h3 className="text-[17px] font-bold text-on-surface mb-3">Privacidad por Diseño</h3>
              <p className="text-[14px] text-on-surface-variant mb-5 leading-relaxed">
                Sin reconocimiento facial. Sin datos biométricos. Traxia detecta movimiento y flujo de personas de forma anonimizada, cumpliendo con normativas locales de salud.
              </p>
              <ul className="space-y-2">
                {['Zero Biometrics', 'Privacidad por diseño', 'Datos procesados en el edge', 'Sin egreso de video de pacientes'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-hover bg-white border border-slate-200 rounded-2xl p-7">
              <div className="w-11 h-11 bg-primary-fixed rounded-xl flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-primary text-[20px]">integration_instructions</span>
              </div>
              <h3 className="text-[17px] font-bold text-on-surface mb-3">Integración con tu Infraestructura</h3>
              <p className="text-[14px] text-on-surface-variant mb-5 leading-relaxed">
                Compatible con los sistemas de CCTV más utilizados en hospitales. Implementación sin interrupciones operacionales.
              </p>
              <ul className="space-y-2">
                {['Conecta vía RTSP/ONVIF', 'Sin reemplazar cámaras', 'API para integración HIS/HER', 'Dashboard web sin instalación de cliente'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-20 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-4">Mejor experiencia de paciente. Cero cambios de hardware.</h2>
          <p className="text-body-lg text-white/50 mb-8 max-w-xl mx-auto">Agenda una demo para tu centro de salud y descubre cómo Traxia transforma la gestión de flujos.</p>
          <Link href="/#demo" className="btn-gradient inline-flex px-8 py-4 rounded-xl text-[15px]">
            Agendar Demo Gratuita
          </Link>
        </div>
      </section>
    </main>
  )
}

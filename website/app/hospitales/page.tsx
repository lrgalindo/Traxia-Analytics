import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hospitales',
  description: 'Analítica de Flujo de Pacientes para Centros de Salud. Optimiza tiempos de espera, utilización de zonas y cumplimiento con inteligencia espacial.',
}

export default function HospitalesPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">local_hospital</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">Healthcare Intelligence</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Analítica de Flujo de Pacientes para Centros de Salud.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg">
                Optimiza la experiencia del paciente y la eficiencia operacional con analítica espacial en tiempo real — cumpliendo con todas las normativas de privacidad de salud.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                  Agendar Demo
                </button>
                <button className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                  Ver Cumplimiento
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-inverse-surface rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-inverse-primary text-5xl">emergency</span>
                  </div>
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">PATIENT FLOW — EN VIVO</p>
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
            <h2 className="text-headline-lg font-headline-lg text-on-surface">KPIs de Salud en Tiempo Real</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">pending</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">18<span className="text-headline-md text-on-surface-variant"> min</span></p>
              <p className="text-body-md text-on-surface-variant mt-1">Tiempo Promedio de Espera</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_down</span>
                -22% este mes
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">meeting_room</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">EN VIVO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">73<span className="text-headline-md text-on-surface-variant">%</span></p>
              <p className="text-body-md text-on-surface-variant mt-1">Utilización de Consultorios</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_up</span>
                Óptimo
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">groups</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                  <span className="text-label-caps font-label-caps text-[#FBBF24]">AVISO</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">12</p>
              <p className="text-body-md text-on-surface-variant mt-1">Pacientes en Sala de Espera</p>
              <p className="text-body-sm text-[#FBBF24] mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">warning</span>
                Capacidad al 80%
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Integración y Cumplimiento</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Diseñado para el Sector Salud</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">verified_user</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-3">Privacidad por Diseño</h3>
              <p className="text-body-md text-on-surface-variant mb-4">
                Sin reconocimiento facial. Sin datos biométricos. Traxia detecta movimiento y flujo de personas de forma anonimizada, cumpliendo con HIPAA, GDPR y normativas locales de salud.
              </p>
              <ul className="flex flex-col gap-2">
                {['HIPAA Compliant', 'GDPR Ready', 'Zero Biometrics', 'Datos procesados en el edge'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-success text-base">check_circle</span>
                    <span className="text-body-sm text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">integration_instructions</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-3">Integración con tu Infraestructura</h3>
              <p className="text-body-md text-on-surface-variant mb-4">
                Compatible con los sistemas de CCTV más utilizados en hospitales. Implementación sin interrupciones operacionales.
              </p>
              <ul className="flex flex-col gap-2">
                {['Conecta vía RTSP/ONVIF', 'Sin reemplazar cámaras', 'API para HIS/HER integration', 'Dashboard web sin instalación'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-success text-base">check_circle</span>
                    <span className="text-body-sm text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            Mejor experiencia de paciente. Cero cambios de hardware.
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Agenda una demo para tu centro de salud y descubre cómo Traxia transforma la gestión de flujos.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Agendar Demo Gratuita
          </button>
        </div>
      </section>
    </main>
  )
}

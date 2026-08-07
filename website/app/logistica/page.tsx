import type { Metadata } from 'next'
import Link from 'next/link'
import VerticalHero from '@/components/VerticalHero'

export const metadata: Metadata = {
  title: 'Logística — Inteligencia Espacial para Bodegas',
  description: 'Dwell de andén, zonas de exclusión y flujo de bodega — con las cámaras que ya tienes. Sin hardware nuevo.',
}

const capabilities = [
  {
    icon: 'block',
    title: 'Zonas de exclusión de personal',
    body: 'Define perímetros virtuales alrededor de áreas de alto riesgo. Alerta inmediata cuando alguien ingresa a una zona no autorizada — sin reconocimiento facial.',
    alert: true,
  },
  {
    icon: 'dock',
    title: 'Optimización de muelles de carga',
    body: 'Registra el tiempo de permanencia en cada muelle. Identifica cuellos de botella y genera reportes para optimizar la programación de turnos.',
    alert: false,
  },
  {
    icon: 'route',
    title: 'Flujo de personal por zona',
    body: 'Mide el tráfico y el dwell time en cada área de la bodega. Detecta sobreconcentración o tiempo de inactividad para optimizar la distribución de tareas.',
    alert: false,
  },
  {
    icon: 'verified_user',
    title: 'Cero biométricos por diseño',
    body: 'Toda la analítica usa detección de presencia anónima por silueta. Sin rostros, sin identidades. Compatible con normativas de privacidad locales e internacionales.',
    alert: false,
    dark: true,
  },
]

export default function LogisticaPage() {
  return (
    <main>
      <VerticalHero
        badge="Logística · Inteligencia Espacial"
        icon="local_shipping"
        h1={<>Visibilidad total en tu bodega. <span className="gradient-text">Sin reemplazar ninguna cámara.</span></>}
        subtitle="Traxia convierte las cámaras existentes de tu centro de distribución en analítica en tiempo real. Zonas de exclusión, flujo de personal y optimización de muelles — todo desde tu infraestructura actual."
        stats={[
          { value: '0', label: 'Biométricos' },
          { value: '0', label: 'Hardware nuevo' },
          { value: '< 24 h', label: 'Go-live' },
        ]}
        secondaryCta="Ver Caso de Uso"
        liveStat="4"
        liveLabel="personas activas — Zona Muelle"
      />

      {/* Capabilities */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Capacidades</p>
            <h2 className="text-headline-lg text-on-surface">Analítica espacial para operaciones logísticas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {capabilities.map((c, i) => (
              <div key={i} className={`card-hover rounded-2xl p-7 border ${c.dark ? 'bg-hero border-hero-border' : 'bg-white border-slate-200'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${c.dark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-primary-fixed'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${c.dark ? 'text-emerald-400' : 'text-primary'}`}>{c.icon}</span>
                </div>
                <h3 className={`text-[17px] font-bold mb-3 ${c.dark ? 'text-white' : 'text-on-surface'}`}>{c.title}</h3>
                <p className={`text-[14px] leading-relaxed mb-4 ${c.dark ? 'text-white/50' : 'text-on-surface-variant'}`}>{c.body}</p>
                {c.alert && (
                  <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-[11px] text-red-400 font-semibold uppercase tracking-wider">Alerta en tiempo real</span>
                  </div>
                )}
                {c.dark && (
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                    <span className="material-symbols-outlined text-emerald-400 text-[14px]">shield</span>
                    <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Privacidad por diseño</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action flow */}
      <section className="py-24 bg-surface-alt">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-6">Flujo automatizado — ejemplo bodega</p>
              {[
                { step: '01', desc: 'Persona ingresa a zona de exclusión (área de montacargas)', icon: 'warning', color: 'text-red-500' },
                { step: '02', desc: 'Traxia detecta presencia anónima en zona restringida', icon: 'sensors', color: 'text-primary' },
                { step: '03', desc: 'Motor de Acciones dispara alerta WhatsApp a supervisor', icon: 'smartphone', color: 'text-emerald-500' },
                { step: '04', desc: 'Evento registrado en log de auditoría con timestamp', icon: 'receipt_long', color: 'text-primary' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
                  <span className="text-[11px] font-mono text-slate-300 w-6 shrink-0 mt-0.5">{item.step}</span>
                  <span className={`material-symbols-outlined shrink-0 ${item.color} text-[18px]`}>{item.icon}</span>
                  <p className="text-[14px] text-on-surface leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Motor de Acciones</p>
              <h2 className="text-headline-lg text-on-surface mb-5">De la detección a la acción en segundos</h2>
              <p className="text-body-lg text-on-surface-variant mb-7 leading-relaxed">
                Traxia no solo detecta — actúa. Conecta alertas de zona a WhatsApp, Slack, SMS o webhooks hacia tu WMS/ERP. Sin integraciones custom.
              </p>
              <ul className="space-y-3">
                {[
                  'Reglas configurables por tipo de zona y horario',
                  'Canales: WhatsApp, Slack, Webhook, SMS',
                  'Log de auditoría completo para cumplimiento',
                  'Acceso compartido por Partner o proveedor externo',
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
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-20 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-4">Cero hardware nuevo. Visibilidad total.</h2>
          <p className="text-body-lg text-white/50 mb-8 max-w-xl mx-auto">Ve cómo Traxia convierte las cámaras de tu bodega en inteligencia operacional en tiempo real.</p>
          <Link href="/#demo" className="btn-gradient inline-flex px-8 py-4 rounded-xl text-[15px]">
            Solicitar Demo para Logística
          </Link>
        </div>
      </section>
    </main>
  )
}

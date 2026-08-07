import type { Metadata } from 'next'
import Link from 'next/link'
import VerticalHero from '@/components/VerticalHero'

export const metadata: Metadata = {
  title: 'Banca — Inteligencia Espacial para Sucursales',
  description: 'Colas de ventanilla, tiempos de espera y verificación de apertura. Procesamiento 100 % on-premises, cero egreso de video.',
}

export default function BancaPage() {
  return (
    <main>
      <VerticalHero
        badge="Banca · Inteligencia Espacial"
        icon="account_balance"
        h1={<>Analítica de sucursal. <span className="gradient-text">El video nunca sale de tu red.</span></>}
        subtitle="Traxia procesa las cámaras de tu sucursal directamente en el Edge Gateway local. Solo metadatos anonimizados viajan a la nube — cero egreso de video, cero datos biométricos."
        stats={[
          { value: '0', label: 'Datos biométricos' },
          { value: '100 %', label: 'On-premises' },
          { value: '< 24 h', label: 'Activación' },
        ]}
        secondaryCta="Ver Compliance"
        liveStat="3"
        liveLabel="personas esperando — Zona Cajero"
      />

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Capacidades</p>
            <h2 className="text-headline-lg text-on-surface">Construido para los estándares de la banca</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: 'lock',
                title: 'Cero egreso de video',
                body: 'El Edge Gateway procesa las cámaras dentro de la red de la sucursal. Solo coordenadas anonimizadas y métricas viajan a la nube. El video nunca cruza tu perímetro.',
                dark: true,
              },
              {
                icon: 'line_end_arrow',
                title: 'Colas de ventanilla en tiempo real',
                body: 'Monitoreo de longitud de cola y tiempo de espera por ventanilla. Alertas configurables para redistribuir personal antes de que la espera supere el umbral.',
                dark: false,
              },
              {
                icon: 'area_chart',
                title: 'Utilización de zonas y flujo',
                body: 'Entiende cómo se distribuye el flujo entre ventanillas, autoservicio y sala de espera. Optimiza dotación de personal por hora pico.',
                dark: false,
              },
            ].map((c, i) => (
              <div key={i} className={`card-hover rounded-2xl p-7 border ${c.dark ? 'bg-hero border-hero-border' : 'bg-white border-slate-200'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${c.dark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-primary-fixed'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${c.dark ? 'text-emerald-400' : 'text-primary'}`}>{c.icon}</span>
                </div>
                <h3 className={`text-[17px] font-bold mb-3 ${c.dark ? 'text-white' : 'text-on-surface'}`}>{c.title}</h3>
                <p className={`text-[14px] leading-relaxed mb-4 ${c.dark ? 'text-white/50' : 'text-on-surface-variant'}`}>{c.body}</p>
                {c.dark && (
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                    <span className="material-symbols-outlined text-emerald-400 text-[14px]">shield</span>
                    <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Seguridad bancaria</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apertura / Cierre */}
      <section className="py-24 bg-surface-alt">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Verificación Operacional</p>
              <h2 className="text-headline-lg text-on-surface mb-5">Confirmación de apertura y limpieza de sucursal</h2>
              <p className="text-body-lg text-on-surface-variant mb-7 leading-relaxed">
                Verifica automáticamente que las ventanillas estén atendidas a la hora de apertura y que las áreas de espera estén despejadas al cierre — sin que nadie revise cámara por cámara.
              </p>
              <ul className="space-y-3">
                {[
                  'Verificación de presencia de personal a hora de apertura',
                  'Confirmación de áreas vacías al cierre',
                  'Alertas si el umbral no se cumple en el tiempo definido',
                  'Registro automático con timestamp para auditoría interna',
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
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-6">Zonas monitoreadas — sucursal ejemplo</p>
              {[
                { name: 'Sala de espera / Lobby', type: 'Tráfico + tiempo de espera', dot: 'bg-primary' },
                { name: 'Ventanillas 1–4', type: 'Cola por ventanilla + dwell time', dot: 'bg-primary' },
                { name: 'Zona Autoservicio ATM', type: 'Tráfico + ocupación', dot: 'bg-emerald-400' },
                { name: 'Lobby al cierre', type: 'Verificación de vaciado · auditoría', dot: 'bg-slate-400' },
              ].map((z, i) => (
                <div key={i} className="flex items-center gap-3 py-3.5 border-b border-slate-100 last:border-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${z.dot}`} />
                  <div>
                    <p className="text-[14px] font-semibold text-on-surface">{z.name}</p>
                    <p className="text-[12px] text-on-surface-variant">{z.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="hero-bg py-24 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="badge-ai mx-auto mb-6">
              <span className="material-symbols-outlined text-[14px] text-blue-300">policy</span>
              Compliance y Privacidad
            </div>
            <h2 className="text-headline-lg text-white mb-4">Diseñado para pasar el filtro de tu equipo legal</h2>
            <p className="text-body-lg text-white/50">
              Todo el procesamiento ocurre en el Edge Gateway dentro de tu red. Sin video, sin biometría, sin identidades personales en servidores externos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: 'videocam_off', title: 'Sin egreso de video', body: 'Solo metadatos anonimizados se transmiten. El flujo de cámara nunca abandona la red de la sucursal.' },
              { icon: 'face_retouching_off', title: 'Cero biométricos', body: 'Detección por silueta anónima. Sin reconocimiento facial, sin identidades vinculadas.' },
              { icon: 'lock', title: 'Opción self-hosted', body: 'El backend de IA puede operar en tu infraestructura propia si el contrato lo requiere.' },
            ].map((item, i) => (
              <div key={i} className="glass-card glow-border rounded-2xl p-6">
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-blue-400 text-[18px]">{item.icon}</span>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-on-surface mb-4">Inteligencia que tu área de compliance va a aprobar.</h2>
          <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">Conversemos con tu equipo de tecnología y seguridad. Te mostramos Traxia corriendo en un sandbox bancario.</p>
          <Link href="/#demo" className="btn-gradient inline-flex px-8 py-4 rounded-xl text-[15px]">
            Solicitar Demo para Banca
          </Link>
        </div>
      </section>
    </main>
  )
}

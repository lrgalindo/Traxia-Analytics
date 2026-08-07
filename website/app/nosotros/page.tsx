import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros — Traxia Analytics',
  description: 'Somos un equipo de ingenieros y expertos en IA espacial transformando la inteligencia operacional para empresas B2B en LATAM.',
}

const values = [
  {
    icon: 'shield',
    title: 'Privacidad por Diseño',
    desc: 'Zero biometrics. Todo el procesamiento ocurre en el edge. Sin video ni datos personales almacenados. La privacidad no es un feature — es nuestra arquitectura.',
  },
  {
    icon: 'memory',
    title: 'Edge-Native',
    desc: 'Nuestros modelos AI corren localmente en tu infraestructura. Latencia mínima, máxima privacidad y funcionamiento sin conexión cuando lo necesitas.',
  },
  {
    icon: 'hub',
    title: 'Multivertical',
    desc: 'Un mismo motor de IA espacial, adaptado profundamente para retail, logística, banca, manufactura, hospitales y concesionarias.',
  },
]

export default function NosotrosPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-bg relative pt-32 pb-24 overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 65%)' }} />
        <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
          <div className="badge-ai inline-flex mx-auto mb-7">
            <span className="material-symbols-outlined text-[14px] text-blue-300">groups</span>
            Sobre Nosotros
          </div>
          <h1 className="text-display-sm font-display text-white mb-6 max-w-3xl mx-auto">
            Sobre Traxia Analytics
          </h1>
          <p className="text-body-lg text-white/50 max-w-2xl mx-auto">
            Somos un equipo de ingenieros y expertos en IA espacial comprometidos con transformar la inteligencia operacional para empresas B2B en LATAM y USA.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface-alt border-y border-slate-200">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '6',        label: 'Verticales industriales' },
              { value: '< 3 días', label: 'Tiempo de implementación' },
              { value: '0',        label: 'Datos biométricos almacenados' },
              { value: '100%',     label: 'Edge-native — video nunca sale del local' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-black gradient-text-blue mb-2">{s.value}</p>
                <p className="text-[13px] text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Misión</p>
              <h2 className="text-headline-lg text-on-surface">Democratizar la inteligencia espacial para operaciones B2B</h2>
            </div>
            <div className="bg-surface-alt border border-slate-200 rounded-2xl p-10 space-y-5">
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                En Traxia Analytics creemos que cada empresa — desde un retail independiente hasta una red bancaria multinacional — merece acceso a inteligencia espacial de clase mundial, sin los costos prohibitivos del hardware especializado ni los riesgos de privacidad de las soluciones biométricas tradicionales.
              </p>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Construimos una plataforma AI-native que transforma la infraestructura CCTV existente en una capa de datos inteligente: anónima, en tiempo real y profundamente adaptada a cada vertical industrial.
              </p>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Nuestra visión es que en 2030, cada operación B2B en LATAM y USA tome decisiones basadas en inteligencia espacial — no en intuición o datos históricos desactualizados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-hero relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-3">Valores</p>
            <h2 className="text-headline-lg text-white">Lo que nos define</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className="glass-card glow-border rounded-2xl p-7">
                <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-blue-400 text-[20px]">{v.icon}</span>
                </div>
                <h3 className="text-[17px] font-bold text-white mb-3">{v.title}</h3>
                <p className="text-[14px] text-white/50 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-hero border border-hero-border rounded-2xl p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-blue-400 text-[28px]">work</span>
                </div>
                <h2 className="text-headline-lg text-white mb-4">Únete al equipo</h2>
                <p className="text-body-lg text-white/50 mb-8 max-w-md mx-auto">
                  Estamos construyendo el futuro de la inteligencia operacional. Si eres apasionado por IA, edge computing e impacto real en negocios B2B, queremos conocerte.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="btn-gradient px-6 py-3 rounded-xl text-[14px]">Ver Posiciones Abiertas</button>
                  <button className="px-6 py-3 rounded-xl text-[14px] font-medium text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all">
                    Enviar CV Espontáneo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero-bg py-20 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-4">¿Listo para transformar tu operación?</h2>
          <p className="text-body-lg text-white/50 mb-8 max-w-xl mx-auto">
            Agenda una demo personalizada y ve Traxia en acción con los datos de tu propia operación.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#demo" className="btn-gradient px-8 py-4 rounded-xl text-[15px]">
              Agendar Demo Gratuita
            </Link>
            <Link href="/precios" className="px-8 py-4 rounded-xl text-[15px] font-medium text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all">
              Ver Precios
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

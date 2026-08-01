import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce al equipo detrás de Traxia Analytics. Ingenieros y expertos en IA espacial transformando la inteligencia operacional B2B.',
}

const values = [
  {
    icon: 'shield',
    title: 'Privacidad por Diseño',
    desc: 'Zero biometrics. Todo el procesamiento ocurre en el edge. Nunca almacenamos video ni datos personales. La privacidad no es un feature, es nuestra arquitectura.',
  },
  {
    icon: 'memory',
    title: 'Edge-Native',
    desc: 'Nuestros modelos AI corren localmente en tu infraestructura. Latencia mínima, máxima privacidad y funcionamiento sin conexión a internet cuando lo necesitas.',
  },
  {
    icon: 'hub',
    title: 'Multivertical',
    desc: 'Un mismo motor de IA espacial, adaptado profundamente para retail, logística, banca, manufactura, hospitales y concesionarias. Especialización real, no templates.',
  },
]

export default function NosotrosPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px] text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
              <span className="material-symbols-outlined text-primary text-sm">groups</span>
              <span className="text-label-caps font-label-caps text-primary uppercase">Sobre Nosotros</span>
            </div>
            <h1 className="text-display font-display text-on-surface mb-6">
              Sobre Traxia Analytics
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Somos un equipo de ingenieros y expertos en IA espacial comprometidos con transformar la inteligencia operacional para empresas B2B2B en LATAM y USA.
            </p>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-xl">
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Misión</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-6">
                Democratizar la inteligencia espacial para operaciones B2B
              </h2>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 md:p-12">
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6">
                En Traxia Analytics creemos que cada empresa — desde un retail independiente hasta una red bancaria multinacional — merece acceso a inteligencia espacial de clase mundial, sin los costos prohibitivos del hardware especializado ni los riesgos de privacidad de las soluciones biométricas tradicionales.
              </p>
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6">
                Construimos una plataforma AI-native que transforma la infraestructura CCTV existente en una capa de datos inteligente: anónima, en tiempo real y profundamente adaptada a cada vertical industrial.
              </p>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Nuestra visión es que en 2030, cada operación B2B en LATAM y USA tome decisiones basadas en inteligencia espacial — no en intuición o datos históricos desactualizados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Valores</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Lo que nos define</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {values.map((value, i) => (
              <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary">{value.icon}</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-3">{value.title}</h3>
                <p className="text-body-md text-on-surface-variant">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {[
              { value: '50+', label: 'Empresas confían en Traxia' },
              { value: '6', label: 'Verticales industriales' },
              { value: '< 3 días', label: 'Tiempo de implementación' },
              { value: '0', label: 'Datos biométricos' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-display font-display text-primary mb-2">{stat.value}</p>
                <p className="text-body-sm text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-2xl mx-auto">
            <div className="bg-inverse-surface rounded-2xl p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-6">
                <span className="material-symbols-outlined text-inverse-primary text-3xl">work</span>
              </div>
              <h2 className="text-headline-lg font-headline-lg text-inverse-on-surface mb-4">
                Únete al equipo
              </h2>
              <p className="text-body-lg text-inverse-on-surface/70 mb-8">
                Estamos construyendo el futuro de la inteligencia operacional. Si eres apasionado por la IA, el edge computing y el impacto real en negocios B2B, queremos conocerte.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                  Ver Posiciones Abiertas
                </button>
                <button className="px-6 py-3 bg-white/10 text-inverse-on-surface rounded-xl font-medium text-body-md hover:bg-white/20 transition-colors">
                  Enviar CV Espontáneo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            ¿Listo para transformar tu operación?
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Agenda una demo personalizada y ve Traxia en acción con los datos de tu propia operación.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#demo" className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
              Agendar Demo Gratuita
            </Link>
            <Link href="/precios" className="px-8 py-4 bg-on-primary/10 text-on-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/20 transition-colors">
              Ver Precios
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

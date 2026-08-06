import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logística — Traxia',
  description: 'Inteligencia Espacial para Bodegas y Centros de Distribución. Zonas de exclusión, flujo de personal y optimización de muelles con analítica AI sobre tus cámaras existentes.',
}

export default function LogisticaPage() {
  return (
    <main className="flex-grow pt-[80px]">

      {/* Hero */}
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">local_shipping</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">Logística · Inteligencia Espacial</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Visibilidad total en tu bodega. Sin reemplazar ninguna cámara.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-6 max-w-lg">
                Traxia convierte las cámaras existentes de tu centro de distribución en una capa de analítica en tiempo real. Zonas de exclusión, flujo de personal y optimización de muelles — todo desde tu infraestructura actual.
              </p>
              <div className="grid grid-cols-3 gap-md mb-8">
                {[
                  { value: '0', label: 'Biométricos capturados' },
                  { value: '0 cámaras', label: 'Hardware reemplazado' },
                  { value: '< 24 h', label: 'Go-live en bodega' },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-container-low rounded-xl p-4 text-center">
                    <p className="text-headline-lg font-headline-lg text-primary">{stat.value}</p>
                    <p className="text-body-sm text-on-surface-variant mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                  Agendar Demo
                </button>
                <button className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                  Ver Caso de Uso
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-inverse-surface rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-inverse-primary text-5xl">warehouse</span>
                  </div>
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">MAPA ESPACIAL BODEGA — EN VIVO</p>
                </div>
                <div className="absolute top-4 left-4 bg-success/20 border border-success/40 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success text-label-caps font-label-caps">EN VIVO</span>
                </div>
                <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 bg-inverse-surface/80 rounded-lg px-2 py-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-inverse-on-surface/70 text-label-caps font-label-caps" style={{ fontSize: '10px' }}>ZONA MUELLE · 4 personas activas</span>
                  </div>
                  <div className="flex items-center gap-2 bg-inverse-surface/80 rounded-lg px-2 py-1">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    <span className="text-inverse-on-surface/70 text-label-caps font-label-caps" style={{ fontSize: '10px' }}>ÁREA RESTRINGIDA · ALERTA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Capacidades</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Analítica espacial para operaciones logísticas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">

            {/* Exclusion Zones */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">block</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Zonas de exclusión de personal</h3>
              <p className="text-body-md text-on-surface-variant mb-4">
                Define perímetros virtuales alrededor de áreas de alto riesgo (montacargas, zonas de carga, cuartos de máquinas). Alerta inmediata cuando una persona ingresa a un área no autorizada — sin reconocimiento facial.
              </p>
              <div className="inline-flex items-center gap-2 bg-error/10 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="text-label-caps font-label-caps text-error uppercase">Alerta en tiempo real</span>
              </div>
            </div>

            {/* Dock Optimization */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">dock</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Optimización de muelles de carga</h3>
              <p className="text-body-md text-on-surface-variant">
                Registra el tiempo de permanencia del personal en cada muelle. Identifica muelles con tiempos de espera elevados y genera reportes de utilización para optimizar la programación de turnos.
              </p>
            </div>

            {/* Flow Analytics */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">route</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Flujo de personal por zona</h3>
              <p className="text-body-md text-on-surface-variant">
                Mide el tráfico y el dwell time de personal en cada área de la bodega. Identifica zonas con sobreconcentración o tiempo de inactividad excesivo para optimizar la distribución de tareas.
              </p>
            </div>

            {/* Zero Biometrics */}
            <div className="bg-inverse-surface border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-success">verified_user</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-inverse-on-surface mb-2">Cero biométricos por diseño</h3>
              <p className="text-body-md text-inverse-on-surface/70 mb-4">
                Toda la analítica usa detección de presencia anónima por silueta. Sin rostros, sin identidades, sin datos biométricos almacenados. Compatible con normativas de privacidad locales e internacionales.
              </p>
              <div className="inline-flex items-center gap-2 bg-success/20 rounded-full px-3 py-1">
                <span className="material-symbols-outlined text-success text-sm">shield</span>
                <span className="text-label-caps font-label-caps text-success uppercase">Privacidad por diseño</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motor de Acciones integration */}
      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div className="order-2 md:order-1">
              <div className="bg-surface-container-low rounded-2xl p-8">
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-6">Flujo automatizado — ejemplo bodega</p>
                {[
                  { step: '01', desc: 'Persona ingresa a zona de exclusión (área de montacargas)', icon: 'warning', color: 'text-error' },
                  { step: '02', desc: 'Traxia detecta presencia anónima en zona restringida', icon: 'sensors', color: 'text-primary' },
                  { step: '03', desc: 'Motor de Acciones dispara alerta WhatsApp a supervisor de turno', icon: 'smartphone', color: 'text-success' },
                  { step: '04', desc: 'Evento registrado en log de auditoría con timestamp', icon: 'receipt_long', color: 'text-primary' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-border-subtle last:border-0">
                    <span className="text-label-caps font-label-caps text-on-surface-variant font-mono w-6 flex-shrink-0">{item.step}</span>
                    <span className={`material-symbols-outlined flex-shrink-0 ${item.color}`} style={{ fontSize: '20px' }}>{item.icon}</span>
                    <p className="text-body-md text-on-surface">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Motor de Acciones</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
                De la detección a la acción en segundos
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-6">
                Traxia no solo detecta — actúa. Conecta las alertas de zona a WhatsApp, Slack, SMS o webhooks hacia tu WMS/ERP. Sin integraciones custom, sin código adicional.
              </p>
              <ul className="space-y-3">
                {[
                  'Reglas configurables por tipo de zona y horario',
                  'Canales: WhatsApp, Slack, Webhook, SMS',
                  'Log de auditoría completo para cumplimiento interno',
                  'Acceso compartido por Partner (ej. proveedor ve datos de su propia zona)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0" style={{ fontSize: '18px' }}>check_circle</span>
                    <span className="text-body-md text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            Cero hardware nuevo. Visibilidad total.
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Ve cómo Traxia convierte las cámaras existentes de tu bodega en una capa de inteligencia operacional en tiempo real.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Solicitar Demo para Logística
          </button>
        </div>
      </section>
    </main>
  )
}

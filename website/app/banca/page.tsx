import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banca — Traxia',
  description: 'Inteligencia Espacial para Sucursales Bancarias. Colas de ventanilla, tiempos de espera y verificación de apertura — procesamiento 100% on-premises, cero egreso de video.',
}

export default function BancaPage() {
  return (
    <main className="flex-grow pt-[80px]">

      {/* Hero */}
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">account_balance</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">Banca · Inteligencia Espacial</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Analítica de sucursal. El video nunca sale de tu red.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg">
                Traxia procesa las cámaras existentes de tu sucursal directamente en el Edge Gateway local. Solo metadatos anonimizados viajan a la nube — cero egreso de video, cero datos biométricos.
              </p>
              <div className="grid grid-cols-3 gap-md mb-8">
                {[
                  { value: '0', label: 'Datos biométricos' },
                  { value: '100 %', label: 'Proceso on-premises' },
                  { value: '< 24 h', label: 'Activación en sucursal' },
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
                  Ver Compliance
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-inverse-surface rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-inverse-primary text-5xl">account_balance</span>
                  </div>
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">COLA DE VENTANILLA — EN VIVO</p>
                </div>
                <div className="absolute top-4 left-4 bg-success/20 border border-success/40 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success text-label-caps font-label-caps">EN VIVO</span>
                </div>
                <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 bg-inverse-surface/80 rounded-lg px-2 py-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-inverse-on-surface/70 text-label-caps font-label-caps" style={{ fontSize: '10px' }}>ZONA CAJERO · 3 personas esperando</span>
                  </div>
                  <div className="flex items-center gap-2 bg-inverse-surface/80 rounded-lg px-2 py-1">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-inverse-on-surface/70 text-label-caps font-label-caps" style={{ fontSize: '10px' }}>AUTOSERVICIO · 1 persona</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Capacidades</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Construido para los estándares de la banca</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">

            {/* Zero Egress */}
            <div className="bg-inverse-surface rounded-xl p-6">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-success">lock</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-inverse-on-surface mb-2">Cero egreso de video</h3>
              <p className="text-body-md text-inverse-on-surface/70 mb-4">
                El Edge Gateway de Traxia procesa las cámaras dentro de la red de la sucursal. Solo coordenadas anonimizadas y métricas viajan a la nube. El video nunca cruza tu perímetro.
              </p>
              <div className="inline-flex items-center gap-2 bg-success/20 rounded-full px-3 py-1">
                <span className="material-symbols-outlined text-success text-sm">shield</span>
                <span className="text-label-caps font-label-caps text-success uppercase">Seguridad bancaria</span>
              </div>
            </div>

            {/* Queue Analytics */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">line_end_arrow</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Colas de ventanilla en tiempo real</h3>
              <p className="text-body-md text-on-surface-variant">
                Monitoreo de longitud de cola y tiempo de espera por ventanilla. Alertas configurables antes de que la espera supere el umbral definido. Redistribución de personal basada en datos, no en intuición.
              </p>
            </div>

            {/* Zone Utilization */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">area_chart</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Utilización de zonas y flujo</h3>
              <p className="text-body-md text-on-surface-variant">
                Entiende cómo se distribuye el flujo entre ventanillas, autoservicio y sala de espera. Compara el tráfico por hora y por día para optimizar la dotación de personal en horas pico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apertura / Limpieza verification */}
      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Verificación Operacional</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
                Confirmación de apertura y limpieza de sucursal
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-6">
                Traxia puede verificar automáticamente que las ventanillas estén atendidas a la hora de apertura, que las áreas de espera estén despejadas tras el cierre, y generar un registro diario para auditoría interna — sin que ningún operador tenga que revisar cámara por cámara.
              </p>
              <ul className="space-y-3">
                {[
                  'Verificación de presencia de personal en ventanilla a hora de apertura',
                  'Confirmación de áreas vacías al cierre (limpieza y seguridad)',
                  'Alertas al Motor de Acciones si el umbral no se cumple en el tiempo definido',
                  'Registro automático con timestamp para auditoría interna',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0" style={{ fontSize: '18px' }}>check_circle</span>
                    <span className="text-body-md text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-8">
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-6">Zonas monitoreadas — sucursal ejemplo</p>
              {[
                { name: 'Sala de espera / Lobby', type: 'Tráfico + tiempo de espera', color: 'text-primary', dot: 'bg-primary' },
                { name: 'Ventanillas 1–4', type: 'Cola por ventanilla + dwell time', color: 'text-primary', dot: 'bg-primary' },
                { name: 'Zona Autoservicio ATM', type: 'Tráfico + ocupación', color: 'text-success', dot: 'bg-success' },
                { name: 'Lobby al cierre', type: 'Verificación de vaciado · auditoría', color: 'text-on-surface-variant', dot: 'bg-on-surface-variant' },
              ].map((z, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${z.dot}`} />
                  <div className="flex-1">
                    <p className="text-body-md font-medium text-on-surface">{z.name}</p>
                    <p className={`text-label-caps font-label-caps ${z.color}`}>{z.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance note */}
      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
              <span className="material-symbols-outlined text-primary text-sm">policy</span>
              <span className="text-label-caps font-label-caps text-primary uppercase">Compliance y Privacidad</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
              Diseñado para pasar el filtro de tu equipo legal
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              Todo el procesamiento de video ocurre en el Edge Gateway dentro de tu red. Ningún frame de video, ningún dato biométrico y ninguna identidad personal viajan a servidores externos. El Copiloto de IA opera sobre métricas ya agregadas — no sobre video crudo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-left">
              {[
                {
                  icon: 'videocam_off',
                  title: 'Sin egreso de video',
                  body: 'El flujo de cámara nunca abandona la red de la sucursal. Solo metadatos de posición anonimizados se transmiten.',
                },
                {
                  icon: 'face_retouching_off',
                  title: 'Cero biométricos',
                  body: 'Detección por silueta anónima. Sin reconocimiento facial, sin huellas de movimiento vinculadas a identidades.',
                },
                {
                  icon: 'lock',
                  title: 'Opción self-hosted',
                  body: 'Para clientes que lo requieran contractualmente, el backend de IA puede operar en tu infraestructura propia.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
                  <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">{item.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            Inteligencia que tu área de compliance va a aprobar.
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Conversemos con tu equipo de tecnología y seguridad y te mostramos Traxia corriendo dentro de una sucursal sandbox.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Solicitar Demo para Banca
          </button>
        </div>
      </section>
    </main>
  )
}

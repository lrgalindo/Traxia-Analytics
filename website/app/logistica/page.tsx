import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logística',
  description: 'Precision Logistics. Zero Compromise. Trazabilidad de pallets, zonas de exclusión y optimización de muelles con analítica espacial AI.',
}

export default function LogisticaPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">local_shipping</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">Logistics Intelligence</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Precision Logistics. Zero Compromise.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-6 max-w-lg">
                Real-time spatial analytics for warehouse and distribution centers. Track pallets, monitor exclusion zones, and optimize dock throughput — all from your existing cameras.
              </p>
              <div className="grid grid-cols-3 gap-md mb-8">
                {[
                  { value: '99.2%', label: 'Pallet Accuracy' },
                  { value: '0', label: 'Biometric Data' },
                  { value: '< 24h', label: 'Go-Live' },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-container-low rounded-xl p-4 text-center">
                    <p className="text-headline-lg font-headline-lg text-primary">{stat.value}</p>
                    <p className="text-body-sm text-on-surface-variant mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                  Book a Demo
                </button>
                <button className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                  View Case Study
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
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">WAREHOUSE SPATIAL MAP — LIVE</p>
                </div>
                <div className="absolute top-4 left-4 bg-success/20 border border-success/40 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success text-label-caps font-label-caps">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Core Spatial Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Pallet Tracking</h3>
              <p className="text-body-md text-on-surface-variant">
                Real-time location of every pallet across your warehouse floor. Automated dwell time alerts, lost inventory detection, and throughput reporting.
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">block</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Staff Exclusion Zones</h3>
              <p className="text-body-md text-on-surface-variant">
                Define virtual perimeters around hazardous zones. Instant alerts when unauthorized personnel enter restricted areas — all without facial recognition.
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">dock</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Dock Optimization</h3>
              <p className="text-body-md text-on-surface-variant">
                Track truck arrival, docking time, and departure. Identify bottlenecks and optimize dock scheduling with historical patterns and live data.
              </p>
            </div>
            <div className="bg-inverse-surface border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-success">verified_user</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-inverse-on-surface mb-2">Zero Biometrics</h3>
              <p className="text-body-md text-inverse-on-surface/70">
                All spatial analytics use anonymous silhouette detection. No faces, no identities, no biometric data — fully compliant with global privacy regulations.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-success/20 rounded-full px-3 py-1">
                <span className="material-symbols-outlined text-success text-sm">shield</span>
                <span className="text-label-caps font-label-caps text-success uppercase">Privacy by Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-3xl mx-auto">
            <div className="bg-primary rounded-2xl p-8 md:p-12">
              <div className="inline-flex items-center gap-2 bg-on-primary/10 rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-on-primary text-sm">format_quote</span>
                <span className="text-label-caps font-label-caps text-on-primary/80 uppercase">Case Study</span>
              </div>
              <blockquote className="text-headline-md font-headline-md text-on-primary mb-6">
                "Traxia redujo nuestros tiempos muertos en muelle un 28% en el primer mes. Implementación en 2 días, sin tocar una sola cámara."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-on-primary/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary">person</span>
                </div>
                <div>
                  <p className="text-body-md font-medium text-on-primary">Director de Operaciones</p>
                  <p className="text-body-sm text-on-primary/70">Centro de Distribución Regional — LATAM</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-md mt-8 pt-8 border-t border-on-primary/20">
                {[
                  { value: '28%', label: 'Reducción tiempos muertos' },
                  { value: '2 días', label: 'Tiempo de implementación' },
                  { value: '0 cámaras', label: 'Hardware reemplazado' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-headline-lg font-headline-lg text-on-primary">{stat.value}</p>
                    <p className="text-body-sm text-on-primary/70 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            Zero hardware. Full visibility.
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            See how Traxia transforms your existing warehouse cameras into a real-time intelligence layer.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Schedule a Logistics Demo
          </button>
        </div>
      </section>
    </main>
  )
}

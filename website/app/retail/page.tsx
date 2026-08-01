import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retail',
  description: 'Spatial Intelligence for Modern Retail. Customer heatmaps, zone conversion analytics, and shelf monitoring — all from your existing CCTV.',
}

export default function RetailPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px]">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">storefront</span>
                <span className="text-label-caps font-label-caps text-primary uppercase">Retail Intelligence</span>
              </div>
              <h1 className="text-display font-display text-on-surface mb-6">
                Spatial Intelligence for Modern Retail.
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg">
                Transform your existing CCTV cameras into real-time customer journey analytics. Understand dwell time, zone conversion, and shelf performance — without replacing any hardware.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                  Book a Demo
                </button>
                <button className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                  View Pricing
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-inverse-surface rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-4">
                    <span className="material-symbols-outlined text-inverse-primary text-5xl">heatmap</span>
                  </div>
                  <p className="text-inverse-on-surface/70 text-body-sm font-code-data">CUSTOMER HEATMAP — LIVE</p>
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
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Live Telemetry</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Real-Time Retail Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">LIVE</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">4.2<span className="text-headline-md text-on-surface-variant"> min</span></p>
              <p className="text-body-md text-on-surface-variant mt-1">Avg Dwell Time</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_up</span>
                +12% vs yesterday
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">conversion_path</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-label-caps font-label-caps text-success">LIVE</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">68<span className="text-headline-md text-on-surface-variant">%</span></p>
              <p className="text-body-md text-on-surface-variant mt-1">Zone Conversion Rate</p>
              <p className="text-body-sm text-success mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_up</span>
                +8% this week
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="text-label-caps font-label-caps text-error">ALERT</span>
                </div>
              </div>
              <p className="text-display font-display text-on-surface">3</p>
              <p className="text-body-md text-on-surface-variant mt-1">Shelf Out-of-Stock Alerts</p>
              <p className="text-body-sm text-error mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">warning</span>
                Aisle 7, 12, 15
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Integration</p>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
                Hardware-Free Integration
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-6">
                Traxia connects to your existing CCTV infrastructure via RTSP or ONVIF. No new cameras. No proprietary hardware. No lengthy procurement cycles.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: 'videocam', text: 'Compatible with all major CCTV brands (Hikvision, Dahua, Axis, Bosch)' },
                  { icon: 'memory', text: 'Edge processing — video never leaves your premises' },
                  { icon: 'cloud_sync', text: 'Only anonymized spatial metadata sent to cloud' },
                  { icon: 'lock', text: 'Zero biometrics stored or transmitted' },
                  { icon: 'bolt', text: 'Live in as little as 1 business day' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-base">{item.icon}</span>
                    </div>
                    <p className="text-body-md text-on-surface-variant pt-1.5">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-inverse-surface rounded-2xl p-6">
              <p className="text-inverse-on-surface/40 text-code-data font-code-data text-xs mb-4">Architecture</p>
              <div className="space-y-3">
                {[
                  { label: 'CCTV Cameras', icon: 'videocam', color: 'bg-surface/10' },
                  { label: 'Edge Node (your infra)', icon: 'memory', color: 'bg-primary/20' },
                  { label: 'Traxia AI Models', icon: 'smart_toy', color: 'bg-tertiary/20' },
                  { label: 'Cloud Dashboard', icon: 'cloud', color: 'bg-success/20' },
                ].map((item, i) => (
                  <div key={i} className={`${item.color} rounded-lg p-3 flex items-center gap-3`}>
                    <span className="material-symbols-outlined text-inverse-on-surface text-sm">{item.icon}</span>
                    <span className="text-inverse-on-surface text-body-sm">{item.label}</span>
                    {i < 3 && <span className="material-symbols-outlined text-inverse-on-surface/40 ml-auto text-sm">arrow_downward</span>}
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
            Ready to see your store through AI eyes?
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Get a live demo with your own store data in under 48 hours.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Book Free Demo
          </button>
        </div>
      </section>
    </main>
  )
}

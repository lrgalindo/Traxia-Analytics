import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banca',
  description: 'Secure Branch Intelligence for Modern Banking. Queue analytics, spatial utilization, and zero video egress for financial institutions.',
}

export default function BancaPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter py-xxl md:py-[96px] text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-3 py-1 mb-6">
              <span className="material-symbols-outlined text-primary text-sm">account_balance</span>
              <span className="text-label-caps font-label-caps text-primary uppercase">Banking Intelligence</span>
            </div>
            <h1 className="text-display font-display text-on-surface mb-6">
              Secure Branch Intelligence for Modern Banking.
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
              Spatial analytics for bank branches that require the highest security and privacy standards. Zero video egress, no biometrics, fully on-premises processing.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                Book a Demo
              </button>
              <button className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                Security Compliance
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Core Features</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Built for Banking Security Requirements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-inverse-surface rounded-xl p-6">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-success">lock</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-inverse-on-surface mb-2">Zero-Video Egress</h3>
              <p className="text-body-md text-inverse-on-surface/70 mb-4">
                Video streams never leave your premises. All AI processing happens on the edge node inside your branch network. Only anonymized spatial metadata is transmitted.
              </p>
              <div className="inline-flex items-center gap-2 bg-success/20 rounded-full px-3 py-1">
                <span className="material-symbols-outlined text-success text-sm">shield</span>
                <span className="text-label-caps font-label-caps text-success uppercase">Bank-Grade Security</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">line_curve</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Queue Analytics</h3>
              <p className="text-body-md text-on-surface-variant mb-4">
                Real-time queue length and wait time monitoring. Predictive staffing alerts before peak hours. Average queue time reduction of 32% within 30 days.
              </p>
              <div className="flex items-center gap-2 p-3 bg-surface-container rounded-lg">
                <span className="text-display font-display text-primary">-32%</span>
                <div>
                  <p className="text-body-sm font-medium text-on-surface">Queue wait time</p>
                  <p className="text-label-caps font-label-caps text-on-surface-variant">avg. 30 days</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">area_chart</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Spatial Utilization Analytics</h3>
              <p className="text-body-md text-on-surface-variant">
                Understand how customers move through your branch. Zone heatmaps, product area engagement, teller vs. self-service routing optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Performance</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Regional Branch Performance</h2>
            <p className="text-body-lg text-on-surface-variant mt-3">
              Compare branch performance metrics across your network.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="text-left px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Branch</th>
                  <th className="text-left px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Avg Wait (min)</th>
                  <th className="text-left px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Daily Visitors</th>
                  <th className="text-left px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Zone Utilization</th>
                  <th className="text-left px-6 py-4 text-label-caps font-label-caps text-on-surface-variant uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { branch: 'Sucursal Centro', wait: '8.2', visitors: '342', util: '78%', status: 'optimal' },
                  { branch: 'Sucursal Norte', wait: '14.7', visitors: '218', util: '52%', status: 'warning' },
                  { branch: 'Sucursal Sur', wait: '6.1', visitors: '401', util: '85%', status: 'optimal' },
                  { branch: 'Sucursal Oriente', wait: '22.3', visitors: '156', util: '34%', status: 'critical' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border-subtle hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 text-body-md font-medium text-on-surface">{row.branch}</td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">{row.wait}</td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">{row.visitors}</td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">{row.util}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-caps font-label-caps uppercase ${
                        row.status === 'optimal' ? 'bg-success/10 text-success' :
                        row.status === 'warning' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
                        'bg-error/10 text-error'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          row.status === 'optimal' ? 'bg-success' :
                          row.status === 'warning' ? 'bg-[#FBBF24]' :
                          'bg-error'
                        }`} />
                        {row.status === 'optimal' ? 'Optimal' : row.status === 'warning' ? 'Warning' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-primary">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="text-headline-lg font-headline-lg text-on-primary mb-4">
            Intelligence your compliance team will approve.
          </h2>
          <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
            Talk to our banking specialists and see Traxia running inside a branch sandbox.
          </p>
          <button className="px-8 py-4 bg-on-primary text-primary rounded-xl font-medium text-body-lg hover:bg-on-primary/90 transition-colors">
            Request Banking Demo
          </button>
        </div>
      </section>
    </main>
  )
}

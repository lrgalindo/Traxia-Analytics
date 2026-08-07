import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Precios — Planes Traxia Analytics',
  description: 'Planes para toda escala. Desde operaciones de una sola sede hasta redes empresariales multi-sede.',
}

const baseFeatures = [
  'Hasta 8 cámaras IP',
  '1 sede / ubicación',
  'Dashboard en tiempo real',
  'Módulo básico de heatmaps',
  'Alertas por email',
  'Reportes semanales automáticos',
  'Soporte por email (48h SLA)',
  'Actualizaciones de modelos AI incluidas',
]

const enterpriseFeatures = [
  'Cámaras ilimitadas',
  'Sedes ilimitadas',
  'Dashboard multi-sede centralizado',
  'Todos los módulos AI por vertical',
  'Copiloto AI conversacional',
  'Alertas en tiempo real (Slack, Teams, webhook)',
  'Reportes personalizados y exportación CSV/PDF',
  'API completa para integración con ERP/CRM',
  'SLA 99.9 % uptime',
  'Soporte dedicado 24/7',
  'Implementación asistida por ingenieros Traxia',
  'Personalización de modelos por vertical',
]

const comparisonRows = [
  { feature: 'Cámaras', base: 'Hasta 8', enterprise: 'Ilimitadas' },
  { feature: 'Sedes', base: '1', enterprise: 'Ilimitadas' },
  { feature: 'Dashboard en tiempo real', base: true, enterprise: true },
  { feature: 'Módulo Heatmaps', base: true, enterprise: true },
  { feature: 'Alertas por email', base: true, enterprise: true },
  { feature: 'Alertas Slack/Teams/Webhook', base: false, enterprise: true },
  { feature: 'Dashboard multi-sede', base: false, enterprise: true },
  { feature: 'Copiloto AI', base: false, enterprise: true },
  { feature: 'API de integración', base: false, enterprise: true },
  { feature: 'Todos los módulos verticales', base: false, enterprise: true },
  { feature: 'Soporte prioritario 24/7', base: false, enterprise: true },
  { feature: 'Implementación asistida', base: false, enterprise: true },
]

export default function PreciosPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-bg relative pt-32 pb-20 overflow-hidden text-center">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="relative z-10 max-w-container-max mx-auto px-6">
          <div className="badge-ai inline-flex mx-auto mb-7">Precios</div>
          <h1 className="text-display-sm font-display text-white mb-5">
            Escala tu inteligencia espacial.
          </h1>
          <p className="text-body-lg text-white/50 max-w-2xl mx-auto">
            Planes para cada escala de operación. Sin costos ocultos, sin compromiso de largo plazo el primer mes.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Base */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Base Plan</p>
              <div className="mb-5">
                <span className="text-headline-lg text-on-surface">Consultar precio</span>
              </div>
              <p className="text-[14px] text-on-surface-variant mb-7">Ideal para operaciones de una sola sede con hasta 8 cámaras.</p>
              <ul className="space-y-3 flex-grow mb-8">
                {baseFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-on-surface-variant">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/#demo" className="w-full py-3.5 text-center text-[14px] font-semibold text-on-surface border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors block">
                Solicitar Cotización
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-hero border border-hero-border rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="text-[11px] font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-3 py-1 uppercase tracking-wider">Más Popular</span>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
              <div className="relative z-10 flex flex-col flex-grow">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-2">Enterprise Plan</p>
                <div className="mb-5">
                  <span className="text-headline-lg text-white">Consultar precio</span>
                </div>
                <p className="text-[14px] text-white/50 mb-7">Para redes multi-sede con capacidades AI completas y soporte dedicado.</p>
                <ul className="space-y-3 flex-grow mb-8">
                  {enterpriseFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-white/60">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/#demo" className="btn-gradient w-full py-3.5 text-center text-[14px] rounded-xl block">
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-[14px] text-on-surface-variant mt-8">
            ¿Necesitas algo personalizado?{' '}
            <Link href="/#demo" className="text-primary font-medium hover:underline">Contáctanos</Link>{' '}
            y diseñamos un plan para tu operación.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 bg-surface-alt">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Comparación</p>
            <h2 className="text-headline-lg text-on-surface">Comparativa de características</h2>
          </div>
          <div className="overflow-x-auto -mx-6 px-6 max-w-3xl lg:mx-auto lg:px-0">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-4 sm:px-6 py-4 text-[12px] sm:text-[13px] font-medium text-on-surface-variant w-1/2">Característica</th>
                  <th className="text-center px-4 sm:px-6 py-4 text-[12px] sm:text-[13px] font-semibold text-on-surface">Base</th>
                  <th className="text-center px-4 sm:px-6 py-4 text-[12px] sm:text-[13px] font-semibold text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 sm:px-6 py-3 text-[12px] sm:text-[14px] text-on-surface-variant">{row.feature}</td>
                    <td className="px-4 sm:px-6 py-3 text-center">
                      {typeof row.base === 'boolean' ? (
                        row.base
                          ? <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                          : <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                      ) : (
                        <span className="text-[12px] sm:text-[13px] font-medium text-on-surface">{row.base}</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise
                          ? <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                          : <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                      ) : (
                        <span className="text-[12px] sm:text-[13px] font-semibold text-primary">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-24 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-5">Hablemos de tu caso de uso</h2>
          <p className="text-body-lg text-white/50 mb-10 max-w-xl mx-auto">
            Nuestro equipo puede ayudarte a elegir el plan correcto y estimar el ROI esperado para tu operación específica.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#demo" className="btn-gradient px-8 py-4 rounded-xl text-[15px]">
              Hablar con un Especialista
            </Link>
            <Link href="/nosotros" className="px-8 py-4 rounded-xl text-[15px] font-medium text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all">
              Conocer el Equipo
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

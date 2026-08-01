import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Precios',
  description: 'Planes de Traxia Analytics para toda escala. Desde operaciones únicas hasta redes empresariales multi-sede.',
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
  'Todos los módulos AI (retail, logística, seguridad, etc.)',
  'Copiloto AI conversacional',
  'Alertas en tiempo real (Slack, Teams, webhook)',
  'Reportes personalizados y exportación CSV/PDF',
  'API completa para integración con ERP/CRM',
  'SLA 99.9% uptime',
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
  { feature: 'Multi-sede centralizado', base: false, enterprise: true },
  { feature: 'Copiloto AI', base: false, enterprise: true },
  { feature: 'API de integración', base: false, enterprise: true },
  { feature: 'Todos los módulos verticales', base: false, enterprise: true },
  { feature: 'Soporte prioritario 24/7', base: false, enterprise: true },
  { feature: 'Implementación asistida', base: false, enterprise: true },
]

export default function PreciosPage() {
  return (
    <main className="flex-grow pt-[80px]">
      <section className="py-xxl md:py-[96px] bg-grid-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="relative max-w-container-max mx-auto px-gutter text-center">
          <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Precios</p>
          <h1 className="text-display font-display text-on-surface mb-4">
            Scale your spatial intelligence.
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Planes diseñados para cada escala de operación. Sin costos ocultos, sin compromiso de largo plazo el primer mes.
          </p>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md max-w-4xl mx-auto">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-2">Base Plan</p>
                <div className="mb-2">
                  <span className="text-headline-lg font-headline-lg text-on-surface">Consultar precio</span>
                </div>
                <p className="text-body-sm text-on-surface-variant">Ideal para operaciones de una sola sede con hasta 8 cámaras.</p>
              </div>
              <ul className="flex flex-col gap-3 flex-grow mb-8">
                {baseFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-success text-base mt-0.5 flex-shrink-0">check_circle</span>
                    <span className="text-body-sm text-on-surface-variant">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                Solicitar Cotización
              </button>
            </div>

            <div className="bg-primary rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-on-primary/10 rounded-full px-3 py-1">
                <span className="text-label-caps font-label-caps text-on-primary uppercase">Más Popular</span>
              </div>
              <div className="mb-6">
                <p className="text-label-caps font-label-caps text-on-primary/70 uppercase tracking-widest mb-2">Enterprise Plan</p>
                <div className="mb-2">
                  <span className="text-headline-lg font-headline-lg text-on-primary">Consultar precio</span>
                </div>
                <p className="text-body-sm text-on-primary/70">Para redes multi-sede con capacidades AI completas y soporte dedicado.</p>
              </div>
              <ul className="flex flex-col gap-3 flex-grow mb-8">
                {enterpriseFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-on-primary text-base mt-0.5 flex-shrink-0" style={{ filter: 'brightness(1.5)' }}>check_circle</span>
                    <span className="text-body-sm text-on-primary/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 bg-on-primary text-primary rounded-xl font-medium text-body-md hover:bg-on-primary/90 transition-colors">
                Solicitar Cotización
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-body-sm text-on-surface-variant">
              ¿Necesitas algo personalizado?{' '}
              <Link href="/#demo" className="text-primary font-medium hover:underline">
                Contáctanos
              </Link>{' '}
              y diseñamos un plan para tu operación.
            </p>
          </div>
        </div>
      </section>

      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">Comparación</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Comparativa de Características</h2>
          </div>
          <div className="overflow-x-auto max-w-3xl mx-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 text-body-sm font-medium text-on-surface-variant w-1/2">Característica</th>
                  <th className="text-center px-6 py-4 text-body-sm font-medium text-on-surface">Base</th>
                  <th className="text-center px-6 py-4 text-body-sm font-medium text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-t border-border-subtle">
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.base === 'boolean' ? (
                        row.base ? (
                          <span className="material-symbols-outlined text-success text-base">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-outline text-base">remove</span>
                        )
                      ) : (
                        <span className="text-body-sm text-on-surface font-medium">{row.base}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-outline text-base">remove</span>
                        )
                      ) : (
                        <span className="text-body-sm text-primary font-medium">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest mb-3">¿Preguntas?</p>
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">
              Hablemos de tu caso de uso
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              Nuestro equipo puede ayudarte a elegir el plan correcto y estimar el ROI esperado para tu operación específica.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/#demo" className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors">
                Hablar con un Especialista
              </Link>
              <Link href="/nosotros" className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium text-body-md hover:bg-surface-container-high transition-colors">
                Conocer el Equipo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import VerticalHero from '@/components/VerticalHero'

export const metadata: Metadata = {
  title: 'Retail — Inteligencia Espacial para Tiendas',
  description: 'Heatmaps de clientes, conversión por zona y análisis de góndola — con las cámaras que ya tienes. Sin hardware nuevo.',
}

const capabilities = [
  { icon: 'heatmap', title: 'Heatmaps de clientes', body: 'Visualiza en tiempo real las zonas con mayor tráfico, permanencia y conversión. Identifica puntos ciegos y áreas subutilizadas en tu tienda.' },
  { icon: 'schedule', title: 'Dwell time por zona', body: 'Mide el tiempo que los clientes pasan en cada sección. Cruza con datos de conversión para entender qué genera ventas.' },
  { icon: 'conversion_path', title: 'Conversión por sección', body: 'Detecta el porcentaje de visitantes que transitan por cada zona y correlaciona con tus datos de venta para optimizar la disposición.' },
  { icon: 'inventory_2', title: 'Alertas de góndola', body: 'Detecta cuando una sección lleva demasiado tiempo sin actividad de clientes — señal de quiebre de stock o disposición subóptima.' },
]

export default function RetailPage() {
  return (
    <main>
      <VerticalHero
        badge="Retail · Inteligencia Espacial"
        icon="storefront"
        h1={<>Inteligencia espacial para el <span className="gradient-text">retail moderno</span></>}
        subtitle="Convierte tus cámaras CCTV existentes en analítica del recorrido del cliente en tiempo real. Sin reemplazar ningún hardware."
        stats={[
          { value: '0', label: 'Cámaras nuevas' },
          { value: '100 %', label: 'Edge processing' },
          { value: '< 24 h', label: 'Go-live' },
        ]}
        secondaryCta="Ver Precios"
        liveStat="847"
        liveLabel="visitantes hoy — Zona Principal"
      />

      {/* Capabilities */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Capacidades</p>
            <h2 className="text-headline-lg text-on-surface">Analítica espacial de cliente, en tiempo real</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {capabilities.map((c, i) => (
              <div key={i} className="card-hover bg-white border border-slate-200 rounded-2xl p-7">
                <div className="w-11 h-11 bg-primary-fixed rounded-xl flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-primary text-[20px]">{c.icon}</span>
                </div>
                <h3 className="text-[17px] font-bold text-on-surface mb-3">{c.title}</h3>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live metrics */}
      <section className="py-24 bg-surface-alt">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Telemetría en Vivo</p>
            <h2 className="text-headline-lg text-on-surface">Métricas de retail en tiempo real</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: 'schedule', label: 'Dwell Time Promedio', value: '4.2', unit: 'min', trend: '+12% vs ayer', up: true },
              { icon: 'conversion_path', label: 'Conversión Zona A', value: '68', unit: '%', trend: '+8% esta semana', up: true },
              { icon: 'inventory_2', label: 'Alertas Quiebre Stock', value: '3', unit: '', trend: 'Pasillos 7, 12, 15', up: false, alert: true },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-primary text-[20px]">{m.icon}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${m.alert ? 'bg-red-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
                    <span className={`text-[11px] font-semibold ${m.alert ? 'text-red-500' : 'text-emerald-500'}`}>
                      {m.alert ? 'ALERTA' : 'EN VIVO'}
                    </span>
                  </div>
                </div>
                <p className="text-4xl font-black text-on-surface mb-1">
                  {m.value}<span className="text-lg text-on-surface-variant font-normal ml-1">{m.unit}</span>
                </p>
                <p className="text-[14px] text-on-surface-variant mb-3">{m.label}</p>
                <p className={`text-[12px] font-medium ${m.alert ? 'text-red-500' : 'text-emerald-500'}`}>{m.trend}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-on-surface-variant/50 mt-5">Ejemplo ilustrativo — datos de muestra, no de cliente real</p>
        </div>
      </section>

      {/* Architecture */}
      <section className="hero-bg py-24 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-3">Integración</p>
              <h2 className="text-headline-lg text-white mb-5">Hardware-free. Sin obras.</h2>
              <p className="text-body-lg text-white/50 mb-7 leading-relaxed">
                Traxia se conecta a tu CCTV existente vía RTSP u ONVIF. Sin cámaras nuevas, sin hardware propietario.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: 'videocam', text: 'Hikvision, Dahua, Axis, Bosch y más' },
                  { icon: 'memory', text: 'Procesamiento en el edge — video nunca sale de tus instalaciones' },
                  { icon: 'lock', text: 'Cero biométricos — detección por silueta anónima' },
                  { icon: 'bolt', text: 'Go-live en menos de 1 día hábil' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-blue-400 text-[16px]">{item.icon}</span>
                    </div>
                    <span className="text-[14px] text-white/60">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Architecture diagram */}
            <div className="glass-card glow-border rounded-2xl p-6 space-y-3">
              {[
                { label: 'Cámaras CCTV existentes', icon: 'videocam', color: 'bg-white/5 border-white/10' },
                { label: 'Edge Node (tu infraestructura)', icon: 'memory', color: 'bg-blue-500/10 border-blue-500/20' },
                { label: 'Modelos AI Traxia', icon: 'smart_toy', color: 'bg-purple-500/10 border-purple-500/20' },
                { label: 'Dashboard en la Nube', icon: 'cloud', color: 'bg-emerald-500/10 border-emerald-500/20' },
              ].map((item, i) => (
                <div key={i}>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${item.color}`}>
                    <span className="material-symbols-outlined text-white/60 text-[18px]">{item.icon}</span>
                    <span className="text-[13px] text-white/70 font-medium">{item.label}</span>
                  </div>
                  {i < 3 && (
                    <div className="flex justify-center py-1">
                      <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-on-surface mb-4">Ve tu tienda con ojos de IA.</h2>
          <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto">Demo en vivo con los datos de tu propia tienda en menos de 48 horas.</p>
          <Link href="/#demo" className="btn-gradient inline-flex px-8 py-4 rounded-xl text-[15px]">
            Agendar Demo Gratuita
          </Link>
        </div>
      </section>
    </main>
  )
}

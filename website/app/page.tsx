'use client'

import Link from 'next/link'
import DemoForm from '@/components/DemoForm'
import FAQ from '@/components/FAQ'

const verticals = [
  {
    icon: 'storefront',
    title: 'Retail',
    href: '/retail',
    features: [
      { icon: 'directions_walk', label: 'Análisis de Afluencia' },
      { icon: 'trending_up',     label: 'Tasa de Conversión' },
    ],
  },
  {
    icon: 'warehouse',
    title: 'Logística',
    href: '/logistica',
    features: [
      { icon: 'verified_user',   label: 'Cumplimiento de Almacén' },
      { icon: 'block',           label: 'Zonas de Exclusión de Personal' },
    ],
  },
  {
    icon: 'account_balance',
    title: 'Banca',
    href: '/banca',
    features: [
      { icon: 'groups',          label: 'Optimización de Filas' },
      { icon: 'security',        label: 'Inteligencia de Sucursal Segura' },
    ],
  },
  {
    icon: 'factory',
    title: 'Manufactura',
    href: '/manufactura',
    features: [
      { icon: 'health_and_safety', label: 'Cumplimiento de EPP' },
      { icon: 'sensors',           label: 'Alertas de Proximidad' },
    ],
  },
  {
    icon: 'local_hospital',
    title: 'Hospitales',
    href: '/hospitales',
    features: [
      { icon: 'groups',          label: 'Ocupación en Tiempo Real' },
      { icon: 'schedule',        label: 'Tiempos de Espera' },
    ],
  },
  {
    icon: 'directions_car',
    title: 'Concesionarias',
    href: '/concesionarias',
    features: [
      { icon: 'visibility',      label: 'Interés por Vehículo' },
      { icon: 'timer',           label: 'Tiempo de Atención' },
    ],
  },
]

const steps = [
  { icon: 'videocam',       title: 'Conecta tus cámaras',    desc: 'Protocolo RTSP/ONVIF — cualquier cámara IP existente.' },
  { icon: 'memory',         title: 'Procesamiento Edge',      desc: 'Los modelos AI corren en tu infraestructura, sin enviar video.' },
  { icon: 'cloud_sync',     title: 'Solo metadatos al cloud', desc: 'Conteos, zonas y eventos anonimizados — sin biometría.' },
  { icon: 'dashboard',      title: 'Dashboard en tiempo real',desc: 'Heatmaps, alertas y KPIs desde cualquier dispositivo.' },
  { icon: 'auto_awesome',   title: 'Copiloto AI',             desc: 'Consulta tus datos en lenguaje natural, sin reportes manuales.' },
]

export default function HomePage() {
  return (
    <main>

      {/* ── HERO — Light split layout ── */}
      <section className="relative bg-white pt-20 md:pt-28 pb-14 md:pb-20 overflow-hidden">
        <div className="line-grid absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left */}
            <div>
              <div className="badge-announce mb-8 w-fit">
                <span className="badge-new-pill">NUEVO</span>
                Traxia Copiloto AI ya está disponible
              </div>

              <h1 className="text-[38px] sm:text-[52px] lg:text-[60px] leading-[1.07] font-black tracking-tight text-on-surface mb-3">
                Analítica de IA Edge
              </h1>
              <p className="text-[38px] sm:text-[52px] lg:text-[60px] leading-[1.07] font-black tracking-tight gradient-text-violet mb-6">
                Sin Hardware
              </p>

              <p className="text-[17px] text-on-surface-variant leading-relaxed mb-8 max-w-[480px]">
                Transforma tu infraestructura de CCTV existente en una poderosa plataforma de inteligencia espacial. Analiza comportamiento, tráfico y operaciones sin capturar un solo dato biométrico. Creado para empresas B2B2B.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/#demo" className="btn-gradient px-6 py-3.5 rounded-xl text-[15px]">
                  Agendar Demo
                </Link>
                <Link href="/retail" className="btn-outline px-6 py-3.5 rounded-xl text-[15px]">
                  Explorar Plataforma
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { icon: 'verified_user', label: 'Zero Biometrics' },
                  { icon: 'memory',        label: 'Edge-native AI' },
                  { icon: 'bolt',          label: 'Deploy en < 24 h' },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 text-[13px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[15px]">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Product mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden">
                {/* Titlebar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-3 flex-1">
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-[11px] text-slate-400 font-mono w-fit mx-auto">
                      traxia.io/dashboard — Enterprise Spatial Intelligence
                    </div>
                  </div>
                </div>

                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-on-surface">Traxia Analytics</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[11px] text-slate-400">Lobby TA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600">NODO EDGE ACTIVO</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">10:15:48 AM</span>
                  </div>
                </div>

                {/* Main content */}
                <div className="grid sm:grid-cols-[160px_1fr_130px] grid-cols-1 h-[300px]">
                  {/* Left panel — metrics (hidden on mobile) */}
                  <div className="hidden sm:block border-r border-slate-100 p-3 space-y-3 bg-white">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1.5">Occupancy</p>
                      <div className="text-[18px] font-black text-on-surface">68%</div>
                      <div className="mt-2 flex items-end gap-0.5 h-10">
                        {[40,55,70,60,80,68,75,68].map((h,i)=>(
                          <div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`, background: i===7?'#6366f1':'#e0e7ff'}} />
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1.5">Flow Rate</p>
                      <div className="text-[18px] font-black text-on-surface">1.2 <span className="text-[11px] font-normal text-slate-400">P/s</span></div>
                      <div className="mt-2 relative h-10">
                        <svg viewBox="0 0 80 40" className="w-full h-full">
                          <polyline points="0,32 10,28 20,20 30,24 40,12 50,16 60,8 70,14 80,10"
                            fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="0,32 10,28 20,20 30,24 40,12 50,16 60,8 70,14 80,10 80,40 0,40"
                            fill="rgba(99,102,241,0.08)" stroke="none"/>
                        </svg>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Visitors</p>
                      <div className="text-[20px] font-black text-on-surface">14.8K</div>
                    </div>
                  </div>

                  {/* Center — CCTV mockup */}
                  <div className="relative bg-slate-100 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                      <rect width="400" height="300" fill="#e2e8f0"/>
                      <line x1="200" y1="60" x2="0"   y2="300" stroke="rgba(148,163,184,0.3)" strokeWidth="1"/>
                      <line x1="200" y1="60" x2="130" y2="300" stroke="rgba(148,163,184,0.3)" strokeWidth="1"/>
                      <line x1="200" y1="60" x2="270" y2="300" stroke="rgba(148,163,184,0.3)" strokeWidth="1"/>
                      <line x1="200" y1="60" x2="400" y2="300" stroke="rgba(148,163,184,0.3)" strokeWidth="1"/>
                      <line x1="60"  y1="160" x2="340" y2="160" stroke="rgba(148,163,184,0.25)" strokeWidth="1"/>
                      <line x1="20"  y1="220" x2="380" y2="220" stroke="rgba(148,163,184,0.25)" strokeWidth="1"/>
                      {/* Heatmap blobs */}
                      <ellipse cx="220" cy="230" rx="65" ry="35" fill="rgba(99,102,241,0.2)"/>
                      <ellipse cx="160" cy="190" rx="45" ry="25" fill="rgba(124,58,237,0.15)"/>
                      <ellipse cx="290" cy="200" rx="40" ry="22" fill="rgba(16,185,129,0.13)"/>
                      {/* Person boxes */}
                      <rect x="90"  y="120" width="28" height="60" rx="2" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
                      <rect x="155" y="130" width="26" height="58" rx="2" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
                      <rect x="245" y="110" width="30" height="65" rx="2" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
                      <rect x="305" y="125" width="27" height="60" rx="2" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
                      <rect x="200" y="140" width="25" height="55" rx="2" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
                      {/* Silhouettes */}
                      <circle cx="104" cy="118" r="7" fill="#94a3b8"/>
                      <rect x="97" y="126" width="14" height="20" rx="2" fill="#94a3b8"/>
                      <circle cx="168" cy="128" r="7" fill="#94a3b8"/>
                      <rect x="161" y="136" width="14" height="20" rx="2" fill="#94a3b8"/>
                      <circle cx="260" cy="108" r="8" fill="#64748b"/>
                      <rect x="252" y="117" width="16" height="22" rx="2" fill="#64748b"/>
                      <circle cx="318" cy="123" r="7" fill="#94a3b8"/>
                      <rect x="311" y="131" width="14" height="20" rx="2" fill="#94a3b8"/>
                      <circle cx="212" cy="138" r="6" fill="#94a3b8"/>
                      <rect x="206" y="145" width="12" height="18" rx="2" fill="#94a3b8"/>
                    </svg>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.3em] text-slate-400/30 uppercase">TRAXIA</div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1 border border-slate-200">
                      <span className="material-symbols-outlined text-emerald-500 text-[11px]">verified_user</span>
                      <span className="text-[9px] font-semibold text-slate-600">Anonymized · Privacy Compliant</span>
                    </div>
                  </div>

                  {/* Right panel (hidden on mobile) */}
                  <div className="hidden sm:block border-l border-slate-100 bg-white p-3 space-y-2">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400">Security Alerts</p>
                    {[
                      { color: 'bg-emerald-400', label: 'Zone A — clear' },
                      { color: 'bg-emerald-400', label: 'Zone B — clear' },
                      { color: 'bg-amber-400',   label: 'Zone C — busy' },
                    ].map((a,i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg p-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${a.color}`} />
                        <span className="text-[10px] text-slate-500">{a.label}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1.5">Traffic Density</p>
                      {['High','Mid','Low'].map((d,i)=>(
                        <div key={i} className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] text-slate-400 w-7">{d}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-400" style={{width:`${[75,45,20][i]}%`}} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Events Log</p>
                      {['10:15 — Zone C alert','10:12 — Peak detected','10:08 — New session'].map((e,i)=>(
                        <p key={i} className="text-[9px] text-slate-400 font-mono leading-relaxed">{e}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom metric bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Ocupación Actual</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[20px] font-black text-on-surface">142</span>
                        <span className="text-[12px] font-semibold text-emerald-500">↑ 12%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Permanencia</p>
                      <span className="text-[18px] font-black text-on-surface">8.4 <span className="text-[11px] font-normal text-slate-400">min</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-emerald-600">EN VIVO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERTICALS — Lavender bg, white cards ── */}
      <section className="py-24 bg-lavender">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-[30px] font-black text-on-surface tracking-tight mb-3">
              Diseñado para Verticales Clave
            </h2>
            <p className="text-[15px] text-on-surface-variant max-w-xl mx-auto">
              Inteligencia adaptada para tus necesidades operativas específicas. Impleméntalo al instante con cero hardware nuevo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {verticals.map((v) => (
              <Link key={v.title} href={v.href}
                className="bg-white border border-slate-200 rounded-2xl p-6 card-hover block group">
                <div className="w-12 h-12 bg-lavender-mid rounded-xl flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-primary text-[22px]">{v.icon}</span>
                </div>
                <h3 className="text-[18px] font-bold text-on-surface mb-4">{v.title}</h3>
                <div className="space-y-2 mb-5">
                  {v.features.map((f) => (
                    <div key={f.label} className="feature-pill">
                      <span className="material-symbols-outlined text-[14px] text-primary">{f.icon}</span>
                      {f.label}
                    </div>
                  ))}
                </div>
                <div className="text-[13px] font-semibold text-primary flex items-center gap-1.5 group-hover:gap-2 transition-all">
                  Más información
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COPILOTO AI — White bg, split ── */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-fixed border border-primary-fixed-dim rounded-full px-3 py-1.5 mb-7">
                <span className="material-symbols-outlined text-primary text-[14px]">auto_awesome</span>
                <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Copiloto AI</span>
              </div>
              <h2 className="text-[38px] font-black tracking-tight text-on-surface mb-5">
                Habla con tus datos<br/>en tiempo real
              </h2>
              <p className="text-[16px] text-on-surface-variant leading-relaxed mb-7">
                Nuestro Copiloto AI te permite realizar consultas complejas en lenguaje natural. Olvida los reportes estáticos; pregunta directamente sobre el tráfico, comportamiento de clientes o alertas de seguridad y obtén respuestas visuales al instante.
              </p>
              <ul className="space-y-3">
                {[
                  'Análisis conversacional de video',
                  'Generación automática de gráficos',
                  'Alertas predictivas inteligentes',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[15px] text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Dashboard + Chat mockup */}
            <div className="relative">
              {/* Main dashboard */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <span className="text-[13px] font-black text-primary tracking-tight">TRAXIA</span>
                  <div className="flex items-center gap-4 ml-2">
                    {[['VISITAS HOY','1,245'],['VENTAS','1,747'],['ALERTAS','163']].map(([k,v])=>(
                      <div key={k}>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">{k}</p>
                        <p className="text-[15px] font-black text-on-surface">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Heatmap area */}
                <div className="relative h-44 overflow-hidden bg-slate-800">
                  <svg className="w-full h-full" viewBox="0 0 400 176" preserveAspectRatio="none">
                    <rect width="400" height="176" fill="#1e293b"/>
                    <ellipse cx="130" cy="100" rx="80" ry="45" fill="rgba(99,102,241,0.35)"/>
                    <ellipse cx="260" cy="80"  rx="100" ry="55" fill="rgba(124,58,237,0.25)"/>
                    <ellipse cx="330" cy="130" rx="65"  ry="35" fill="rgba(16,185,129,0.2)"/>
                    <ellipse cx="190" cy="120" rx="60"  ry="30" fill="rgba(99,102,241,0.2)"/>
                    {[[65,65],[145,55],[215,60],[295,70],[345,63]].map(([x,y],i)=>(
                      <g key={i}>
                        <rect x={x-11} y={y} width="22" height="48" rx="2" fill="none" stroke={i%2===0?'#6366f1':'#a78bfa'} strokeWidth="1.5"/>
                        <circle cx={x} cy={y-2} r="7" fill="#94a3b8"/>
                        <rect x={x-6} y={y+6} width="12" height="18" rx="2" fill="#94a3b8"/>
                      </g>
                    ))}
                  </svg>
                  <div className="absolute bottom-2 left-3 text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">TRAXIA</div>
                </div>
                {/* Bottom charts */}
                <div className="grid grid-cols-2 border-t border-slate-100">
                  <div className="p-3 border-r border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">Visitas por hora</p>
                    <div className="flex items-end gap-0.5 h-9">
                      {[30,50,40,70,60,85,75,90].map((h,i)=>(
                        <div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`, background:i===7?'#6366f1':'#e0e7ff'}}/>
                      ))}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">Tendencia semanal</p>
                    <svg viewBox="0 0 100 36" className="w-full h-9">
                      <polyline points="0,30 14,24 28,20 42,22 56,12 70,16 84,7 100,9"
                        fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                      <polyline points="0,30 14,24 28,20 42,22 56,12 70,16 84,7 100,9 100,36 0,36"
                        fill="rgba(99,102,241,0.08)" stroke="none"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Chat panel floating — only on desktop to avoid overflow */}
              <div className="hidden lg:block absolute -right-3 top-6 w-52 bg-white rounded-xl border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 bg-primary">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-white text-[13px]">auto_awesome</span>
                    <span className="text-[10px] font-bold text-white">COPILOTO AI</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"/>
                </div>
                <div className="p-3 space-y-2.5">
                  <div className="flex justify-end">
                    <div className="bg-primary-fixed rounded-xl rounded-tr-sm px-2.5 py-1.5 max-w-[80%]">
                      <p className="text-[10px] text-primary font-medium">¿Cuántos clientes visitaron hoy?</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[10px]">auto_awesome</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">Visitas de hoy: <strong className="text-on-surface">1,245</strong>. Aquí están los datos.</p>
                      <div className="mt-1.5 flex items-end gap-0.5 h-6">
                        {[40,55,45,70,60,85,75,90].map((h,i)=>(
                          <div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`, background:i===7?'#6366f1':'#e0e7ff'}}/>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-lavender">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Funcionamiento</p>
            <h2 className="text-[30px] font-black text-on-surface tracking-tight">De cámaras existentes a decisiones en minutos</h2>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-[calc(10%+28px)] right-[calc(10%+28px)] h-px bg-primary-fixed-dim z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-white border-2 border-primary-fixed-dim rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-[24px]">{s.icon}</span>
                  </div>
                  <p className="text-[13px] font-bold text-on-surface mb-1.5">{s.title}</p>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRIVACY — Dark bento ── */}
      <section className="py-24 hero-bg relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <div className="badge-ai inline-flex mx-auto mb-5">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              Privacidad por Diseño
            </div>
            <h2 className="text-headline-lg text-white mb-3">Zero Biometrics. Siempre.</h2>
            <p className="text-[15px] text-white/50 max-w-xl mx-auto">
              Video procesado en el edge, nunca en la nube. Solo metadatos anonimizados salen de tus instalaciones.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: 'videocam_off',      title: 'Sin video en la nube', desc: 'El video permanece en tu infraestructura. Solo conteos y coordenadas anonimizadas se sincronizan.' },
              { icon: 'face_retouching_off', title: 'Zero Biometrics',    desc: 'Sin reconocimiento facial, sin huellas, sin datos personales. Cumplimiento por arquitectura, no por política.' },
              { icon: 'memory',             title: 'Edge-native',          desc: 'Modelos AI ejecutándose en tu hardware local. Latencia mínima, máxima privacidad, funciona sin internet.' },
            ].map((c, i) => (
              <div key={i} className="glass-card glow-border rounded-2xl p-7">
                <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-primary-light text-[20px]">{c.icon}</span>
                </div>
                <h3 className="text-[16px] font-bold text-white mb-2">{c.title}</h3>
                <p className="text-[13px] text-white/50 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO FORM ── */}
      <section id="demo" className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Demo Gratuita</p>
              <h2 className="text-[34px] font-black tracking-tight text-on-surface mb-4">
                Ve Traxia en acción con tus propias cámaras
              </h2>
              <p className="text-[16px] text-on-surface-variant leading-relaxed mb-8">
                Agenda una sesión personalizada. Nuestro equipo preparará una demo con los datos de tu operación específica — sin compromiso.
              </p>
              <div className="space-y-4">
                {[
                  { icon: 'schedule',         text: 'Respuesta en menos de 24 horas' },
                  { icon: 'settings_suggest', text: 'Demo adaptada a tu vertical e infraestructura' },
                  { icon: 'lock',             text: 'Sin instalaciones previas, sin compromiso' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                    </div>
                    <span className="text-[14px] text-on-surface-variant">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <DemoForm />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-lavender">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-black tracking-tight text-on-surface">Preguntas frecuentes</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — Dark ── */}
      <section className="py-24 hero-bg relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-0 pointer-events-none"
          style={{background:'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)'}}/>
        <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
          <h2 className="text-[36px] sm:text-[44px] font-black tracking-tight text-white mb-4">
            Empieza en menos de 24 horas.
          </h2>
          <p className="text-[16px] text-white/50 max-w-lg mx-auto mb-10">
            Sin hardware nuevo. Sin obras. Solo conecta tus cámaras existentes y empieza a tomar decisiones con datos reales.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#demo" className="btn-gradient px-8 py-4 rounded-xl text-[15px]">
              Agendar Demo Gratuita
            </Link>
            <Link href="/precios" className="px-8 py-4 rounded-xl text-[15px] font-semibold text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all">
              Ver Precios
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

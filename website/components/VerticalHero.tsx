import Link from 'next/link'

interface Stat { value: string; label: string }

interface VerticalHeroProps {
  badge: string
  icon: string
  h1: React.ReactNode
  subtitle: string
  stats: Stat[]
  primaryCta?: string
  secondaryCta?: string
  secondaryHref?: string
  liveStat?: string
  liveLabel?: string
}

export default function VerticalHero({
  badge, icon, h1, subtitle, stats,
  primaryCta = 'Agendar Demo',
  secondaryCta, secondaryHref = '/precios',
  liveStat, liveLabel,
}: VerticalHeroProps) {
  return (
    <section className="hero-bg relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 65%)' }} />
      <div className="relative z-10 max-w-container-max mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <div className="badge-ai mb-7">
              <span className="material-symbols-outlined text-[14px] text-blue-300">{icon}</span>
              {badge}
            </div>
            <h1 className="text-[28px] sm:text-[36px] md:text-display-sm font-display text-white mb-5 leading-tight">
              {h1}
            </h1>
            <p className="text-body-lg text-white/50 mb-8 max-w-lg leading-relaxed">{subtitle}</p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="glass-card rounded-xl px-3 py-4 text-center">
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-[11px] text-white/40 mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/#demo" className="btn-gradient px-6 py-3 rounded-xl text-[14px]">
                {primaryCta}
              </Link>
              {secondaryCta && (
                <Link href={secondaryHref}
                  className="px-6 py-3 rounded-xl text-[14px] font-medium text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all">
                  {secondaryCta}
                </Link>
              )}
            </div>
          </div>

          {/* Right — live window (hidden on mobile to keep hero clean) */}
          <div className="hidden md:block glass-card glow-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-hero-border">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              <div className="flex-1 flex items-center justify-center gap-2">
                <span className="live-dot" />
                <span className="text-[11px] text-emerald-400 font-medium">EN VIVO</span>
              </div>
            </div>
            <div className="p-8 flex flex-col items-center justify-center min-h-[220px] text-center">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-blue-400 text-[32px]">{icon}</span>
              </div>
              {liveStat && (
                <p className="text-4xl font-black text-white mb-1">{liveStat}</p>
              )}
              {liveLabel && (
                <p className="text-[13px] text-white/40">{liveLabel}</p>
              )}
              {!liveStat && (
                <p className="text-[12px] text-white/30 font-mono uppercase tracking-widest">Spatial Intelligence — Live</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

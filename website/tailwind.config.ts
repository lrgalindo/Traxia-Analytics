import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Hero / dark surfaces (vertical pages)
        "hero":         "#04060f",
        "hero-surface": "#080c18",
        "hero-card":    "#0d1425",
        "hero-border":  "#1c2640",
        // Backgrounds (light sections)
        "background":   "#ffffff",
        "surface":      "#ffffff",
        "surface-alt":  "#f8fafc",
        "lavender":     "#f5f3ff",      // verticals section bg
        "lavender-mid": "#ede9fe",      // card icon bg
        // Text
        "on-surface":         "#0f172a",
        "on-surface-variant": "#64748b",
        "inverse-surface":    "#04060f",
        "inverse-on-surface": "#e2e8f0",
        // Primary — indigo/violet (matches references)
        "primary":       "#6366f1",
        "primary-dark":  "#4f46e5",
        "primary-light": "#818cf8",
        "primary-fixed": "#eef2ff",
        "primary-fixed-dim": "#e0e7ff",
        "on-primary":    "#ffffff",
        "inverse-primary": "#a5b4fc",
        // Accent violet
        "accent":        "#7c3aed",
        "accent-light":  "#a78bfa",
        // Utility
        "border-subtle": "#e2e8f0",
        "outline":       "#94a3b8",
        "success":       "#10b981",
        "error":         "#ef4444",
        "error-bg":      "#fef2f2",
        "text-muted":    "#94a3b8",
        // Compat
        "on-primary-container": "#4338ca",
        "secondary":            "#475569",
        "secondary-container":  "#f1f5f9",
        "on-secondary":         "#ffffff",
        "surface-variant":      "#e2e8f0",
        "on-secondary-container": "#334155",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 60%), linear-gradient(180deg, #04060f 0%, #080c18 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        "blue-gradient": "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
        "text-gradient": "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
        "glow-radial":   "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.375rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1.125rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
        full: "9999px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        xxl: "80px",
        gutter: "24px",
      },
      maxWidth: {
        "container-max": "1200px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        "display": ["64px", { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "800" }],
        "display-sm": ["44px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" }],
        "headline-lg": ["36px", { lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.7", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-caps": ["11px", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "600" }],
        "code-data": ["13px", { lineHeight: "1.6", fontWeight: "500" }],
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
        "blue": "0 4px 20px rgba(99,102,241,0.35)",
        "blue-sm": "0 2px 10px rgba(99,102,241,0.25)",
        "glow-blue": "0 0 0 1px rgba(99,102,241,0.3), 0 4px 24px rgba(99,102,241,0.2)",
        "glow-card": "0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)",
        "lg": "0 10px 40px rgba(0,0,0,0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "ticker": "ticker 30s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "border-spin": "borderSpin 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(99,102,241,0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(99,102,241,0.7)" },
        },
        borderSpin: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [],
}

export default config

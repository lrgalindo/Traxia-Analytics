import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "background": "#FFFFFF",
        "surface": "#FFFFFF",
        "surface-alt": "#F9FAFB",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F9FAFB",
        "surface-container": "#F3F4F6",
        "surface-container-high": "#E5E7EB",
        "surface-dim": "#D1D5DB",
        // Text
        "on-surface": "#111827",
        "on-surface-variant": "#6B7280",
        "inverse-surface": "#0A0F1E",
        "inverse-on-surface": "#F9FAFB",
        // Primary (enterprise blue)
        "primary": "#1A56DB",
        "primary-dark": "#1E40AF",
        "primary-light": "#3B82F6",
        "primary-fixed": "#EFF6FF",
        "primary-fixed-dim": "#DBEAFE",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#1E40AF",
        "inverse-primary": "#60A5FA",
        // Secondary
        "secondary": "#4B5563",
        "secondary-container": "#F3F4F6",
        "on-secondary": "#FFFFFF",
        // Utility
        "border-subtle": "#E5E7EB",
        "outline": "#9CA3AF",
        "success": "#059669",
        "error": "#DC2626",
        "error-bg": "#FEF2F2",
        "error-border": "#FECACA",
        "error-fg": "#DC2626",
        "text-muted": "#9CA3AF",
        // Legacy compat
        "surface-variant": "#E5E7EB",
        "on-background": "#111827",
        "surface-bright": "#FFFFFF",
        "surface-tint": "#1A56DB",
        "secondary-fixed": "#F3F4F6",
        "on-secondary-container": "#374151",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        '2xl': "1.25rem",
        full: "9999px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "64px",
        gutter: "24px",
        base: "8px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-caps": ["Inter", "sans-serif"],
        "code-data": ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        display: ["56px", { lineHeight: "64px", letterSpacing: "-0.025em", fontWeight: "700" }],
        "headline-lg": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "600" }],
        "code-data": ["13px", { lineHeight: "18px", letterSpacing: "0.01em", fontWeight: "500" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.08)",
        "blue": "0 4px 14px 0 rgba(26,86,219,0.25)",
        "lg": "0 10px 25px -3px rgba(0,0,0,0.08), 0 4px 10px -4px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
}

export default config

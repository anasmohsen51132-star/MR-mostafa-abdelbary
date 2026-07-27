import type { Config } from "tailwindcss";

// ============================================================================
// CHEMISTRY DESIGN SYSTEM — Tailwind Token Layer
// ============================================================================
// Single source of truth for color lives in src/app/globals.css (:root CSS
// variables). Every color below reads from a CSS variable via the
// `rgb(var(--x-rgb) / <alpha-value>)` pattern, so Tailwind's opacity
// modifiers (e.g. `bg-cyan/10`) keep working AND the actual color can be
// changed in exactly one place (globals.css) without touching this file
// or any component.
//
// DEPRECATED TOKENS: `gold`, `emerald`, `cream`, `ink`, and the legacy
// gradient/shadow names below are kept only so existing components that
// still reference them (e.g. `bg-gold/10`, `text-emerald`) continue to
// compile and render — but they now resolve to Chemistry Design System
// colors, not the old Arabic-academy gold/emerald palette. New code
// should use the non-deprecated names (`cyan`, `navy`, `labGreen`,
// `atomOrange`, `surface`, `ink`) directly. Deprecated keys will be
// removed once the page-level migration (see audit roadmap) replaces
// every remaining usage.
// ============================================================================

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Primary surface: Deep Science Navy ----------------------
        navy: {
          DEFAULT: "rgb(var(--chem-navy-rgb) / <alpha-value>)",
          mid: "rgb(var(--chem-navy-mid-rgb) / <alpha-value>)",
          light: "rgb(var(--chem-navy-light-rgb) / <alpha-value>)",
          blue: "rgb(var(--chem-blue-rgb) / <alpha-value>)",
          "blue-light": "rgb(var(--chem-blue-light-rgb) / <alpha-value>)",
        },

        // ---- Primary accent: Electric Cyan ----------------------------
        cyan: {
          DEFAULT: "rgb(var(--cyan-rgb) / <alpha-value>)",
          light: "rgb(var(--cyan-light-rgb) / <alpha-value>)",
          dark: "rgb(var(--cyan-dark-rgb) / <alpha-value>)",
          50: "#E5FBFF",
          100: "#CCF7FF",
          200: "#99EEFF",
          300: "#66E5FF",
          400: "#33DCFF",
          500: "rgb(var(--cyan-rgb) / <alpha-value>)",
          600: "rgb(var(--cyan-dark-rgb) / <alpha-value>)",
          700: "#007D99",
          800: "#005266",
          900: "#002933",
        },

        // ---- Secondary accent: Laboratory Green -----------------------
        labGreen: {
          DEFAULT: "rgb(var(--lab-green-rgb) / <alpha-value>)",
          dark: "rgb(var(--lab-green-dark-rgb) / <alpha-value>)",
        },

        // ---- Highlight accent: Atomic Orange ---------------------------
        atomOrange: {
          DEFAULT: "rgb(var(--atom-orange-rgb) / <alpha-value>)",
          light: "rgb(var(--atom-orange-light-rgb) / <alpha-value>)",
        },

        // ---- Neutral surfaces & text ------------------------------------
        surface: {
          DEFAULT: "rgb(var(--surface-rgb) / <alpha-value>)",
          dark: "rgb(var(--surface-dark-rgb) / <alpha-value>)",
          soft: "rgb(var(--white-soft-rgb) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          muted: "rgb(var(--ink-muted-rgb) / <alpha-value>)",
          light: "rgb(var(--ink-light-rgb) / <alpha-value>)",
        },

        // ---- Semantic state colors ---------------------------------------
        success: "rgb(var(--lab-green-rgb) / <alpha-value>)",
        warning: "rgb(var(--atom-orange-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        info: "rgb(var(--cyan-rgb) / <alpha-value>)",

        // ================================================================
        // DEPRECATED — mapped to Chemistry Design System, do not use in
        // new code. See header comment.
        // ================================================================
        gold: {
          DEFAULT: "rgb(var(--cyan-rgb) / <alpha-value>)",
          light: "rgb(var(--cyan-light-rgb) / <alpha-value>)",
          dark: "rgb(var(--cyan-dark-rgb) / <alpha-value>)",
          50: "#E5FBFF",
          100: "#CCF7FF",
          200: "#99EEFF",
          300: "#66E5FF",
          400: "#33DCFF",
          500: "rgb(var(--cyan-rgb) / <alpha-value>)",
          600: "rgb(var(--cyan-dark-rgb) / <alpha-value>)",
          700: "#007D99",
          800: "#005266",
          900: "#002933",
        },
        emerald: {
          DEFAULT: "rgb(var(--chem-blue-rgb) / <alpha-value>)",
          light: "rgb(var(--chem-blue-light-rgb) / <alpha-value>)",
          dark: "rgb(var(--chem-navy-rgb) / <alpha-value>)",
          50: "#EAF1FB",
          100: "#CBDDF4",
          200: "#9CBFE9",
          300: "#6D9FDC",
          400: "#3F7FCE",
          500: "rgb(var(--chem-blue-rgb) / <alpha-value>)",
          600: "rgb(var(--chem-blue-light-rgb) / <alpha-value>)",
          700: "rgb(var(--chem-navy-light-rgb) / <alpha-value>)",
          800: "rgb(var(--chem-navy-mid-rgb) / <alpha-value>)",
          900: "rgb(var(--chem-navy-rgb) / <alpha-value>)",
        },
        cream: {
          DEFAULT: "rgb(var(--surface-rgb) / <alpha-value>)",
          dark: "rgb(var(--surface-dark-rgb) / <alpha-value>)",
        },
      },

      fontFamily: {
        // "amiri" intentionally removed — see globals.css header comment.
        // Amiri is no longer loaded as a web font anywhere in the app.
        cairo: ["Cairo", "Tajawal", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },

      // Typographic hierarchy tokens (additive — opt-in for future pages).
      // `text-display` / `text-h1` .. `text-badge` give every future
      // screen one consistent scale instead of ad hoc inline fontSize.
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 4.75rem)", { lineHeight: "1.1", fontWeight: "900" }],
        h1: ["clamp(1.75rem, 4vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "800" }],
        h2: ["clamp(1.375rem, 3vw, 1.75rem)", { lineHeight: "1.25", fontWeight: "700" }],
        h3: ["1.25rem", { lineHeight: "1.3", fontWeight: "700" }],
        h4: ["1.0625rem", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.7", fontWeight: "400" }],
        caption: ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        btn: ["0.9375rem", { lineHeight: "1", fontWeight: "700" }],
        label: ["0.75rem", { lineHeight: "1.4", fontWeight: "600" }],
        badge: ["0.6875rem", { lineHeight: "1", fontWeight: "700" }],
      },

      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        pulse: "pulse 2s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease forwards",
        "bounce-light": "bounceLight 1s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(3deg)" },
          "66%": { transform: "translateY(-6px) rotate(-2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        slideIn: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        bounceLight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          // Chemistry cyan glow (previously old gold rgba(201,168,76,...)).
          // `.animate-glow` has no callers in the codebase today, so this
          // value change is purely forward-looking and risk-free.
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,212,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,212,255,0.6)" },
        },
      },

      // Reusable shadow language. `gold`/`gold-lg`/`emerald`/`emerald-lg`
      // kept as deprecated aliases of the new glow tokens for backwards
      // compatibility; `glass`/`glass-lg` re-tinted from the old warm-ink
      // rgba to the new navy rgba (still used today by Toast.tsx).
      boxShadow: {
        "glow-cyan": "0 4px 16px rgba(0,212,255,0.35)",
        "glow-cyan-lg": "0 8px 32px rgba(0,212,255,0.45)",
        "glow-green": "0 4px 16px rgba(0,255,136,0.3)",
        "glow-green-lg": "0 8px 32px rgba(0,255,136,0.4)",
        card: "0 1px 2px rgba(10,15,30,0.04), 0 8px 24px rgba(0,212,255,0.08)",
        elevated: "0 20px 60px rgba(10,15,30,0.18), 0 2px 6px rgba(10,15,30,0.06)",
        glass: "0 8px 32px rgba(10,15,30,0.12)",
        "glass-lg": "0 20px 60px rgba(10,15,30,0.25)",
        // deprecated
        gold: "0 4px 16px rgba(0,212,255,0.35)",
        "gold-lg": "0 8px 32px rgba(0,212,255,0.45)",
        emerald: "0 4px 16px rgba(26,58,107,0.3)",
        "emerald-lg": "0 8px 32px rgba(26,58,107,0.4)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },

      // Blur tokens matching the .glass / .glass-dark utilities already
      // defined in globals.css, so both places stay in sync.
      blur: {
        glass: "16px",
        "glass-lg": "20px",
      },

      // Motion timing tokens — one consistent set of durations/easings
      // instead of ad hoc per-component numbers.
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },

      backgroundImage: {
        "cyan-gradient": "linear-gradient(135deg, #00D4FF, #0099CC)",
        "green-gradient": "linear-gradient(135deg, #00FF88, #00CC6A)",
        "hero-gradient": "linear-gradient(135deg, #0A0F1E 0%, #111E38 50%, #0A0F1E 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)",
        "molecule-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='3' fill='%2300D4FF' fill-opacity='0.08'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%2300D4FF' fill-opacity='0.06'/%3E%3Ccircle cx='50' cy='50' r='2' fill='%2300D4FF' fill-opacity='0.06'/%3E%3C/g%3E%3C/svg%3E\")",
        // deprecated aliases — unused directly in JSX today (audit found
        // no `bg-gold-gradient` / `bg-emerald-gradient` / `bg-arabic-pattern`
        // callers), kept only in case a future page-level task references
        // them before the full migration lands.
        "gold-gradient": "linear-gradient(135deg, #00D4FF, #0099CC)",
        "emerald-gradient": "linear-gradient(135deg, #1A3A6B, #0A0F1E)",
      },
    },
  },
  plugins: [],
};

export default config;

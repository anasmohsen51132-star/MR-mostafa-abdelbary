"use client";
// src/components/theme/ThemeToggle.tsx
// TASK 06 — Theme System
//
// Accessible light/dark toggle. Rendered once, floating, in the root
// layout (src/app/layout.tsx) so it's reachable on literally every route
// (landing, auth, and all four role dashboards) without needing to touch
// each area's own header/sidebar individually. `floating` can be set to
// false to instead embed it inline inside a future header/sidebar.
import { m as motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  floating?: boolean;
  className?: string;
}

export function ThemeToggle({ floating = false, className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      className={className}
      style={{
        position: floating ? "fixed" : "relative",
        // RTL layout — bottom-start visually reads as bottom-right; using
        // `insetInlineStart` keeps it correct in RTL without a manual flip.
        ...(floating ? { bottom: 20, insetInlineStart: 20, zIndex: 60 } : {}),
        width: 44,
        height: 44,
        minWidth: 44,
        minHeight: 44, // WCAG touch-target minimum, matches the rest of the app
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--ds-border)",
        background: "var(--ds-bg-elevated)",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition:
          "background var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard), transform var(--duration-fast) var(--ease-spring)",
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.9)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ fontSize: 18, lineHeight: 1 }}
        aria-hidden="true"
      >
        {isDark ? "🌙" : "☀️"}
      </motion.span>
    </button>
  );
}

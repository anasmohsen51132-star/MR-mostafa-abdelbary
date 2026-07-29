"use client";
// src/components/theme/ThemeProvider.tsx
//
// TASK 06 — Theme System
//
// React-side half of the theme system. The other half is the blocking
// no-flash script (src/lib/theme-script.ts) injected in the root layout,
// which runs BEFORE this component ever mounts and already sets the
// correct `data-theme` attribute + `dark` class on <html>. This provider
// therefore doesn't need to "apply" the initial theme so much as pick up
// state that matches what's already rendered on screen, then take over
// responsibility for every change after that (explicit toggles, and the
// OS-level preference changing live while the user is in "system" mode).
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** What the user explicitly picked, or "system" if they never overrode it. */
  theme: ThemePreference;
  /** What's actually being rendered right now — always "light" or "dark". */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  /** Flips resolvedTheme and stores it as an explicit choice (leaves "system" mode). */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // localStorage unavailable (Safari private mode, disabled storage, etc.)
    // — fall back to system preference rather than throwing.
  }
  return "system";
}

function applyThemeToDom(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.classList.toggle("dark", resolved === "dark");
  // Lets native form controls, scrollbars, and the browser's own UI
  // (e.g. Safari's status bar tint on iOS) follow the theme too.
  root.style.colorScheme = resolved;

  // The <meta name="theme-color"> tag set via viewport.themeColor in
  // layout.tsx only follows the OS-level prefers-color-scheme media
  // query — it has no way to know about an explicit in-app toggle that
  // overrides the OS setting. Updating it here keeps the mobile browser
  // chrome color correct even when the user's choice disagrees with
  // their system setting.
  // viewport.themeColor's array form in layout.tsx renders TWO separate
  // <meta name="theme-color" media="..."> tags (one per color-scheme).
  // Setting both to the same resolved color means an explicit in-app
  // choice reliably overrides the OS preference regardless of which of
  // the two tags the browser happens to be honoring.
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", resolved === "dark" ? "#0A0F1E" : "#F0F4FF"));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializers read the same storage key the blocking script
  // already used before this component mounted, so this never disagrees
  // with what's already painted on screen.
  const [theme, setThemeState] = useState<ThemePreference>(() => readStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const t = readStoredTheme();
    return t === "system" ? getSystemTheme() : t;
  });
  const isFirstApply = useRef(true);

  // Recompute resolvedTheme whenever the explicit choice changes, AND
  // whenever the OS-level preference changes while in "system" mode.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const recompute = () => {
      setResolvedTheme(theme === "system" ? (mql.matches ? "dark" : "light") : theme);
    };
    recompute();
    mql.addEventListener("change", recompute);
    return () => mql.removeEventListener("change", recompute);
  }, [theme]);

  // Apply resolvedTheme to the DOM. The very first run is a no-op as far
  // as the user can see (the no-flash script already set the correct
  // attribute pre-paint) — skip the transition-animation class on that
  // first run specifically so mounting the app never itself triggers a
  // visible "flash of transition."
  useEffect(() => {
    const root = document.documentElement;
    if (isFirstApply.current) {
      isFirstApply.current = false;
      applyThemeToDom(resolvedTheme);
      return;
    }
    root.classList.add("theme-transition");
    applyThemeToDom(resolvedTheme);
    const t = window.setTimeout(() => root.classList.remove("theme-transition"), 320);
    return () => window.clearTimeout(t);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage write failed (private mode / quota) — theme still works
      // for this session via React state, it just won't persist.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme() must be used inside <ThemeProvider>");
  return ctx;
}

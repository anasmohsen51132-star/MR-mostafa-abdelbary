// src/lib/theme-script.ts
//
// TASK 06 — Theme System
//
// Single source of truth for the localStorage key AND the theme-detection
// logic, shared by two very different consumers that must never drift out
// of sync with each other:
//   1. The blocking inline <script> injected in src/app/layout.tsx, which
//      runs before first paint (see getNoFlashScript()) to avoid a flash
//      of the wrong theme.
//   2. ThemeProvider's own lazy React state initializer, which reads the
//      exact same key/logic on mount so its internal state matches what's
//      already on screen (set by #1) with no visible flip and no
//      server/client mismatch.
//
// This project serves a strict, nonce-based CSP (script-src 'self'
// 'nonce-<value>' 'strict-dynamic'; see middleware.ts) — any inline
// <script> WITHOUT the request's nonce is silently blocked by the browser.
// getNoFlashScript()'s output must always be rendered with
// `<script nonce={nonce} ...>` using the nonce read via headers() in the
// root layout, or this script simply won't run and every page load will
// flash the wrong theme.

export const THEME_STORAGE_KEY = "mr-theme";

/**
 * Returns the raw JS source (as a string) for the pre-hydration
 * no-flash-of-wrong-theme script. Kept as a plain string (not a function
 * reference) because it has to be serialized into a <script> tag's
 * innerHTML — it cannot close over anything from the React tree.
 */
export function getNoFlashScript(): string {
  const key = JSON.stringify(THEME_STORAGE_KEY);
  return `(function(){try{var k=${key};var v=localStorage.getItem(k);var t=(v==="light"||v==="dark")?v:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.setAttribute("data-theme",t);r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){}})();`;
}

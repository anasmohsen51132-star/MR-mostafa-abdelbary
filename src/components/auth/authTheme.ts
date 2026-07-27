// src/components/auth/authTheme.ts
//
// Shared design tokens for the Authentication Experience only.
// Pulled directly from the same Chemistry Academy language already used on
// the landing page (see src/components/landing/HeroSection.tsx and the
// --chem-* variables in globals.css): deep navy surfaces, electric cyan +
// lab green accents, soft glassmorphism, Cairo/Tajawal typography.
//
// Centralizing these here means LoginForm/RegisterForm/the auth pages all
// stay visually identical to each other and to the rest of the product,
// instead of drifting the way the old per-file inline styles did.

import type { CSSProperties } from "react";

export const authColors = {
  navyDeep: "#0A0F1E",
  navyMid: "#0D1528",
  navyLight: "#111E38",
  cyan: "#00D4FF",
  cyanLight: "#7AE8FF",
  cyanDark: "#0099CC",
  labGreen: "#00FF88",
  labGreenDark: "#00CC6A",
  atomOrange: "#FF6B35",
  textPrimary: "#F8FAFF",
  textMuted: "rgba(248,250,255,0.6)",
  textFaint: "rgba(248,250,255,0.4)",
  danger: "#FF6B6B",
};

export const authBackground =
  "linear-gradient(135deg,#0A0F1E 0%,#0D1528 60%,#111E38 100%)";

export const authAccentGradient = `linear-gradient(135deg,${authColors.cyan},${authColors.labGreen})`;

export const authFieldStyle: CSSProperties = {
  width: "100%",
  minHeight: 52,
  boxSizing: "border-box",
  padding: "14px 46px 14px 16px",
  borderRadius: 12,
  border: "1.5px solid rgba(0,212,255,0.18)",
  background: "rgba(255,255,255,0.04)",
  color: authColors.textPrimary,
  fontFamily: "Cairo, sans-serif",
  fontSize: "clamp(14px, 3.8vw, 15px)",
  outline: "none",
  direction: "rtl",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
};

export const authLabelStyle: CSSProperties = {
  fontFamily: "Cairo, sans-serif",
  color: "rgba(248,250,255,0.78)",
  fontSize: "clamp(12px, 3.5vw, 13px)",
  fontWeight: 600,
  marginBottom: 7,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

export function focusAuthField(element: HTMLInputElement | HTMLSelectElement) {
  element.style.borderColor = "rgba(0,212,255,0.65)";
  element.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.12)";
  element.style.background = "rgba(255,255,255,0.06)";
}

export function blurAuthField(element: HTMLInputElement | HTMLSelectElement) {
  element.style.borderColor = "rgba(0,212,255,0.18)";
  element.style.boxShadow = "none";
  element.style.background = "rgba(255,255,255,0.04)";
}

export function invalidAuthField(element: HTMLInputElement | HTMLSelectElement) {
  element.style.borderColor = "rgba(255,107,107,0.6)";
  element.style.boxShadow = "0 0 0 3px rgba(255,107,107,0.12)";
}

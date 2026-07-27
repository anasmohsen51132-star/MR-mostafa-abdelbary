"use client";
// src/components/auth/AuthPageShell.tsx
//
// Shared visual shell for /login and /register. Matches the landing page's
// hero exactly: same deep-navy gradient, molecule dot grid, glass navbar
// language turned into a glass card, and the same atom logo mark — so
// leaving the landing page and opening Login/Register feels like staying
// in the same product instead of falling back into the old platform.

import { m as motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { authBackground, authAccentGradient, authColors } from "./authTheme";

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  maxWidth?: number;
  children: ReactNode;
}

export function AuthPageShell({ title, subtitle, maxWidth = 460, children }: AuthPageShellProps) {
  return (
    <main
      className="min-h-screen relative flex justify-center overflow-x-hidden"
      style={{
        minHeight: "100dvh",
        alignItems: "center",
        background: authBackground,
        padding: "clamp(16px, 4vw, 32px)",
      }}
    >
      {/* Molecule dot grid — identical to the landing hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,212,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient glows */}
      <div
        className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,212,255,0.13),transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,255,136,0.10),transparent 70%)" }}
      />

      {/* One quiet atom mark — restrained, not overused */}
      <motion.div
        className="absolute pointer-events-none select-none hidden sm:block"
        style={{ top: "-4%", left: "-3%", zIndex: 1 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
      >
        <svg width={170} height={170} viewBox="0 0 120 120" fill="none" style={{ opacity: 0.1 }}>
          <ellipse cx="60" cy="60" rx="50" ry="18" stroke={authColors.cyan} strokeWidth="1.5" />
          <ellipse cx="60" cy="60" rx="50" ry="18" stroke={authColors.cyan} strokeWidth="1.5" transform="rotate(60 60 60)" />
          <ellipse cx="60" cy="60" rx="50" ry="18" stroke={authColors.cyan} strokeWidth="1.5" transform="rotate(120 60 60)" />
          <circle cx="60" cy="60" r="7" fill={authColors.cyan} />
        </svg>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full"
        style={{
          maxWidth,
          margin: "auto",
          background: "rgba(10,15,30,0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(0,212,255,0.18)",
          borderRadius: "clamp(20px, 5vw, 24px)",
          padding: "clamp(22px, 6vw, 40px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
          style={{ background: `linear-gradient(90deg,transparent,${authColors.cyan},transparent)` }}
        />

        {/* Brand header */}
        <div className="text-center" dir="rtl" style={{ marginBottom: "clamp(20px, 5vw, 28px)" }}>
          <div
            className="mx-auto flex items-center justify-center"
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: authAccentGradient,
              marginBottom: 14,
              fontSize: 22,
              boxShadow: "0 6px 20px rgba(0,212,255,0.35)",
            }}
          >
            ⚛
          </div>

          <h1
            style={{
              fontFamily: "Cairo, sans-serif",
              color: authColors.cyanLight,
              fontSize: "clamp(21px,5vw,28px)",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: 6,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontFamily: "Cairo, sans-serif",
              color: authColors.textMuted,
              fontSize: "clamp(12px,3.5vw,13.5px)",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </div>

        {children}

        <div className="text-center" style={{ marginTop: 22 }}>
          <Link
            href="/"
            style={{
              fontFamily: "Cairo, sans-serif",
              color: authColors.textFaint,
              fontSize: "clamp(11px,3vw,12px)",
              textDecoration: "none",
            }}
          >
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

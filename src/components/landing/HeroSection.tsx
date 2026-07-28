"use client";
// src/components/landing/HeroSection.tsx — Chemistry Academy Edition
import { m as motion } from "framer-motion";
import Link from "next/link";
import type { SiteSettings } from "@/types";
import { MixingSolutionsAnimation } from "@/components/effects/MixingSolutionsAnimation";
import { TwinklingStars } from "@/components/effects/TwinklingStars";

interface Props {
  settings: Partial<SiteSettings> | null;
}

const STATS_DEFAULT = [
  { value: "٥٠٠٠+", label: "طالب مسجل"   },
  { value: "٢٠",    label: "كورس متاح"    },
  { value: "١٥+",   label: "سنة خبرة"     },
  { value: "٩٨٪",  label: "نسبة النجاح"  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 220, damping: 20, delay },
  }),
};

// Atom SVG decorative component
function AtomDecor({ size = 120, opacity = 0.12, color = "#00D4FF" }: { size?: number; opacity?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ opacity }}>
      <ellipse cx="60" cy="60" rx="50" ry="18" stroke={color} strokeWidth="1.5" />
      <ellipse cx="60" cy="60" rx="50" ry="18" stroke={color} strokeWidth="1.5" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="50" ry="18" stroke={color} strokeWidth="1.5" transform="rotate(120 60 60)" />
      <circle cx="60" cy="60" r="7" fill={color} />
      <circle cx="110" cy="60" r="4" fill={color} />
    </svg>
  );
}

export function HeroSection({ settings }: Props) {
  let statsBar = STATS_DEFAULT;
  try {
    if (settings?.statsBar && Array.isArray(settings.statsBar)) {
      statsBar = settings.statsBar;
    }
  } catch { statsBar = STATS_DEFAULT; }

  const btnGradient = `linear-gradient(135deg,${settings?.buttonColor || "#00D4FF"},${settings?.hoverColor || "#00FF88"})`;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={
        settings?.heroBackgroundImage
          ? {
              backgroundImage: `linear-gradient(135deg,rgba(10,15,30,0.92) 0%,rgba(13,21,40,0.92) 100%), url(${settings.heroBackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: "linear-gradient(135deg,#0A0F1E 0%,#0D1528 60%,#111E38 100%)" }
      }
    >
      {/* ── Molecule dot grid pattern ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(0,212,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
      }} />

      {/* ── Ambient effects ── */}
      <TwinklingStars />

      {/* ── Glow orbs ── */}
      <motion.div
        className="absolute top-16 right-8 sm:right-24 w-48 h-48 sm:w-80 sm:h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,212,255,0.13),transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-24 left-4 sm:left-16 w-36 h-36 sm:w-56 sm:h-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,255,136,0.10),transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* ── Decorative atoms — hidden on small mobile ── */}
      <motion.div
        className="absolute pointer-events-none select-none hidden sm:block"
        style={{ top: "-2%", right: "-2%", zIndex: 1 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <AtomDecor size={180} opacity={0.15} />
      </motion.div>
      <motion.div
        className="absolute pointer-events-none select-none hidden md:block"
        style={{ bottom: "-3%", left: "-2%", zIndex: 1 }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <AtomDecor size={160} opacity={0.12} color="#00FF88" />
      </motion.div>

      {/* ── Navbar ── */}
      <nav
        className="absolute top-0 inset-x-0 h-16 flex items-center z-20"
        style={{
          background: "rgba(10,15,30,0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,212,255,0.12)",
          padding: "0 clamp(12px,4vw,32px)",
        }}
      >
        {/* Logo + name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: "linear-gradient(135deg,#00D4FF,#00FF88)" }}
          >
            ⚛
          </div>
          <div className="min-w-0">
            <span
              className="font-bold leading-tight block truncate"
              style={{ color: "#7AE8FF", fontSize: "clamp(11px,3vw,15px)", fontFamily: "Cairo,sans-serif" }}
            >
              {settings?.platformName ?? "أكاديمية مستر مصطفى عبد الباري"}
            </span>
            <span style={{ color: "rgba(0,212,255,0.45)", fontSize: 10, fontFamily: "Cairo,sans-serif" }}>
              {settings?.platformTagline ?? "لتدريس الكيمياء"}
            </span>
          </div>
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/login"
            className="transition-colors whitespace-nowrap"
            style={{
              color: "rgba(122,232,255,0.75)",
              fontFamily: "Cairo,sans-serif",
              fontSize: "clamp(12px,3vw,14px)",
              padding: "8px 12px",
            }}
          >
            دخول
          </Link>
          <Link
            href="/register"
            className="rounded-xl font-semibold transition-all whitespace-nowrap hover:-translate-y-0.5"
            style={{
              background: btnGradient,
              boxShadow: "0 4px 16px rgba(0,212,255,0.3)",
              color: "#0A0F1E",
              fontFamily: "Cairo,sans-serif",
              fontWeight: 700,
              fontSize: "clamp(12px,3vw,14px)",
              padding: "8px clamp(12px,3vw,20px)",
            }}
          >
            إنشاء حساب
          </Link>
        </div>
      </nav>

      {/* ── Hero Content ── */}
      <div
        className="relative z-10 text-center w-full"
        style={{ padding: "96px clamp(16px,5vw,40px) 96px" }}
      >
        {/* Signature visual — two solutions mixing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.05 }}
          className="mb-4"
        >
          <MixingSolutionsAnimation maxWidth={220} />
        </motion.div>

        {/* Platform badge */}
        <motion.div
          initial="hidden" animate="show" custom={0} variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full mb-6"
          style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.22)",
            padding: "6px 16px",
          }}
        >
          <span style={{ fontSize: 14 }}>⚗️</span>
          <span style={{ color: "#7AE8FF", fontFamily: "Cairo,sans-serif", fontSize: "clamp(11px,3vw,13px)" }}>
            المنصة الأولى لتدريس الكيمياء في مصر
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial="hidden" animate="show" custom={0.15} variants={fadeUp}
          style={{
            fontFamily: "Cairo,sans-serif",
            fontWeight: 900,
            color: "#FFFFFF",
            fontSize: "clamp(32px,8vw,76px)",
            lineHeight: 1.15,
            marginBottom: 8,
            textShadow: "0 0 40px rgba(0,212,255,0.25)",
          }}
        >
          {settings?.heroTitle ?? "افهم الكيمياء"}
          <br />
          <span style={{
            background: "linear-gradient(135deg,#00D4FF,#00FF88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            بطريقة مختلفة
          </span>
        </motion.h1>

        {/* Sub heading */}
        <motion.h2
          initial="hidden" animate="show" custom={0.3} variants={fadeUp}
          style={{
            fontFamily: "Cairo,sans-serif",
            color: "rgba(122,232,255,0.6)",
            fontSize: "clamp(14px,3.5vw,22px)",
            fontWeight: 400,
            marginBottom: 28,
          }}
        >
          {settings?.heroSubtitle ?? "مع مستر مصطفى عبد الباري"}
        </motion.h2>

        {/* Divider — molecule bonds style */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div style={{ height: 1, width: 60, background: "linear-gradient(to right,transparent,rgba(0,212,255,0.5))" }} />
          <motion.div
            style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "linear-gradient(135deg,#00D4FF,#00FF88)",
              boxShadow: "0 0 12px rgba(0,212,255,0.6)",
            }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div style={{ height: 1, width: 60, background: "linear-gradient(to left,transparent,rgba(0,212,255,0.5))" }} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial="hidden" animate="show" custom={0.48} variants={fadeUp}
          style={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "Cairo,sans-serif",
            fontSize: "clamp(14px,3.5vw,17px)",
            lineHeight: 2,
            maxWidth: 540,
            margin: "0 auto 40px",
          }}
        >
          {settings?.heroDesc ?? "انضم إلى آلاف الطلاب وافهم الكيمياء العضوية والتحليلية والفيزيائية بأسلوب مبسط واحترافي"}
        </motion.p>

        {/* CTA Buttons — stack on mobile, row on tablet+ */}
        <motion.div
          initial="hidden" animate="show" custom={0.58} variants={fadeUp}
          className="flex flex-col sm:flex-row justify-center"
          style={{ gap: "clamp(10px,2vw,16px)" }}
        >
          <motion.div
            whileHover={{ y: -5, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Link
              href="/register"
              style={{
                display: "block",
                padding: "clamp(12px,2vw,16px) clamp(24px,4vw,44px)",
                borderRadius: 16,
                background: btnGradient,
                boxShadow: "0 6px 28px rgba(0,212,255,0.4)",
                color: "#0A0F1E",
                fontFamily: "Cairo,sans-serif",
                fontWeight: 700,
                fontSize: "clamp(14px,3.5vw,17px)",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              ابدأ رحلتك الآن 🚀
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -5, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Link
              href="/login"
              style={{
                display: "block",
                padding: "clamp(12px,2vw,16px) clamp(24px,4vw,44px)",
                borderRadius: 16,
                border: "1.5px solid rgba(0,212,255,0.35)",
                background: "rgba(0,212,255,0.06)",
                color: "#7AE8FF",
                fontFamily: "Cairo,sans-serif",
                fontWeight: 600,
                fontSize: "clamp(14px,3.5vw,17px)",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              تسجيل الدخول
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats bar — 2×2 on mobile, row on sm+ */}
        <motion.div
          initial="hidden" animate="show" custom={0.72} variants={fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 mt-14 mx-auto"
          style={{ maxWidth: 560, gap: "clamp(12px,3vw,24px)" }}
        >
          {statsBar.map((s, i) => (
            <motion.div
              key={i}
              className="text-center rounded-2xl py-3 px-2"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.12)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.85 + i * 0.1 }}
              whileHover={{ scale: 1.08, y: -4 }}
            >
              <div style={{
                fontFamily: "Cairo,sans-serif",
                color: "#00D4FF",
                fontSize: "clamp(22px,5vw,36px)",
                fontWeight: 900,
                lineHeight: 1.2,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: "Cairo,sans-serif",
                color: "rgba(122,232,255,0.5)",
                fontSize: "clamp(10px,2.5vw,12px)",
                marginTop: 4,
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ color: "rgba(0,212,255,0.3)", fontFamily: "Cairo,sans-serif", fontSize: 11 }}>اكتشف المزيد</span>
        <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom,rgba(0,212,255,0.4),transparent)" }} />
      </motion.div>
    </section>
  );
}

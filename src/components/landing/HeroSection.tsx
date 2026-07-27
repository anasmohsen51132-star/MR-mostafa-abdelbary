"use client";

// src/components/landing/HeroSection.tsx — Premium Chemistry Academy Edition
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { SiteSettings } from "@/types";
import { useState, useEffect } from "react";
import { ChemistryBackground } from "@/components/effects/ChemistryBackground";
import { HeroChemicalReaction } from "@/components/landing/HeroChemicalReaction";

interface Props {
  settings: Partial<SiteSettings> | null;
}

const STATS_DEFAULT = [
  { value: "٥٠٠٠+", label: "طالب مسجل" },
  { value: "٢٠", label: "كورس متاح" },
  { value: "١٥+", label: "سنة خبرة" },
  { value: "٩٨٪", label: "نسبة النجاح" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 20, delay },
  }),
};

// Premium SVG Logo - Chemistry Academy
function AcademyLogo({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon structure */}
      <motion.path
        d="M60 6L114 33V87L60 114L6 87V33L60 6Z"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        fill="rgba(0,212,255,0.05)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Hexagonal grid overlay */}
      <motion.path
        d="M60 18L96 36V72L60 90L24 72V36L60 18Z"
        stroke="url(#logoGrad)"
        strokeWidth="1.2"
        fill="rgba(0,212,255,0.03)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      />
      
      {/* Atom structure */}
      <motion.ellipse
        cx="60"
        cy="60"
        rx="32"
        ry="12"
        stroke="#00D4FF"
        strokeWidth="2"
        opacity="0.8"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.ellipse
        cx="60"
        cy="60"
        rx="32"
        ry="12"
        stroke="#00FF88"
        strokeWidth="2"
        opacity="0.8"
        initial={{ rotate: 60 }}
        animate={{ rotate: 420 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.ellipse
        cx="60"
        cy="60"
        rx="32"
        ry="12"
        stroke="#00D4FF"
        strokeWidth="2"
        opacity="0.8"
        initial={{ rotate: 120 }}
        animate={{ rotate: 480 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Nucleus */}
      <motion.circle
        cx="60"
        cy="60"
        r="8"
        fill="url(#logoGrad)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: 0.5 
        }}
      />
      <motion.circle
        cx="60"
        cy="60"
        r="4"
        fill="white"
        opacity="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      />
      
      {/* Orbital electrons */}
      <motion.circle
        cx="92"
        cy="60"
        r="3.5"
        fill="#00D4FF"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9 }}
      />
      <motion.circle
        cx="28"
        cy="60"
        r="3.5"
        fill="#00FF88"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.0 }}
      />
      
      {/* Chemical bond lines */}
      <motion.line
        x1="60"
        y1="28"
        x2="60"
        y2="52"
        stroke="rgba(0,212,255,0.3)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.line
        x1="60"
        y1="68"
        x2="60"
        y2="92"
        stroke="rgba(0,212,255,0.3)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#00FF88" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Premium Navbar with improved design
function Navbar({ settings, btnGradient }: { settings: Partial<SiteSettings> | null, btnGradient: string }) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 inset-x-0 h-20 flex items-center z-50 transition-all duration-300"
      style={{
        background: scrolled 
          ? "rgba(10,15,30,0.85)" 
          : "rgba(10,15,30,0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled 
          ? "1px solid rgba(0,212,255,0.08)" 
          : "1px solid rgba(0,212,255,0.05)",
        padding: "0 clamp(16px,4vw,48px)",
      }}
    >
      {/* Logo + name */}
      <Link href="/" className="flex items-center gap-3 flex-1 min-w-0 group">
        <motion.div
          whileHover={{ scale: 1.05, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="relative"
        >
          <AcademyLogo size={44} />
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15), transparent 70%)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </motion.div>
        <div className="min-w-0">
          <motion.span
            className="font-bold leading-tight block truncate tracking-tight"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(14px,3vw,18px)",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {settings?.platformName ?? "أكاديمية مستر مصطفى عبد الباري"}
          </motion.span>
          <motion.span
            style={{
              color: "rgba(0,212,255,0.5)",
              fontSize: "clamp(10px,2vw,12px)",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {settings?.platformTagline ?? "Chemistry Academy"}
          </motion.span>
        </div>
      </Link>

      {/* Nav actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/login"
            className="transition-all duration-200 whitespace-nowrap rounded-xl px-4 py-2 hover:bg-white/5"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "clamp(13px,3vw,15px)",
              fontWeight: 500,
            }}
          >
            دخول
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Link
            href="/register"
            className="rounded-xl font-semibold transition-all duration-200 whitespace-nowrap px-5 py-2.5 relative overflow-hidden group"
            style={{
              background: btnGradient,
              boxShadow: "0 2px 20px rgba(0,212,255,0.2)",
              color: "#0A0F1E",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(13px,3vw,15px)",
            }}
          >
            <span className="relative z-10">إنشاء حساب</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export function HeroSection({ settings }: Props) {
  const [animationComplete, setAnimationComplete] = useState(false);

  let statsBar = STATS_DEFAULT;
  try {
    if (settings?.statsBar && Array.isArray(settings.statsBar)) {
      statsBar = settings.statsBar;
    }
  } catch {
    statsBar = STATS_DEFAULT;
  }

  const btnGradient = `linear-gradient(135deg,${settings?.buttonColor || "#00D4FF"},${settings?.hoverColor || "#00FF88"})`;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={
        settings?.heroBackgroundImage
          ? {
              backgroundImage: `linear-gradient(135deg,rgba(10,15,30,0.97) 0%,rgba(13,21,40,0.95) 60%,rgba(17,30,56,0.95) 100%), url(${settings.heroBackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { 
              background: "linear-gradient(135deg, #0A0F1E 0%, #0D1528 40%, #0A1A2E 70%, #111E38 100%)" 
            }
      }
    >
      {/* ── Premium Chemistry Background ── */}
      <ChemistryBackground />

      {/* ── Sophisticated ambient glow orbs ── */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)" }}
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(0,255,136,0.06), transparent 70%)" }}
        animate={{ 
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Navbar ── */}
      <Navbar settings={settings} btnGradient={btnGradient} />

      {/* ── Hero Content ── */}
      <div
        className="relative z-10 text-center w-full"
        style={{ padding: "100px clamp(20px,5vw,60px) 40px" }}
      >
        {/* Platform badge */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full mb-6"
          style={{
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.1)",
            padding: "8px 20px",
          }}
        >
          <span style={{ fontSize: 16 }}>⚗️</span>
          <span style={{ 
            color: "rgba(255,255,255,0.6)", 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
            fontSize: "clamp(11px,3vw,13px)",
            letterSpacing: "0.02em",
          }}>
            المنصة الأولى لتدريس الكيمياء في مصر
          </span>
        </motion.div>

        {/* ── Signature Hero Chemical Reaction ── */}
        <div className="my-4">
          <HeroChemicalReaction
            teacherName={settings?.platformName ?? "مستر مصطفى عبد الباري"}
            tagline={settings?.platformTagline ?? "لتدريس الكيمياء"}
            onComplete={() => setAnimationComplete(true)}
          />
        </div>

        {/* Main heading */}
        <motion.h1
          initial="hidden"
          animate="show"
          custom={0.15}
          variants={fadeUp}
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 700,
            color: "#FFFFFF",
            fontSize: "clamp(32px,7vw,72px)",
            lineHeight: 1.08,
            marginBottom: 12,
            letterSpacing: "-0.03em",
          }}
        >
          {settings?.heroTitle ?? "افهم الكيمياء"}
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
            }}
          >
            بطريقة مختلفة
          </span>
        </motion.h1>

        {/* Sub heading */}
        <motion.p
          initial="hidden"
          animate="show"
          custom={0.3}
          variants={fadeUp}
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: "rgba(255,255,255,0.5)",
            fontSize: "clamp(16px,3vw,22px)",
            fontWeight: 400,
            marginBottom: 24,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            letterSpacing: "-0.01em",
          }}
        >
          {settings?.heroSubtitle ?? "مع مستر مصطفى عبد الباري"}
        </motion.p>

        {/* Minimal divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div style={{ 
            height: 1, 
            width: 80, 
            background: "linear-gradient(to right, transparent, rgba(0,212,255,0.3))" 
          }} />
          <motion.div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00D4FF, #00FF88)",
              boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div style={{ 
            height: 1, 
            width: 80, 
            background: "linear-gradient(to left, transparent, rgba(0,212,255,0.3))" 
          }} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          custom={0.48}
          variants={fadeUp}
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(15px,3vw,17px)",
            lineHeight: 1.8,
            maxWidth: 520,
            margin: "0 auto 36px",
            fontWeight: 400,
          }}
        >
          {settings?.heroDesc ?? "انضم إلى آلاف الطلاب وافهم الكيمياء العضوية والتحليلية والفيزيائية بأسلوب مبسط واحترافي"}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.58}
          variants={fadeUp}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Link
              href="/register"
              className="relative overflow-hidden group px-8 py-4 rounded-2xl font-semibold inline-block transition-all duration-300"
              style={{
                background: btnGradient,
                boxShadow: "0 4px 30px rgba(0,212,255,0.25)",
                color: "#0A0F1E",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(15px,3.5vw,18px)",
                letterSpacing: "-0.01em",
              }}
            >
              <span className="relative z-10">ابدأ رحلتك الآن 🚀</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl font-medium inline-block transition-all duration-300 hover:bg-white/5"
              style={{
                border: "1px solid rgba(0,212,255,0.15)",
                background: "rgba(0,212,255,0.03)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 500,
                fontSize: "clamp(15px,3.5vw,18px)",
              }}
            >
              تسجيل الدخول
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.72}
          variants={fadeUp}
          className="grid grid-cols-2 md:grid-cols-4 mt-14 mx-auto gap-4"
          style={{ maxWidth: 560 }}
        >
          {statsBar.map((s, i) => (
            <motion.div
              key={i}
              className="text-center rounded-2xl py-4 px-3 backdrop-blur-sm"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.85 + i * 0.08 }}
              whileHover={{ 
                y: -4,
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(0,212,255,0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  color: "#FFFFFF",
                  fontSize: "clamp(24px,5vw,38px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "clamp(11px,2.5vw,13px)",
                  marginTop: 4,
                  fontWeight: 400,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ 
          color: "rgba(255,255,255,0.2)", 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Scroll
        </span>
        <div style={{ 
          width: 1, 
          height: 30, 
          background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" 
        }} />
      </motion.div>
    </section>
  );
}

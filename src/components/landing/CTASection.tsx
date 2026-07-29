"use client";
// src/components/landing/CTASection.tsx — Chemistry Academy Edition
import { m as motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FloatingChemistryBackground } from "@/components/effects/FloatingChemistryBackground";
import { TwinklingStars } from "@/components/effects/TwinklingStars";
import type { SiteSettings } from "@/types";

interface Props {
  settings?: Partial<SiteSettings> | null;
}

export function CTASection({ settings }: Props = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const customButtons = Array.isArray(settings?.ctaButtons)
    ? [...settings!.ctaButtons!].filter((b) => b.visible).sort((a, b) => a.order - b.order)
    : [];

  const btnGradient = `linear-gradient(135deg,${settings?.buttonColor || "#00D4FF"},${settings?.hoverColor || "#00FF88"})`;

  return (
    <section
      ref={ref}
      className="py-20 sm:py-24 px-4 sm:px-6"
      style={{ background: "#F0F4FF" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="rounded-3xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#0A0F1E 0%,#0D1528 50%,#111E38 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,212,255,0.12)",
            padding: "clamp(32px,6vw,64px) clamp(20px,5vw,48px)",
          }}
        >
          {/* Floating chemistry symbols */}
          <FloatingChemistryBackground density={4} color="rgba(0,212,255,0.08)" />
          <TwinklingStars density={6} maxOpacity={0.4} color="0,212,255" />

          {/* Dot grid pattern */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, rgba(0,212,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }} />

          {/* Cyan top accent */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-0.5 rounded-full"
            style={{ background: "linear-gradient(90deg,transparent,#00D4FF,transparent)" }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Atom icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 260, damping: 14 }}
              style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon-192"
                alt="شعار المنصة"
                style={{ width: "clamp(36px,8vw,52px)", height: "clamp(36px,8vw,52px)", borderRadius: 12 }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: "Cairo,sans-serif",
                fontWeight: 900,
                color: "#FFFFFF",
                fontSize: "clamp(22px,5vw,42px)",
                lineHeight: 1.3,
                marginBottom: 16,
              }}
            >
              ابدأ رحلتك في الكيمياء{" "}
              <span style={{
                background: "linear-gradient(135deg,#00D4FF,#00FF88)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                اليوم
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.32 }}
              style={{
                fontFamily: "Cairo,sans-serif",
                color: "rgba(122,232,255,0.6)",
                fontSize: "clamp(13px,2.5vw,16px)",
                lineHeight: 1.9,
                maxWidth: 420,
                margin: "0 auto 36px",
              }}
            >
              انضم إلى آلاف الطلاب وابدأ في إتقان الكيمياء مع مستر مصطفى عبد الباري على منصة واحدة
            </motion.p>

            {/* Buttons — stack on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {customButtons.length > 0 ? (
                customButtons.map((b) => (
                  <motion.div key={b.id} whileHover={{ y: -5, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={b.href}
                      style={{
                        display: "block",
                        padding: "clamp(12px,2vw,16px) clamp(28px,5vw,44px)",
                        borderRadius: 16,
                        background: btnGradient,
                        boxShadow: "0 6px 24px rgba(0,212,255,0.45)",
                        color: "#0A0F1E",
                        fontFamily: "Cairo,sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(14px,3vw,17px)",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      {b.label}
                    </Link>
                  </motion.div>
                ))
              ) : (
                <>
                  <motion.div whileHover={{ y: -5, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/register"
                      style={{
                        display: "block",
                        padding: "clamp(12px,2vw,16px) clamp(28px,5vw,44px)",
                        borderRadius: 16,
                        background: btnGradient,
                        boxShadow: "0 6px 28px rgba(0,212,255,0.45)",
                        color: "#0A0F1E",
                        fontFamily: "Cairo,sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(14px,3vw,17px)",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      سجّل الآن مجاناً ✨
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -5, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/login"
                      style={{
                        display: "block",
                        padding: "clamp(12px,2vw,16px) clamp(24px,4vw,36px)",
                        borderRadius: 16,
                        border: "1.5px solid rgba(0,212,255,0.35)",
                        background: "rgba(0,212,255,0.07)",
                        color: "#7AE8FF",
                        fontFamily: "Cairo,sans-serif",
                        fontWeight: 600,
                        fontSize: "clamp(14px,3vw,17px)",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      لديّ حساب
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{
                fontFamily: "Cairo,sans-serif",
                color: "rgba(122,232,255,0.3)",
                fontSize: 12,
                marginTop: 20,
              }}
            >
              🔒 لا يلزم بطاقة ائتمانية — التسجيل مجاني تماماً
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

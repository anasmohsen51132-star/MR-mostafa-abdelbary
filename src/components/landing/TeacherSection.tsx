"use client";
// src/components/landing/TeacherSection.tsx — Chemistry Academy Edition
import { m as motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { SiteSettings } from "@/types";

interface Props {
  settings: Partial<SiteSettings> | null;
}

const STATS_DEFAULT = [
  { value: "١٥+",   label: "سنة خبرة",       icon: "📅" },
  { value: "٥٠٠٠+", label: "طالب مستفيد",    icon: "👨‍🎓" },
  { value: "٩٨٪",  label: "نسبة النجاح",     icon: "🏆" },
];

// Orbiting electron rings around teacher avatar
function AtomAvatar({ photoSrc }: { photoSrc: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outer orbit ring 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          border: "1.5px solid rgba(0,212,255,0.35)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {/* Electron dot */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{ background: "#00D4FF", boxShadow: "0 0 8px #00D4FF" }} />
      </motion.div>

      {/* Orbit ring 2 — tilted */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180, height: 180,
          border: "1px solid rgba(0,255,136,0.25)",
          transform: "rotateX(70deg)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ background: "#00FF88", boxShadow: "0 0 6px #00FF88" }} />
      </motion.div>

      {/* Core avatar */}
      <div
        className="relative z-10 w-36 h-36 rounded-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg,rgba(0,212,255,0.25),rgba(0,255,136,0.2))",
          border: "2.5px solid rgba(0,212,255,0.5)",
          boxShadow: "0 0 30px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.1)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt="صورة المدرس"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
      </div>
    </div>
  );
}

export function TeacherSection({ settings }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  let teacherStats = STATS_DEFAULT;
  try {
    if (settings?.teacherStats && Array.isArray(settings.teacherStats)) {
      teacherStats = settings.teacherStats as typeof STATS_DEFAULT;
    }
  } catch { teacherStats = STATS_DEFAULT; }

  const teacherName  = settings?.teacherName  ?? "مستر مصطفى عبد الباري";
  const teacherTitle = settings?.teacherTitle ?? "أستاذ الكيمياء";
  const teacherBio   = settings?.teacherBio
    ?? "معلم كيمياء متميز بخبرة تزيد عن ١٥ عاماً في تدريس كيمياء الثانوية العامة والجامعات. متخصص في تبسيط المفاهيم الكيميائية المعقدة وتدريب الطلاب على حل المسائل بطريقة علمية منهجية.";

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0A0F1E 0%,#0D1528 60%,#111E38 100%)" }}
    >
      {/* Molecule grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(0,212,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }} />

      <div className="max-w-5xl mx-auto relative">
        {/* Stack on mobile/tablet, side by side on lg+ */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Avatar column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="flex-shrink-0 flex flex-col items-center"
          >
            <AtomAvatar photoSrc="/teacher-mostafa.jpeg" />

            {/* Name card */}
            <motion.div
              className="mt-6 px-6 py-3 rounded-2xl text-center"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                backdropFilter: "blur(8px)",
              }}
              whileHover={{ scale: 1.04 }}
            >
              <div style={{ fontFamily: "Cairo,sans-serif", color: "#7AE8FF", fontSize: 20, fontWeight: 700 }}>
                {teacherName}
              </div>
              <div style={{ fontFamily: "Cairo,sans-serif", color: "rgba(0,212,255,0.5)", fontSize: 12, marginTop: 2 }}>
                {teacherTitle}
              </div>
            </motion.div>
          </motion.div>

          {/* Content column */}
          <div className="flex-1 text-center lg:text-right">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  color: "#7AE8FF",
                  fontFamily: "Cairo,sans-serif",
                }}
              >
                👨‍🔬 عن الأستاذ
              </span>

              <h2
                className="mb-6"
                style={{
                  fontFamily: "Cairo,sans-serif",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  fontSize: "clamp(24px,4vw,42px)",
                  lineHeight: 1.35,
                }}
              >
                خبير في تبسيط{" "}
                <span style={{ background: "linear-gradient(135deg,#00D4FF,#00FF88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  الكيمياء
                </span>
              </h2>

              <p
                className="mb-10"
                style={{
                  fontFamily: "Cairo,sans-serif",
                  color: "rgba(122,232,255,0.65)",
                  fontSize: "clamp(14px,2.5vw,16px)",
                  lineHeight: 2,
                }}
              >
                {teacherBio}
              </p>
            </motion.div>

            {/* Stats — wrap on small screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex gap-4 justify-center lg:justify-start flex-wrap"
            >
              {teacherStats.map((s, i) => {
                const st = s as typeof STATS_DEFAULT[0];
                return (
                  <motion.div
                    key={i}
                    className="text-center rounded-2xl"
                    style={{
                      background: "rgba(0,212,255,0.07)",
                      border: "1px solid rgba(0,212,255,0.18)",
                      padding: "clamp(12px,2vw,18px) clamp(16px,3vw,28px)",
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.4 + i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.06 }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{st.icon}</div>
                    <div style={{
                      fontFamily: "Cairo,sans-serif",
                      color: "#00D4FF",
                      fontSize: "clamp(24px,4vw,34px)",
                      fontWeight: 900,
                      lineHeight: 1,
                    }}>
                      {st.value}
                    </div>
                    <div style={{
                      fontFamily: "Cairo,sans-serif",
                      color: "rgba(122,232,255,0.5)",
                      fontSize: "clamp(11px,1.5vw,13px)",
                      marginTop: 6,
                    }}>
                      {st.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

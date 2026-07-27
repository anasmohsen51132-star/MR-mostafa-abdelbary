"use client";
// src/components/landing/FeaturesSection.tsx — Chemistry Academy Edition
import { m as motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { SiteSettings } from "@/types";

interface Props {
  settings: Partial<SiteSettings> | null;
}

const FEATURES_DEFAULT = [
  {
    icon: "⚗️",
    title: "كيمياء عضوية متكاملة",
    desc: "شرح مبسط لكل التفاعلات العضوية، الأيزومرية، المجموعات الوظيفية والآليات خطوة بخطوة",
    gradient: "linear-gradient(135deg,rgba(0,212,255,0.12),rgba(0,255,136,0.08))",
    accent: "#00D4FF",
  },
  {
    icon: "🔬",
    title: "معادلات موزونة بسهولة",
    desc: "تعلم كيف توازن أي معادلة كيميائية بطرق علمية مضمونة مع حل مئات الأمثلة التدريبية",
    gradient: "linear-gradient(135deg,rgba(0,255,136,0.12),rgba(0,212,255,0.08))",
    accent: "#00FF88",
  },
  {
    icon: "🧪",
    title: "تجارب المعمل افتراضياً",
    desc: "شرح مرئي لكل تجارب الكيمياء مع توضيح الخطوات والاحتياطات والنتائج المتوقعة",
    gradient: "linear-gradient(135deg,rgba(255,107,53,0.12),rgba(0,212,255,0.06))",
    accent: "#FF6B35",
  },
  {
    icon: "📊",
    title: "اختبارات تفاعلية فورية",
    desc: "بنك أسئلة ضخم على كل درس مع تصحيح فوري وشرح تفصيلي لكل إجابة",
    gradient: "linear-gradient(135deg,rgba(0,212,255,0.12),rgba(255,107,53,0.08))",
    accent: "#00D4FF",
  },
  {
    icon: "📱",
    title: "ادرس في أي مكان وزمان",
    desc: "المنصة متاحة على الموبايل والتابلت واللابتوب بدون أي قيود مع تصميم متكيّف تماماً",
    gradient: "linear-gradient(135deg,rgba(0,255,136,0.10),rgba(255,107,53,0.08))",
    accent: "#00FF88",
  },
  {
    icon: "🏆",
    title: "نتائج مضمونة في الامتحانات",
    desc: "منهج مُركَّز على نقاط امتحان الثانوية العامة وكل المراحل الدراسية بأقل وقت وأعلى كفاءة",
    gradient: "linear-gradient(135deg,rgba(255,107,53,0.12),rgba(0,255,136,0.08))",
    accent: "#FF6B35",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 20, delay: i * 0.1 },
  }),
};

export function FeaturesSection({ settings }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  let features = FEATURES_DEFAULT;
  try {
    if (settings?.features && Array.isArray(settings.features)) {
      features = settings.features as typeof FEATURES_DEFAULT;
    }
  } catch { features = FEATURES_DEFAULT; }

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 px-4 sm:px-6"
      style={{ background: "#F0F4FF" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "#0099CC",
              fontFamily: "Cairo,sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            🔬 لماذا أكاديميتنا؟
          </span>
          <h2
            className="mb-4"
            style={{
              fontFamily: "Cairo,sans-serif",
              fontWeight: 900,
              color: "#0A0F1E",
              fontSize: "clamp(26px,5vw,46px)",
              lineHeight: 1.3,
            }}
          >
            منصة كيمياء متكاملة
          </h2>
          <p
            style={{
              fontFamily: "Cairo,sans-serif",
              color: "#2D3A5A",
              fontSize: "clamp(14px,2.5vw,16px)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.9,
            }}
          >
            كل ما تحتاجه لتفهم الكيمياء من الصفر وتحقق أعلى الدرجات في مكان واحد
          </p>
        </motion.div>

        {/* Features grid — 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feat, i) => {
            const f = feat as typeof FEATURES_DEFAULT[0];
            return (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl p-6 sm:p-7 cursor-default"
                style={{
                  background: f.gradient ?? "rgba(255,255,255,0.9)",
                  border: `1px solid ${(f.accent ?? "#00D4FF")}22`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Icon bubble */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, -6, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{
                    background: `${(f.accent ?? "#00D4FF")}18`,
                    border: `1px solid ${(f.accent ?? "#00D4FF")}25`,
                    boxShadow: `0 4px 16px ${(f.accent ?? "#00D4FF")}15`,
                  }}
                >
                  {f.icon}
                </motion.div>

                <h3
                  className="font-bold mb-3"
                  style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: "clamp(15px,2.5vw,17px)" }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Cairo,sans-serif",
                    color: "#4A5568",
                    fontSize: "clamp(13px,2vw,14px)",
                    lineHeight: 1.8,
                  }}
                >
                  {f.desc}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className="mt-5 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(to left, ${(f.accent ?? "#00D4FF")}, transparent)`, width: "60%" }}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

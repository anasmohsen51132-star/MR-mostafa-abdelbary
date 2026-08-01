"use client";
// src/components/onboarding/WelcomeTour.tsx
// First-run guided tour for students — Chemistry Academy edition.
//
// Shows once per student (flag kept in localStorage, keyed by user id) the
// first time they land inside the student area. Walks them through every
// student page — Dashboard, Courses, Redeem code, My Courses, Profile — and
// their permissions as a student, driven entirely by the "التالي" button:
// each step spotlights the matching sidebar item and navigates the real app
// to that page in the background, so what the student sees behind the tour
// card is the actual page being described.
//
// Persistence is intentionally client-only (localStorage) — no schema
// change needed. If a DB-backed "onboarding completed" flag is ever wanted
// (e.g. to survive a cleared browser / follow the student across devices),
// this is the single place to swap the read/write for an API call.
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import { springBouncy } from "@/lib/motion-presets";

interface TourStep {
  id: string;
  route?: string;
  targetId?: string; // matches data-tour-id on the sidebar item
  icon: string;
  title: string;
  description: string;
  bullets?: string[];
  cta?: string; // custom label for the "next" button on this step
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    icon: "⚗️",
    title: "أهلاً بيك في أكاديمية مستر مصطفى عبد الباري",
    description:
      "هناخدك في جولة سريعة على المنصة عشان تتعرف على كل صفحة وإزاي تستخدمها كطالب. تقدر تتخطى الجولة في أي وقت.",
    cta: "ابدأ الجولة 🚀",
  },
  {
    id: "dashboard",
    route: "/dashboard",
    targetId: "dashboard",
    icon: "🏠",
    title: "لوحة التحكم",
    description:
      "دي صفحتك الرئيسية. هتلاقي فيها نظرة عامة على تقدمك، آخر محاضرة كنت بتذاكر فيها عشان تكمل منها على طول، وإحصائيات بسيطة عن نشاطك.",
  },
  {
    id: "courses",
    route: "/courses",
    targetId: "courses",
    icon: "📚",
    title: "الكورسات",
    description:
      "هنا بتلاقي كل الكورسات المتاحة على المنصة، تقدر تتصفحها وتشوف تفاصيلها حتى لو لسه مش مشترك فيها، عشان تعرف تختار الكورس المناسب لصفك الدراسي.",
  },
  {
    id: "redeem",
    route: "/redeem",
    targetId: "redeem",
    icon: "🎟️",
    title: "استخدام كود الاشتراك",
    description:
      "دي أهم صفحة عشان تفتح الكورسات. الكود بتاخده من المستر مباشرةً (كارت أو ورقة فيها كود)، وبتكتبه هنا لفتح الكورس المرتبط بيه.",
    bullets: [
      "اكتب الكود في الخانة زي ما هو مكتوب بالظبط",
      "اضغط \"تفعيل الكود\" وسيبه يتحقق منه",
      "الكورس هيتفتح فورًا ويظهر في \"كورساتي\"",
    ],
  },
  {
    id: "my-courses",
    route: "/my-courses",
    targetId: "my-courses",
    icon: "🎓",
    title: "كورساتي",
    description:
      "دي الكورسات اللي انت مشترك فيها فعليًا بعد ما فعّلت الكود. من هنا بتدخل على المحاضرات، تكمل من حيث ما وقفت، وتحل الواجبات والاختبارات.",
  },
  {
    id: "profile",
    route: "/profile",
    targetId: "profile",
    icon: "👤",
    title: "الملف الشخصي",
    description:
      "هنا بياناتك الشخصية: اسمك، رقم الهاتف اللي بتسجل بيه دخولك، وصفك الدراسي. تقدر تراجعها في أي وقت.",
  },
  {
    id: "permissions",
    route: "/dashboard",
    icon: "🔐",
    title: "صلاحياتك كطالب",
    description: "عشان تكون الصورة واضحة، ده اللي تقدر تعمله على المنصة:",
    bullets: [
      "تصفح كل الكورسات ومشاهدة المحاضرات في الكورسات اللي فتحتها بس",
      "تفعيل كود اشتراك عشان تفتح كورس جديد",
      "حل الواجبات والاختبارات ومتابعة نتائجك",
      "تعديل بياناتك الشخصية من صفحة الملف الشخصي",
    ],
  },
  {
    id: "finish",
    icon: "🚀",
    title: "جاهز تبدأ!",
    description:
      "كده عرفت تتحرك في المنصة براحتك. لو محتاج تراجع أي حاجة، الصفحات كلها موجودة دايمًا في القائمة الجانبية. بالتوفيق في رحلتك مع الكيمياء!",
    cta: "ابدأ رحلتي 🧪",
  },
];

const STORAGE_PREFIX = "mustafa_onboarding_done_";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Props {
  userId: string;
}

export function WelcomeTour({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const checkedRef = useRef(false);

  // Decide, once, whether this student needs the tour.
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    try {
      const done = localStorage.getItem(STORAGE_PREFIX + userId);
      if (!done) {
        // Small delay so the tour doesn't collide with the name-splash
        // welcome animation that already plays on first dashboard visit.
        const t = setTimeout(() => setActive(true), 3200);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable (e.g. private mode edge cases) — skip tour
      // rather than risk showing it on every single visit.
    }
  }, [userId]);

  const step = STEPS[stepIndex];

  const updateRect = useCallback(() => {
    if (!step?.targetId || typeof window === "undefined" || window.innerWidth < 1024) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour-id="${step.targetId}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!active) return;
    if (step.route && pathname !== step.route) {
      router.push(step.route);
      return; // rect will be recomputed once pathname updates
    }
    updateRect();
    window.addEventListener("resize", updateRect);
    const raf = requestAnimationFrame(updateRect);
    return () => {
      window.removeEventListener("resize", updateRect);
      cancelAnimationFrame(raf);
    };
  }, [active, step, pathname, router, updateRect]);

  const finish = useCallback(() => {
    setActive(false);
    try {
      localStorage.setItem(STORAGE_PREFIX + userId, "1");
    } catch {
      /* non-fatal */
    }
  }, [userId]);

  const goNext = () => {
    if (stepIndex >= STEPS.length - 1) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
  };
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  if (!active) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key="tour-root"
        className="fixed inset-0 z-[300]"
        style={{ direction: "rtl" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(6,10,20,0.82)", backdropFilter: "blur(3px)" }}
        />

        {/* Rising bubble particles — subtle flask feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => {
            const left = 5 + ((i * 9.3) % 90);
            const size = 4 + (i % 4) * 3;
            const duration = 5 + (i % 5);
            const delay = (i % 6) * 0.6;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${left}%`,
                  bottom: -20,
                  width: size,
                  height: size,
                  background: i % 2 === 0 ? "rgba(0,212,255,0.35)" : "rgba(0,255,136,0.3)",
                  boxShadow: i % 2 === 0 ? "0 0 8px rgba(0,212,255,0.5)" : "0 0 8px rgba(0,255,136,0.45)",
                }}
                animate={{ y: [0, -(window.innerHeight + 40)], opacity: [0, 1, 1, 0] }}
                transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
              />
            );
          })}
        </div>

        {/* Spotlight ring on the active sidebar item */}
        <AnimatePresence>
          {rect && (
            <motion.div
              key="spotlight"
              className="absolute rounded-2xl pointer-events-none"
              style={{
                border: "2px solid #00D4FF",
                boxShadow: "0 0 0 4px rgba(0,212,255,0.15), 0 0 26px rgba(0,212,255,0.55)",
              }}
              initial={false}
              animate={{
                top: rect.top - 6,
                left: rect.left - 6,
                width: rect.width + 12,
                height: rect.height + 12,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={springBouncy}
            />
          )}
        </AnimatePresence>

        {/* Card container */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ paddingInlineEnd: "clamp(16px, 4vw, 300px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={springBouncy}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg,#0D1528 0%,#0A0F1E 100%)",
                border: "1px solid rgba(0,212,255,0.25)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.08)",
              }}
            >
              {/* Decorative molecule (top-left corner) */}
              <svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                className="absolute -top-4 -left-4 pointer-events-none"
                style={{ opacity: 0.5 }}
              >
                <line x1="20" y1="20" x2="55" y2="45" stroke="#00D4FF" strokeOpacity="0.3" strokeWidth="1.5" />
                <line x1="55" y1="45" x2="30" y2="70" stroke="#00FF88" strokeOpacity="0.25" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="5" fill="#00D4FF" fillOpacity="0.4" />
                <circle cx="55" cy="45" r="7" fill="#00D4FF" fillOpacity="0.55" />
                <circle cx="30" cy="70" r="4" fill="#00FF88" fillOpacity="0.4" />
              </svg>

              {/* Skip */}
              <button
                onClick={finish}
                className="absolute top-4 left-4 text-xs px-2.5 py-1.5 rounded-full z-10"
                style={{
                  color: "rgba(122,232,255,0.55)",
                  fontFamily: "Cairo,sans-serif",
                  background: "rgba(0,212,255,0.06)",
                  border: "1px solid rgba(0,212,255,0.15)",
                  cursor: "pointer",
                }}
              >
                تخطي الجولة ✕
              </button>

              <div className="relative px-7 pt-16 pb-7">
                {/* Step counter */}
                <div
                  className="text-[11px] font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "rgba(0,212,255,0.5)", fontFamily: "Cairo,sans-serif" }}
                >
                  الخطوة {stepIndex + 1} من {STEPS.length}
                </div>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
                  style={{ fontSize: 46, marginBottom: 14, lineHeight: 1 }}
                >
                  {step.icon}
                </motion.div>

                <h2
                  style={{
                    fontFamily: "Cairo,sans-serif",
                    color: "#FFFFFF",
                    fontSize: 22,
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h2>

                <p
                  style={{
                    fontFamily: "Cairo,sans-serif",
                    color: "rgba(230,240,255,0.75)",
                    fontSize: 14.5,
                    lineHeight: 1.9,
                    marginBottom: step.bullets ? 14 : 22,
                  }}
                >
                  {step.description}
                </p>

                {step.bullets && (
                  <ul className="mb-6 space-y-2">
                    {step.bullets.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="flex items-start gap-2"
                        style={{
                          fontFamily: "Cairo,sans-serif",
                          color: "rgba(230,240,255,0.75)",
                          fontSize: 13.5,
                          lineHeight: 1.7,
                        }}
                      >
                        <span style={{ color: "#00FF88", flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span>{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 mb-6">
                  {STEPS.map((s, i) => (
                    <div
                      key={s.id}
                      className="rounded-full transition-all"
                      style={{
                        height: 5,
                        width: i === stepIndex ? 20 : 5,
                        background: i === stepIndex ? "#00D4FF" : "rgba(0,212,255,0.2)",
                      }}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {!isFirst && (
                    <button
                      onClick={goBack}
                      className="px-4 py-3 rounded-2xl text-sm font-semibold"
                      style={{
                        fontFamily: "Cairo,sans-serif",
                        color: "rgba(122,232,255,0.7)",
                        background: "rgba(0,212,255,0.06)",
                        border: "1px solid rgba(0,212,255,0.18)",
                        cursor: "pointer",
                      }}
                    >
                      السابق
                    </button>
                  )}
                  <motion.button
                    onClick={goNext}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold"
                    style={{
                      fontFamily: "Cairo,sans-serif",
                      color: "#0A0F1E",
                      background: "linear-gradient(135deg,#00D4FF,#00FF88)",
                      boxShadow: "0 6px 20px rgba(0,212,255,0.35)",
                      cursor: "pointer",
                    }}
                  >
                    {step.cta ?? (isLast ? "إنهاء" : "التالي")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

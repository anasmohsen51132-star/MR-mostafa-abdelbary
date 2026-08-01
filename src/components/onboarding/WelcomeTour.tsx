"use client";
// src/components/onboarding/WelcomeTour.tsx
// First-run guided tour for students — Chemistry Academy edition.
//
// Shows once per student (flag kept in localStorage, keyed by user id) the
// first time they land inside the student area. Walks them through every
// student page — Dashboard, Courses, Redeem code, My Courses, Profile — and
// their permissions as a student, driven entirely by the "التالي" button:
// each step spotlights the matching sidebar item (desktop) and navigates the
// real app to that page in the background, so what the student sees behind
// the tour card is the actual page being described.
//
// Layout adapts to three device classes:
//   - Mobile   (<640px)  — native-feeling bottom sheet, sticky action bar.
//   - Tablet   (640–1023) — centered modal, illustration stacked above text.
//   - Desktop  (≥1024px) — two-column modal + a live spotlight ring drawn
//                           around the matching item in the real sidebar.
// A small "mini nav" strip (mirroring the real sidebar's 5 items) is shown
// on every device so the student always knows where they are, even where a
// live spotlight isn't possible (mobile/tablet, where the sidebar is a
// hidden drawer).
//
// Persistence is intentionally client-only (localStorage) — no schema
// change needed. If a DB-backed "onboarding completed" flag is ever wanted
// (e.g. to survive a cleared browser / follow the student across devices),
// this is the single place to swap the read/write for an API call.
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { m as motion, AnimatePresence, type PanInfo } from "framer-motion";
import { springBouncy } from "@/lib/motion-presets";

interface TourStep {
  id: string;
  route?: string;
  targetId?: string; // matches data-tour-id on the sidebar item + mini-nav
  title: string;
  description: string;
  bullets?: string[];
  cta?: string; // custom label for the "next" button on this step
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "أهلاً بيك في أكاديمية مستر مصطفى عبد الباري",
    description:
      "هناخدك في جولة سريعة على المنصة عشان تتعرف على كل صفحة وإزاي تستخدمها كطالب. تقدر تتخطى الجولة في أي وقت.",
    cta: "ابدأ الجولة",
  },
  {
    id: "dashboard",
    route: "/dashboard",
    targetId: "dashboard",
    title: "لوحة التحكم",
    description:
      "دي صفحتك الرئيسية. هتلاقي فيها نظرة عامة على تقدمك، آخر محاضرة كنت بتذاكر فيها عشان تكمل منها على طول، وإحصائيات بسيطة عن نشاطك.",
  },
  {
    id: "courses",
    route: "/courses",
    targetId: "courses",
    title: "الكورسات",
    description:
      "هنا بتلاقي كل الكورسات المتاحة على المنصة، تقدر تتصفحها وتشوف تفاصيلها حتى لو لسه مش مشترك فيها، عشان تعرف تختار الكورس المناسب لصفك الدراسي.",
  },
  {
    id: "redeem",
    route: "/redeem",
    targetId: "redeem",
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
    title: "كورساتي",
    description:
      "دي الكورسات اللي انت مشترك فيها فعليًا بعد ما فعّلت الكود. من هنا بتدخل على المحاضرات، تكمل من حيث ما وقفت، وتحل الواجبات والاختبارات.",
  },
  {
    id: "profile",
    route: "/profile",
    targetId: "profile",
    title: "الملف الشخصي",
    description:
      "هنا بياناتك الشخصية: اسمك، رقم الهاتف اللي بتسجل بيه دخولك، وصفك الدراسي. تقدر تراجعها في أي وقت.",
  },
  {
    id: "permissions",
    route: "/dashboard",
    targetId: "dashboard",
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
    targetId: "dashboard",
    title: "جاهز تبدأ!",
    description:
      "كده عرفت تتحرك في المنصة براحتك. لو محتاج تراجع أي حاجة، الصفحات كلها موجودة دايمًا في القائمة الجانبية. بالتوفيق في رحلتك مع الكيمياء!",
    cta: "ابدأ رحلتي",
  },
];

// Fixed order — mirrors the real sidebar (src/app/(student)/layout.tsx),
// independent of the order the tour visits pages in.
const MINI_NAV = [
  { id: "dashboard", icon: "🏠", label: "لوحة التحكم" },
  { id: "courses", icon: "📚", label: "الكورسات" },
  { id: "my-courses", icon: "🎓", label: "كورساتي" },
  { id: "redeem", icon: "🎟️", label: "كود الاشتراك" },
  { id: "profile", icon: "👤", label: "ملفي" },
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

/* ------------------------------------------------------------------ */
/* Per-step illustration — flat, on-brand vector scenes so every step  */
/* is *shown*, not just described in text.                             */
/* ------------------------------------------------------------------ */
function StepArt({ id }: { id: string }) {
  const cyan = "#00D4FF";
  const green = "#00FF88";
  const orange = "#FF6B35";

  return (
    <svg viewBox="0 0 200 140" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={cyan} stopOpacity="0.22" />
          <stop offset="100%" stopColor={cyan} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="66" r="66" fill={`url(#glow-${id})`} />

      {id === "welcome" && (
        <g>
          <motion.g
            style={{ transformOrigin: "100px 38px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          >
            <ellipse cx="100" cy="38" rx="34" ry="13" fill="none" stroke={cyan} strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx="134" cy="38" r="3.2" fill={cyan} />
          </motion.g>
          <motion.g
            style={{ transformOrigin: "100px 38px" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <ellipse cx="100" cy="38" rx="20" ry="34" fill="none" stroke={green} strokeOpacity="0.3" strokeWidth="1.5" />
            <circle cx="100" cy="4" r="2.6" fill={green} />
          </motion.g>
          {/* flask */}
          <path
            d="M88 46 L88 68 L64 110 Q60 118 70 118 L130 118 Q140 118 136 110 L112 68 L112 46 Z"
            fill="rgba(0,212,255,0.06)"
            stroke={cyan}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M72 106 Q100 96 128 106 L133 113 Q136 118 130 118 L70 118 Q64 118 67 113 Z" fill={green} fillOpacity="0.55" />
          <line x1="82" y1="46" x2="118" y2="46" stroke={cyan} strokeWidth="2.5" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={92 + i * 8}
              r="2.4"
              fill={i % 2 ? cyan : green}
              initial={{ cy: 112, opacity: 0 }}
              animate={{ cy: [112, 86], opacity: [0, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
            />
          ))}
        </g>
      )}

      {id === "dashboard" && (
        <g>
          <rect x="26" y="18" width="148" height="96" rx="12" fill="rgba(0,212,255,0.05)" stroke={cyan} strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="38" cy="30" r="2.4" fill={orange} />
          <circle cx="46" cy="30" r="2.4" fill="#FFD166" />
          <circle cx="54" cy="30" r="2.4" fill={green} />
          <line x1="26" y1="40" x2="174" y2="40" stroke={cyan} strokeOpacity="0.15" strokeWidth="1" />
          {/* bars */}
          {[0, 1, 2].map((i) => (
            <motion.rect
              key={i}
              x={40 + i * 16}
              width="10"
              rx="3"
              fill={i === 2 ? green : cyan}
              fillOpacity={i === 2 ? 0.9 : 0.55}
              initial={{ height: 0, y: 100 }}
              animate={{ height: 14 + i * 12, y: 100 - (14 + i * 12) }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: "easeOut" }}
            />
          ))}
          {/* progress ring */}
          <g transform="translate(140,66)">
            <circle r="18" fill="none" stroke={cyan} strokeOpacity="0.15" strokeWidth="6" />
            <motion.circle
              r="18"
              fill="none"
              stroke={green}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="113"
              initial={{ strokeDashoffset: 113 }}
              animate={{ strokeDashoffset: 34 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              transform="rotate(-90)"
            />
            <polygon points="-4,-6 -4,6 6,0" fill={cyan} />
          </g>
        </g>
      )}

      {id === "courses" && (
        <g>
          {[0, 1, 2].map((i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
            >
              <rect x={40 + i * 24} y={34 + (2 - i) * 6} width="44" height="60" rx="8"
                fill="rgba(0,212,255,0.05)" stroke={cyan} strokeOpacity="0.35" strokeWidth="1.5" />
              <rect x={40 + i * 24} y={34 + (2 - i) * 6} width="44" height="9" rx="8"
                fill={[cyan, green, orange][i]} fillOpacity="0.6" />
            </motion.g>
          ))}
          <g transform="translate(150,36)">
            <circle r="12" fill="rgba(10,15,30,0.5)" stroke={green} strokeWidth="2.5" />
            <line x1="9" y1="9" x2="18" y2="18" stroke={green} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      )}

      {id === "redeem" && (
        <g>
          <path
            d="M34 42 a8 8 0 000 16 v20 a8 8 0 000 16 h132 a8 8 0 000-16 v-20 a8 8 0 000-16 Z"
            fill="rgba(0,212,255,0.05)" stroke={cyan} strokeOpacity="0.4" strokeWidth="1.5"
          />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={54 + i * 24} y="60" width="16" height="20" rx="4"
              fill="none" stroke={cyan} strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="3 2" />
          ))}
          <motion.g
            initial={{ rotate: -18, y: -3 }}
            animate={{ rotate: [-18, 4, -18] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "156px 96px" }}
          >
            <circle cx="156" cy="96" r="13" fill="rgba(10,15,30,0.6)" stroke={green} strokeWidth="2" />
            <path d="M150 92 v-6 a6 6 0 0112 0" fill="none" stroke={green} strokeWidth="2.2" strokeLinecap="round" />
            <rect x="150" y="92" width="12" height="9" rx="2.5" fill={green} fillOpacity="0.7" />
          </motion.g>
          <motion.text
            x="178" y="82" fontSize="14" fill={green}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 1.1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >✦</motion.text>
        </g>
      )}

      {id === "my-courses" && (
        <g>
          <path d="M100 30 L156 50 L100 70 L44 50 Z" fill={cyan} fillOpacity="0.5" stroke={cyan} strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="100" y1="70" x2="100" y2="86" stroke={cyan} strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="100" cy="86" r="2.6" fill={green} />
          <rect x="52" y="78" width="96" height="40" rx="10" fill="rgba(0,212,255,0.05)" stroke={cyan} strokeOpacity="0.35" strokeWidth="1.5" />
          <polygon points="92,90 92,106 106,98" fill={green} />
          <rect x="60" y="112" width="80" height="4" rx="2" fill={cyan} fillOpacity="0.15" />
          <motion.rect
            x="60" y="112" height="4" rx="2" fill={green}
            initial={{ width: 0 }} animate={{ width: 50 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </g>
      )}

      {id === "profile" && (
        <g>
          <circle cx="70" cy="60" r="26" fill="rgba(0,212,255,0.06)" stroke={cyan} strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="70" cy="52" r="9" fill={cyan} fillOpacity="0.55" />
          <path d="M52 78 a18 15 0 0136 0" fill={cyan} fillOpacity="0.4" />
          <g transform="translate(86,80)">
            <circle r="11" fill="#0A0F1E" stroke={green} strokeWidth="2" />
            <path d="M-4 0 l3 3 l5 -6" fill="none" stroke={green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {[0, 1, 2].map((i) => (
            <motion.rect
              key={i}
              x="112" y={40 + i * 16} height="7" rx="3.5"
              fill={cyan} fillOpacity={0.4 - i * 0.08}
              initial={{ width: 0 }} animate={{ width: 52 - i * 12 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
            />
          ))}
        </g>
      )}

      {id === "permissions" && (
        <g>
          <path
            d="M100 22 L146 36 V70 C146 96 126 112 100 120 C74 112 54 96 54 70 V36 Z"
            fill="rgba(0,212,255,0.06)" stroke={cyan} strokeOpacity="0.45" strokeWidth="2"
          />
          {["تصفح", "تفعيل", "حلول"].map((_, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.15 }}
            >
              <circle cx="76" cy={54 + i * 18} r="6" fill="none" stroke={green} strokeWidth="1.8" />
              <path d={`M73 ${54 + i * 18} l2 2.5 l4 -5`} fill="none" stroke={green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="90" y={51 + i * 18} width="34" height="6" rx="3" fill={cyan} fillOpacity="0.3" />
            </motion.g>
          ))}
        </g>
      )}

      {id === "finish" && (
        <g>
          {[...Array(6)].map((_, i) => (
            <motion.text
              key={i}
              x={30 + (i * 27) % 150}
              y={20 + ((i * 41) % 70)}
              fontSize="10"
              fill={i % 2 ? green : cyan}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -10 }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
            >✦</motion.text>
          ))}
          <path
            d="M88 118 L88 96 Q88 70 112 70 Q112 96 112 118 Z"
            fill="rgba(0,212,255,0.06)" stroke={cyan} strokeWidth="2" strokeLinejoin="round"
          />
          <path d="M92 114 Q100 108 108 114 L110 118 Q100 122 90 118 Z" fill={green} fillOpacity="0.55" />
          <motion.g
            initial={{ y: 0 }}
            animate={{ y: [-2, -60] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: "easeIn" }}
          >
            <path d="M100 30 Q112 44 108 62 L92 62 Q88 44 100 30 Z" fill={cyan} stroke={cyan} strokeWidth="1" />
            <circle cx="100" cy="46" r="4" fill="#0A0F1E" />
            <polygon points="92,62 88,74 96,66" fill={orange} />
            <polygon points="108,62 112,74 104,66" fill={orange} />
            <polygon points="96,62 100,76 104,62" fill={green} />
          </motion.g>
        </g>
      )}
    </svg>
  );
}

export function WelcomeTour({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [dir, setDir] = useState(1);
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
    setDir(1);
    setStepIndex((i) => i + 1);
  };
  const goBack = () => {
    setDir(-1);
    setStepIndex((i) => Math.max(0, i - 1));
  };
  const goToStep = (idx: number) => {
    if (idx === stepIndex || idx < 0 || idx >= STEPS.length) return;
    setDir(idx > stepIndex ? 1 : -1);
    setStepIndex(idx);
  };

  // Keyboard shortcuts — Enter advances, Escape skips. Works on any device
  // with a keyboard (desktop, tablets with a paired keyboard, etc).
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIndex]);

  // Swipe / drag navigation — lets the card itself be dragged left-right to
  // move between steps, matching the native feel of onboarding flows on
  // touch devices (and works just as well with a trackpad or mouse).
  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const SWIPE_DISTANCE = 60;
    const SWIPE_VELOCITY = 400;
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) {
      goNext();
    } else if ((info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) && stepIndex > 0) {
      goBack();
    }
  };

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
        {/* Backdrop — when a real target is spotlighted on desktop, this is
            built from four panels that tile around the hole so the actual
            sidebar item shows through fully lit and legible. Everywhere
            else (mobile/tablet, or steps with no target) it's one flat
            dimmed layer. */}
        {rect ? (
          <>
            <motion.div
              className="fixed pointer-events-auto hidden lg:block"
              style={{ background: "rgba(6,10,20,0.86)", backdropFilter: "blur(3px)", top: 0, left: 0, right: 0 }}
              initial={false}
              animate={{ height: Math.max(rect.top - 8, 0) }}
              transition={springBouncy}
            />
            <motion.div
              className="fixed pointer-events-auto hidden lg:block"
              style={{ background: "rgba(6,10,20,0.86)", backdropFilter: "blur(3px)", left: 0, right: 0, bottom: 0 }}
              initial={false}
              animate={{ top: rect.top + rect.height + 8 }}
              transition={springBouncy}
            />
            <motion.div
              className="fixed pointer-events-auto hidden lg:block"
              style={{ background: "rgba(6,10,20,0.86)", backdropFilter: "blur(3px)", left: 0 }}
              initial={false}
              animate={{ top: rect.top - 8, height: rect.height + 16, width: Math.max(rect.left - 8, 0) }}
              transition={springBouncy}
            />
            <motion.div
              className="fixed pointer-events-auto hidden lg:block"
              style={{ background: "rgba(6,10,20,0.86)", backdropFilter: "blur(3px)", right: 0 }}
              initial={false}
              animate={{ top: rect.top - 8, height: rect.height + 16, left: rect.left + rect.width + 8 }}
              transition={springBouncy}
            />
            {/* Same four panels again, undimmed, purely to block clicks below lg — the
                cutout is a desktop-only affordance, so mobile/tablet still get a full block */}
            <div className="fixed inset-0 lg:hidden" style={{ background: "rgba(6,10,20,0.84)", backdropFilter: "blur(3px)" }} />
          </>
        ) : (
          <div className="fixed inset-0" style={{ background: "rgba(6,10,20,0.84)", backdropFilter: "blur(3px)" }} />
        )}

        {/* Drifting ambient glows */}
        <motion.div
          className="absolute w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,212,255,0.10),transparent 70%)", top: "8%", right: "6%" }}
          animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,255,136,0.08),transparent 70%)", bottom: "6%", left: "8%" }}
          animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
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
                animate={{ y: [0, -(typeof window !== "undefined" ? window.innerHeight + 40 : 800)], opacity: [0, 1, 1, 0] }}
                transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
              />
            );
          })}
        </div>

        {/* Spotlight ring on the active sidebar item — desktop only.
            The hole itself is created by the panels above; this ring is
            just the glowing outline + a one-off "landing" ping so the eye
            is drawn straight to the real, clickable nav item. */}
        <AnimatePresence>
          {rect && (
            <motion.div
              key={`spotlight-${step.id}`}
              className="fixed rounded-2xl pointer-events-none hidden lg:block"
              initial={false}
              animate={{
                top: rect.top - 6,
                left: rect.left - 6,
                width: rect.width + 12,
                height: rect.height + 12,
                opacity: 1,
                boxShadow: [
                  "0 0 0 4px rgba(0,212,255,0.15), 0 0 26px rgba(0,212,255,0.55)",
                  "0 0 0 6px rgba(0,212,255,0.22), 0 0 34px rgba(0,212,255,0.7)",
                  "0 0 0 4px rgba(0,212,255,0.15), 0 0 26px rgba(0,212,255,0.55)",
                ],
              }}
              exit={{ opacity: 0 }}
              transition={{
                top: springBouncy,
                left: springBouncy,
                width: springBouncy,
                height: springBouncy,
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ border: "2px solid #00D4FF" }}
            >
              <motion.span
                key={`ping-${step.id}`}
                className="absolute inset-0 rounded-2xl"
                style={{ border: "2px solid #00FF88" }}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>


        {/* Card container — bottom sheet on mobile, centered modal from sm+ */}
        <div className="absolute inset-0 flex items-end sm:items-center justify-center px-0 sm:px-4">
          <div className="hidden lg:block" style={{ width: "clamp(0px,4vw,280px)" }} />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step.id}
              custom={dir}
              drag="x"
              dragElastic={0.12}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: dir > 0 ? 36 : -36, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir > 0 ? -36 : 36, scale: 0.97 }}
              transition={springBouncy}
              className="relative w-full sm:max-w-md lg:max-w-3xl max-h-[92dvh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden touch-pan-y"
              style={{
                background: "linear-gradient(160deg,#0D1528 0%,#0A0F1E 100%)",
                border: "1px solid rgba(0,212,255,0.25)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.08)",
              }}
            >
              {/* Shimmering top accent */}
              <motion.div
                className="h-[3px] w-full flex-shrink-0"
                style={{ background: "linear-gradient(90deg,#00D4FF,#00FF88,#00D4FF)", backgroundSize: "200% 100%" }}
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Confetti burst — plays once when the finish step mounts */}
              {step.id === "finish" && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i / 16) * Math.PI * 2;
                    const dist = 90 + (i % 4) * 26;
                    const colors = ["#00D4FF", "#00FF88", "#FF6B35", "#FFD166"];
                    return (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          top: "38%",
                          left: "50%",
                          width: 5 + (i % 3) * 2,
                          height: 5 + (i % 3) * 2,
                          background: colors[i % colors.length],
                        }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                        animate={{
                          x: Math.cos(angle) * dist,
                          y: Math.sin(angle) * dist - 20,
                          opacity: 0,
                          scale: 1,
                        }}
                        transition={{ duration: 1.3, delay: 0.15, ease: "easeOut" }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Pinned skip button — stays put even while content below scrolls */}
              <button
                onClick={finish}
                className="absolute top-4 sm:top-5 left-3 sm:left-4 text-xs px-2.5 py-1.5 rounded-full z-10"
                style={{
                  color: "rgba(122,232,255,0.6)",
                  fontFamily: "Cairo,sans-serif",
                  background: "rgba(10,15,30,0.55)",
                  border: "1px solid rgba(0,212,255,0.16)",
                  cursor: "pointer",
                }}
              >
                تخطي الجولة ✕
              </button>

              {/* Scrollable content */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {/* Mobile grabber handle */}
                <div className="sm:hidden flex justify-center pt-2.5 pb-1">
                  <div className="w-10 h-1.5 rounded-full" style={{ background: "rgba(122,232,255,0.25)" }} />
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* Illustration panel — set inside its own "screen" with a faint lab grid */}
                  <div className="flex-shrink-0 order-1 lg:order-2 flex items-center justify-center px-6 pt-4 lg:pt-9 lg:px-8">
                    <div
                      className="w-44 h-32 sm:w-52 sm:h-36 lg:w-60 lg:h-44 rounded-2xl flex items-center justify-center p-3"
                      style={{
                        border: "1px solid rgba(0,212,255,0.14)",
                        backgroundImage:
                          "radial-gradient(circle at 30% 20%, rgba(0,212,255,0.09), rgba(0,255,136,0.03) 60%, transparent 80%), radial-gradient(rgba(0,212,255,0.16) 1px, transparent 1px)",
                        backgroundSize: "auto, 14px 14px",
                      }}
                    >
                      <StepArt id={step.id} />
                    </div>
                  </div>

                  {/* Text panel */}
                  <div className="relative flex-1 order-2 lg:order-1 px-6 sm:px-7 pt-3 lg:pt-9 pb-5 lg:min-w-0">
                    {/* Mini nav strip — always visible, mirrors the real sidebar */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-5 overflow-x-auto">
                      {MINI_NAV.map((n) => {
                        const isActive = step.targetId === n.id;
                        const targetIdx = STEPS.findIndex((s) => s.id === n.id);
                        return (
                          <motion.button
                            key={n.id}
                            onClick={() => goToStep(targetIdx)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full flex-shrink-0"
                            style={{
                              background: isActive ? "rgba(0,212,255,0.14)" : "rgba(255,255,255,0.03)",
                              border: isActive ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.06)",
                              cursor: "pointer",
                            }}
                          >
                            <span style={{ fontSize: 12, filter: isActive ? "none" : "grayscale(0.4) opacity(0.55)" }}>{n.icon}</span>
                            <span
                              className="hidden sm:inline text-[10.5px] whitespace-nowrap"
                              style={{
                                fontFamily: "Cairo,sans-serif",
                                color: isActive ? "#7AE8FF" : "rgba(122,232,255,0.4)",
                                fontWeight: isActive ? 700 : 500,
                              }}
                            >
                              {n.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <h2
                      style={{
                        fontFamily: "Cairo,sans-serif",
                        color: "#FFFFFF",
                        fontSize: 21,
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
                        fontSize: 14,
                        lineHeight: 1.85,
                        marginBottom: step.bullets ? 14 : 6,
                      }}
                    >
                      {step.description}
                    </p>

                    {step.bullets && (
                      <ul className="space-y-2">
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
                  </div>
                </div>
              </div>

              {/* Sticky footer — progress + actions always reachable, never scrolled out of view */}
              <div
                className="flex-shrink-0 px-6 sm:px-7 pt-4 pb-5 sm:pb-6"
                style={{
                  borderTop: "1px solid rgba(0,212,255,0.1)",
                  background: "rgba(6,10,20,0.5)",
                  paddingBottom: "max(1.1rem, env(safe-area-inset-bottom))",
                }}
              >
                <div className="flex items-center gap-1 mb-1.5">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goToStep(i)}
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ height: 4, background: "rgba(0,212,255,0.15)", cursor: "pointer" }}
                      aria-label={s.title}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg,#00D4FF,#00FF88)" }}
                        initial={false}
                        animate={{ width: i <= stepIndex ? "100%" : "0%" }}
                        transition={{ duration: 0.35 }}
                      />
                    </button>
                  ))}
                </div>
                <div
                  className="text-[11px] mb-4"
                  style={{ color: "rgba(122,232,255,0.45)", fontFamily: "Cairo,sans-serif" }}
                >
                  الخطوة {stepIndex + 1} من {STEPS.length}
                </div>

                <div className="flex items-center gap-3">
                  {!isFirst && (
                    <button
                      onClick={goBack}
                      className="px-4 py-3 rounded-2xl text-sm font-semibold flex-shrink-0"
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
                    animate={{
                      boxShadow: [
                        "0 6px 20px rgba(0,212,255,0.35)",
                        "0 6px 28px rgba(0,212,255,0.55)",
                        "0 6px 20px rgba(0,212,255,0.35)",
                      ],
                    }}
                    transition={{ boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold"
                    style={{
                      fontFamily: "Cairo,sans-serif",
                      color: "#0A0F1E",
                      background: "linear-gradient(135deg,#00D4FF,#00FF88)",
                      cursor: "pointer",
                    }}
                  >
                    {step.cta ?? (isLast ? "إنهاء" : "التالي")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="hidden lg:block" style={{ width: "clamp(0px,4vw,280px)" }} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

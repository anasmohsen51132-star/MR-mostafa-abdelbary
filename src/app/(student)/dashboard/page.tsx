"use client";
// src/app/(student)/dashboard/page.tsx
import { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { fetchWithAuth } from "@/hooks/useAuth";
import { WelcomeAnimation } from "@/components/dashboard/WelcomeAnimation";
import { StaggerContainer, StaggerItem } from "@/components/layout/PageTransition";
import type { Course } from "@/types";

// FEATURE-001: small mm:ss (or h:mm:ss) formatter for the continue-watching card.
function formatResumeTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function useFirstVisit() {
  const [isFirst, setIsFirst] = useState(false);
  useEffect(() => {
    const key = "mustafa_welcomed";
    if (!sessionStorage.getItem(key)) {
      setIsFirst(true);
      sessionStorage.setItem(key, "1");
    }
  }, []);
  return isFirst;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const isFirst = useFirstVisit();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isFirst) setShowWelcome(true);
  }, [isFirst]);

  const { data: coursesRes, isLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: () => fetchWithAuth("/api/courses"),
    enabled: !!user,
  });

  // FEATURE-001: "continue watching" — see /api/progress/continue.
  const { data: continueRes } = useQuery({
    queryKey: ["continue-watching"],
    queryFn: () => fetchWithAuth("/api/progress/continue"),
    enabled: !!user,
    staleTime: 30_000,
  });
  const continueWatching = continueRes?.data as {
    positionSeconds: number;
    lecture: { id: string; title: string };
    video: { id: string; title: string };
    course: { id: string; title: string; icon: string; color: string } | null;
  } | null | undefined;

  const { data: settingsRes } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchWithAuth("/api/customize"),
  });

  const bannerUrl  = settingsRes?.data?.dashboardBanner as string | undefined;

  const courses: (Course & { unlocked: boolean })[] = coursesRes?.data ?? [];
  const myCourses = courses.filter((c) => c.unlocked);
  const availableCourses = courses.filter((c) => !c.unlocked && c.isPublished);

  const firstName = user?.name?.split(" ")[0] ?? "الطالب";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صباح الخير" : hour < 18 ? "مساء الخير" : "مساء النور";

  return (
    <>
      {showWelcome && (
        <WelcomeAnimation name={firstName} onDone={() => setShowWelcome(false)} />
      )}

      <div style={{ direction: "rtl" }}>
        {/* ── Header greeting ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#0A0F1E,#111E38)",
              boxShadow: "0 8px 32px rgba(10,15,30,0.25)",
            }}
          >
            {/* Pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300D4FF' fill-opacity='0.06'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            {/* Cyan glow orb */}
            <motion.div
              className="absolute -top-8 -left-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(0,212,255,0.15),transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Diagonal shimmer sweep */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(115deg, transparent 30%, rgba(0,212,255,0.10) 50%, transparent 70%)",
              }}
              animate={{ x: ["-30%", "30%"] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <p style={{ fontFamily: "Cairo,sans-serif", color: "rgba(0,212,255,0.7)", fontSize: 14, marginBottom: 4 }}>
                {greeting}، 👋
              </p>
              <h1 style={{ fontFamily: "Cairo,sans-serif", color: "#7AE8FF", fontSize: "clamp(24px,4vw,40px)", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                {user?.name}
                <motion.span
                  style={{ fontSize: "0.5em", color: "rgba(0,212,255,0.6)" }}
                  animate={{ opacity: [0.3, 1, 0.3], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ✦
                </motion.span>
              </h1>
              <p style={{ fontFamily: "Cairo,sans-serif", color: "rgba(248,250,255,0.65)", fontSize: 14 }}>
                لديك{" "}
                <span style={{ color: "#00D4FF", fontWeight: 700 }}>{myCourses.length}</span>
                {" "}كورس نشط
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Continue Watching (FEATURE-001) ── */}
        {continueWatching && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Link
              href={`/lecture/${continueWatching.lecture.id}?v=${continueWatching.video.id}&t=${continueWatching.positionSeconds}`}
              className="flex items-center gap-4 rounded-2xl p-5 no-underline transition-transform hover:-translate-y-0.5"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(0,212,255,0.3)",
                boxShadow: "0 4px 20px rgba(0,212,255,0.12)",
              }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-xl"
                style={{
                  width: 56, height: 56,
                  background: `linear-gradient(135deg,#00D4FF,#00FF88)`,
                  fontSize: 24,
                }}
              >
                ▶️
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "Cairo,sans-serif", color: "#0099CC", fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                  أكمل من حيث توقفت
                </p>
                <h3 className="line-clamp-1" style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                  {continueWatching.video.title}
                </h3>
                <p className="line-clamp-1" style={{ fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 12.5 }}>
                  {continueWatching.course && <>{continueWatching.course.icon} {continueWatching.course.title} · </>}
                  {continueWatching.lecture.title} · عند {formatResumeTime(continueWatching.positionSeconds)}
                </p>
              </div>
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, background: "rgba(0,212,255,0.12)", fontSize: 14, color: "#0099CC" }}
              >
                ←
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Quick stats ── */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse"
                style={{ background: "#fff", border: "1px solid rgba(0,212,255,0.15)" }}
              >
                <div className="w-10 h-10 rounded-xl mb-3" style={{ background: "rgba(0,212,255,0.12)" }} />
                <div className="w-10 h-7 rounded mb-2" style={{ background: "rgba(45,58,90,0.12)" }} />
                <div className="w-20 h-3 rounded" style={{ background: "rgba(45,58,90,0.1)" }} />
              </div>
            ))
          ) : (
            [
              { icon: "📚", value: myCourses.length,      label: "كورساتي",      color: "#00D4FF" },
              { icon: "🎯", value: availableCourses.length, label: "كورسات متاحة", color: "#00FF88" },
              { icon: "🎟️", value: "—",                   label: "استخدم كوداً",  color: "#00D4FF", link: "/redeem" },
              { icon: "👤", value: "ملفي",                 label: "الإعدادات",    color: "#00FF88", link: "/profile" },
            ].map((s, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -4, boxShadow: `0 8px 24px ${s.color}30`, transition: { duration: 0.2 } }}
                className="rounded-2xl p-5"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,212,255,0.15)",
                  boxShadow: "0 2px 12px rgba(10,15,30,0.06)",
                  cursor: s.link ? "pointer" : "default",
                }}
                onClick={() => s.link && (window.location.href = s.link)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                  style={{ background: `${s.color}18` }}
                >
                  {s.icon}
                </div>
                <div style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 28, fontWeight: 700 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 13, marginTop: 2 }}>
                  {s.label}
                </div>
              </motion.div>
            </StaggerItem>
            ))
          )}
        </StaggerContainer>

        {/* ── Dashboard Banner ── */}
        {bannerUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <img
              src={bannerUrl}
              alt="بانر المنصة"
              className="w-full object-cover"
              style={{
                // Scale height in proportion to width (matches the banner's
                // real 21:9-ish design ratio) instead of a fixed pixel cap —
                // a fixed maxHeight made the crop ratio depend on screen
                // width, cutting the artwork differently on phone vs desktop.
                aspectRatio: "1280 / 511",
                // Still cap it on very wide/ultra-wide desktop monitors so
                // the banner doesn't grow oversized.
                maxHeight: 320,
                display: "block",
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </motion.div>
        )}

        {/* ── My Courses ── */}
        {myCourses.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 22 }}>كورساتي</h2>
              <Link href="/my-courses" style={{ fontFamily: "Cairo,sans-serif", color: "#00D4FF", fontSize: 13, textDecoration: "none" }}>
                عرض الكل ←
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myCourses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} unlocked />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Available Courses ── */}
        {availableCourses.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 22 }}>كورسات متاحة</h2>
              <Link href="/courses" style={{ fontFamily: "Cairo,sans-serif", color: "#00D4FF", fontSize: 13, textDecoration: "none" }}>
                عرض الكل ←
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableCourses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} unlocked={false} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty state */}
        {!isLoading && myCourses.length === 0 && availableCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
            <h3 style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 24, marginBottom: 8 }}>
              لا توجد كورسات بعد
            </h3>
            <p style={{ fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 15, marginBottom: 24 }}>
              استخدم كود الوصول لفتح أول كورس لك
            </p>
            <Link
              href="/redeem"
              style={{
                padding: "12px 32px", borderRadius: 14,
                background: "linear-gradient(135deg,#00D4FF,#00FF88)",
                color: "#0A0F1E", fontFamily: "Cairo,sans-serif",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
              }}
            >
              🎟️ استخدم كوداً الآن
            </Link>
          </motion.div>
        )}
      </div>
    </>
  );
}

// ── Inline CourseCard ──
function CourseCard({ course, unlocked }: { course: Course; unlocked: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 10px 28px ${course.color}25`, transition: { duration: 0.2 } }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: "1px solid rgba(0,212,255,0.15)",
        boxShadow: "0 4px 16px rgba(10,15,30,0.06)",
      }}
    >
      {/* Color header */}
      <div
        className="h-24 flex items-center justify-center text-4xl relative"
        style={{ background: `${course.color}22`, borderBottom: `2px solid ${course.color}30` }}
      >
        <motion.span
          animate={unlocked ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {course.icon}
        </motion.span>
        {!unlocked && (
          <div
            className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(0,0,0,0.5)", color: "#F8FAFF", fontFamily: "Cairo,sans-serif" }}
          >
            🔒 يحتاج كود
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          {course.title}
        </h3>
        {course.description && (
          <p style={{ fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}
            className="line-clamp-2">
            {course.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 12 }}>
            📖 {course._count?.lectures ?? 0} محاضرة
          </span>
          {unlocked ? (
            <Link
              href={`/courses/${course.id}`}
              style={{
                padding: "6px 16px", borderRadius: 10,
                background: "linear-gradient(135deg,#00D4FF,#00FF88)",
                color: "#0A0F1E", fontFamily: "Cairo,sans-serif",
                fontWeight: 700, fontSize: 12, textDecoration: "none",
              }}
            >
              ادخل ←
            </Link>
          ) : (
            <Link
              href="/redeem"
              style={{
                padding: "6px 16px", borderRadius: 10,
                border: "1px solid rgba(0,212,255,0.35)",
                color: "#00D4FF", fontFamily: "Cairo,sans-serif",
                fontWeight: 600, fontSize: 12, textDecoration: "none",
              }}
            >
              🎟️ فتح
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

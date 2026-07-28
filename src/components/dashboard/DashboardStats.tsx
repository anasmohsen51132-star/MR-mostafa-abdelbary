"use client";
// src/components/dashboard/DashboardStats.tsx
import { m as motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/hooks/useAuth";
import { useAuth } from "@/hooks/useAuth";
import type { Course } from "@/types";

export function DashboardStats() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["my-courses"],
    queryFn:  () => fetchWithAuth("/api/courses"),
    enabled:  !!user,
  });

  const courses: (Course & { unlocked: boolean })[] = data?.data ?? [];
  const myCourses  = courses.filter((c) => c.unlocked);
  const available  = courses.filter((c) => !c.unlocked && c.isPublished);

  const stats = [
    {
      icon: "🎓", value: myCourses.length,
      label: "كورساتي", color: "#00D4FF",
      bg: "rgba(0,212,255,0.1)", delay: 0,
    },
    {
      icon: "📚", value: available.length,
      label: "متاح للفتح", color: "#00FF88",
      bg: "rgba(0,255,136,0.1)", delay: 0.08,
    },
    {
      icon: "📖",
      value: myCourses.reduce((sum, c) => sum + (c._count?.lectures ?? 0), 0),
      label: "محاضرة", color: "#00D4FF",
      bg: "rgba(0,212,255,0.1)", delay: 0.16,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 32, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 16, delay: s.delay }}
          whileHover={{ y: -8, scale: 1.04, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
          className="rounded-2xl p-5 text-center"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,212,255,0.15)",
            boxShadow: "0 2px 12px rgba(10,15,30,0.05)",
          }}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -6, 0] }}
            transition={{ duration: 0.45 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-3"
            style={{ background: s.bg }}
          >
            {s.icon}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: s.delay + 0.2 }}
            style={{ fontFamily: "Cairo,sans-serif", color: s.color, fontSize: 32, fontWeight: 700, lineHeight: 1 }}
          >
            {s.value}
          </motion.div>
          <p style={{ fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 12, marginTop: 4 }}>
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

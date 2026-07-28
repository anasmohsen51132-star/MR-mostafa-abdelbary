"use client";
// src/app/(student)/profile/page.tsx
import { m as motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ACADEMIC_LEVEL_LABELS } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div style={{ direction: "rtl" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl"
      >
        <h1 style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 32, marginBottom: 24 }}>
          الملف الشخصي
        </h1>

        {/* Profile card */}
        <div
          className="rounded-3xl p-8 mb-6"
          style={{ background: "#fff", border: "1px solid rgba(0,212,255,0.15)", boxShadow: "0 4px 20px rgba(10,15,30,0.06)" }}
        >
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,255,136,0.2))", border: "2px solid rgba(0,212,255,0.3)" }}
            >
              {user.avatar ?? user.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 22, fontWeight: 700 }}>
                {user.name}
              </h2>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1"
                style={{ background: "rgba(0,255,136,0.1)", color: "#111E38", border: "1px solid rgba(0,255,136,0.2)", fontFamily: "Cairo,sans-serif" }}
              >
                طالب 🟢
              </span>
            </div>
          </div>

          {/* Info rows */}
          {[
            { icon: "📱", label: "رقم الهاتف", value: user.phone },
            { icon: "🎓", label: "المرحلة الدراسية", value: user.academicLevel ? ACADEMIC_LEVEL_LABELS[user.academicLevel] : "غير محدد" },
            { icon: "📅", label: "تاريخ الانضمام", value: formatDate(user.joinedAt) },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-4"
              style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}
            >
              <span style={{ fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 14 }}>
                {row.icon} {row.label}
              </span>
              <span style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 14, fontWeight: 600 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all hover:-translate-y-0.5"
          style={{
            border: "1.5px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.05)",
            color: "#DC2626",
            fontFamily: "Cairo,sans-serif",
            cursor: "pointer",
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </motion.div>
    </div>
  );
}

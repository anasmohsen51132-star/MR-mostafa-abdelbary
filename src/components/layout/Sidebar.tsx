"use client";
// src/components/layout/Sidebar.tsx — Chemistry Academy Edition
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
  section?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  brandTitle?: string;
  brandSub?: string;
  onLogout?: () => void;
  userName?: string;
  userAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  items,
  brandTitle = "أكاديمية مستر مصطفى عبد الباري",
  brandSub,
  onLogout,
  userName,
  userAvatar = "م",
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const sections = items.reduce<Record<string, SidebarItem[]>>((acc, item) => {
    const sec = item.section || "_";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(item);
    return acc;
  }, {});

  const inner = (
    <div
      className="h-full flex flex-col overflow-y-auto"
      style={{
        background: "linear-gradient(180deg,#0A0F1E 0%,#0D1528 100%)",
        direction: "rtl",
        borderLeft: "1px solid rgba(0,212,255,0.08)",
      }}
    >
      {/* Brand */}
      <div
        className="px-5 py-5 flex-shrink-0 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.12)" }}
      >
        {/* Atom logo mark */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
          style={{
            background: "linear-gradient(135deg,#00D4FF,#00FF88)",
            boxShadow: "0 4px 14px rgba(0,212,255,0.35)",
          }}
        >
          ⚛
        </div>
        <div className="min-w-0">
          <div
            className="text-[10px] font-semibold tracking-widest mb-0.5 uppercase truncate"
            style={{ color: "rgba(0,212,255,0.45)", fontFamily: "Cairo,sans-serif" }}
          >
            {brandSub ?? "منصة الكيمياء"}
          </div>
          <div
            className="text-[13px] font-bold leading-tight truncate"
            style={{ color: "#7AE8FF", fontFamily: "Cairo,sans-serif" }}
          >
            {brandTitle}
          </div>
        </div>
      </div>

      {/* User badge */}
      {userName && (
        <div
          className="px-4 py-3 flex-shrink-0 mx-3 my-3 rounded-xl"
          style={{
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#00D4FF,#00FF88)", color: "#0A0F1E" }}
            >
              {userAvatar}
            </div>
            <span
              className="text-sm truncate"
              style={{ color: "rgba(122,232,255,0.8)", fontFamily: "Cairo,sans-serif" }}
            >
              {userName}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 px-2">
        {Object.entries(sections).map(([section, sectionItems]) => (
          <div key={section}>
            {section !== "_" && (
              <div
                className="px-3 py-2 text-[10px] tracking-widest uppercase font-semibold"
                style={{ color: "rgba(122,232,255,0.25)", fontFamily: "Cairo,sans-serif" }}
              >
                {section}
              </div>
            )}
            {sectionItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 relative group rounded-xl mb-0.5",
                  )}
                  style={{
                    color: isActive ? "#00D4FF" : "rgba(122,232,255,0.6)",
                    fontFamily: "Cairo,sans-serif",
                    background: isActive ? "rgba(0,212,255,0.10)" : undefined,
                    borderRight: isActive ? "2.5px solid #00D4FF" : "2.5px solid transparent",
                  }}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-bg"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(0,212,255,0.07)" }}
                        transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.span
                    className="relative z-10 text-base"
                    whileHover={{ scale: 1.3, rotate: [0, -10, 10, -6, 0] }}
                    transition={{ duration: 0.35 }}
                  >
                    {item.icon}
                  </motion.span>

                  <span
                    className="relative z-10 flex-1 transition-transform duration-200 group-hover:translate-x-[-2px]"
                    style={{ fontWeight: isActive ? 600 : 400 }}
                  >
                    {item.label}
                  </span>

                  {item.badge !== undefined && (
                    <motion.span
                      className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "linear-gradient(135deg,#00D4FF,#00FF88)", color: "#0A0F1E" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      {onLogout && (
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
            style={{
              color: "rgba(122,232,255,0.4)",
              fontFamily: "Cairo,sans-serif",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F87171";
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(122,232,255,0.4)";
              e.currentTarget.style.background = "none";
            }}
          >
            <motion.span whileHover={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.4 }}>🚪</motion.span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* DESKTOP ≥1024px — fixed sidebar */}
      <aside
        className="hidden lg:flex fixed top-0 right-0 h-screen w-64 flex-col z-50"
        style={{ background: "#0A0F1E" }}
      >
        {inner}
      </aside>

      {/* MOBILE/TABLET <1024px — slide-in drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 h-full w-72 z-50 lg:hidden shadow-2xl"
              style={{ background: "#0A0F1E" }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
                style={{
                  background: "rgba(0,212,255,0.12)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  color: "#00D4FF",
                  fontSize: 18,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                aria-label="إغلاق القائمة"
              >
                ×
              </button>
              {inner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

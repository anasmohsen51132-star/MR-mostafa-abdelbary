"use client";
// src/app/(owner)/layout.tsx
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastContainer } from "@/components/ui/Toast";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useAuth } from "@/hooks/useAuth";
import type { SidebarItem } from "@/components/layout/Sidebar";

const OWNER_NAV: SidebarItem[] = [
  { id: "overview",  label: "لوحة المالك",    icon: "👑", href: "/owner",           section: "الرئيسية" },
  { id: "courses",   label: "الكورسات",        icon: "📚", href: "/admin/courses",   section: "الإدارة"  },
  { id: "lectures",  label: "المحاضرات",       icon: "🎬", href: "/admin/lectures",  section: "الإدارة"  },
  { id: "codes",     label: "كودات الوصول",    icon: "🎟️", href: "/admin/codes",     section: "الإدارة"  },
  { id: "students",  label: "الطلاب",          icon: "👥", href: "/admin/students",  section: "الإدارة"  },
  { id: "results",   label: "النتائج",          icon: "📊", href: "/admin/results",   section: "الإدارة"  },
  { id: "admins",    label: "المشرفون",        icon: "🔵", href: "/owner/admins",    section: "المالك"   },
  { id: "customize", label: "تخصيص المنصة",   icon: "🎨", href: "/owner/customize", section: "المالك"   },
  { id: "settings",  label: "الإعدادات",       icon: "⚙️", href: "/owner/settings",  section: "المالك"   },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, isHydrated, isSessionVerified, isAuthenticated, isOwner, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    // NEXT-001 FIX: see (admin)/layout.tsx for full context — wait for the
    // authoritative role from /api/auth/me before redirect decisions.
    if (!isHydrated || !isSessionVerified) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (!isOwner)          { router.replace("/dashboard"); }
  }, [isHydrated, isSessionVerified, isAuthenticated, isOwner, router]);

  const handleClose = useCallback(() => setSidebarOpen(false), []);

  if (!isHydrated || !isSessionVerified) return <FullScreenSpinner />;
  if (!isAuthenticated || !user || !isOwner) return null;

  return (
    <div className="min-h-screen" style={{ background: "#F0F4FF", direction: "rtl" }}>
      <ToastContainer />
      <Sidebar
        items={OWNER_NAV}
        brandSub="👑 لوحة المالك"
        onLogout={logout}
        userName={user.name}
        userAvatar={user.avatar ?? user.name.charAt(0)}
        isOpen={sidebarOpen}
        onClose={handleClose}
      />
      <main className="min-h-screen">
        <div className="lg:mr-64 px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6">
          {/* Mobile top bar */}
          <div className="flex lg:hidden items-center justify-between mb-5">
            <button onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", cursor: "pointer" }}
              aria-label="فتح القائمة">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <rect width="20" height="2.5" rx="1.25" fill="#00D4FF"/>
                <rect y="6.75" width="14" height="2.5" rx="1.25" fill="#00D4FF"/>
                <rect y="13.5" width="20" height="2.5" rx="1.25" fill="#00D4FF"/>
              </svg>
            </button>
            <span style={{ fontFamily: "Cairo,sans-serif", color: "#111E38", fontSize: 16, fontWeight: 700 }}>
              👑 لوحة المالك
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#00D4FF,#00FF88)", color: "#0A0F1E" }}>
              {user.avatar ?? user.name.charAt(0)}
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

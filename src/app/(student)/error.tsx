"use client";
// src/app/(student)/error.tsx
// NEXT-001 FIX: this route group had no error boundary — an unhandled error
// in any single page (e.g. a failed API call that threw instead of being
// caught) unmounted the entire student dashboard subtree with no feedback,
// rather than being contained to just the page that failed.
import { useEffect } from "react";
import Link from "next/link";

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[(student) error boundary]", error);
  }, [error]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
        <h2 style={{ color: "#111E38", fontSize: 19, fontWeight: 700, marginBottom: 6 }}>
          حدث خطأ في هذه الصفحة
        </h2>
        <p style={{ color: "#52607A", marginBottom: 20 }}>
          باقي أجزاء لوحة التحكم شغالة بشكل طبيعي. حاول إعادة تحميل هذه الصفحة فقط.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{ background: "#111E38", color: "#fff", border: "none", borderRadius: 10, padding: "9px 22px", fontWeight: 600, cursor: "pointer" }}
          >
            إعادة المحاولة
          </button>
          <Link
            href="/dashboard"
            style={{ background: "#fff", color: "#111E38", border: "1px solid #111E38", borderRadius: 10, padding: "9px 22px", fontWeight: 600, textDecoration: "none" }}
          >
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  );
}

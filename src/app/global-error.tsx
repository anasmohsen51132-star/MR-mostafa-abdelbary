"use client";
// src/app/global-error.tsx
// Root-level error boundary. This catches errors thrown by the root
// layout itself (src/app/layout.tsx) — a case regular error.tsx files
// can't handle, since they render *inside* the root layout.
// Because it replaces the root layout when triggered, it must render
// its own <html> and <body> tags.
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[root error boundary]", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0 }}>
        <div
          style={{
            background: "#F8FAFF",
            direction: "rtl",
            padding: 24,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "40px 32px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              textAlign: "center",
              maxWidth: 420,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h1
              style={{
                fontFamily: "Cairo,sans-serif",
                color: "#111E38",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              حدث خطأ غير متوقع
            </h1>
            <p style={{ color: "#52607A", marginBottom: 24, lineHeight: 1.6 }}>
              نعتذر عن هذا الخلل. حاول مرة أخرى، وإذا تكررت المشكلة تواصل مع الإدارة.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#111E38",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 28px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

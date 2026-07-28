"use client";
// src/app/(developer)/developer/errors/[id]/page.tsx
import { useParams, useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/hooks/useAuth";
import { useToast } from "@/store/uiStore";
import { SeverityBadge, CategoryBadge } from "@/components/developer/logs/LogBadges";
import { formatLogDateTime } from "@/components/developer/logs/logMeta";
import type { LogDetail } from "@/components/developer/logs/types";

const fieldLabel: React.CSSProperties = { fontFamily: "Cairo,sans-serif", color: "#52607A", fontSize: 12, marginBottom: 4 };
const fieldValue: React.CSSProperties = { fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 14 };

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast  = useToast();
  const qc     = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["developer-log-detail", id],
    queryFn:  () => fetchWithAuth(`/api/developer/logs/${id}`),
  });

  const log: LogDetail | undefined = data?.data;
  const notFound = !isLoading && !data?.success;

  const toggleResolved = useMutation({
    mutationFn: (resolved: boolean) =>
      fetchWithAuth(`/api/developer/logs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ resolved }),
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.data.resolved ? "✅ تم وضع علامة محلولة" : "↩️ تم إعادة فتح السجل");
        qc.invalidateQueries({ queryKey: ["developer-log-detail", id] });
        qc.invalidateQueries({ queryKey: ["developer-logs-errors"] });
        qc.invalidateQueries({ queryKey: ["developer-logs-events"] });
      } else {
        toast.error(res.error ?? "فشل التحديث");
      }
    },
  });

  return (
    <div style={{ direction: "rtl" }}>
      <button
        onClick={() => router.back()}
        style={{ background: "none", border: "none", color: "#111E38", fontFamily: "Cairo,sans-serif", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0 }}
      >
        → رجوع
      </button>

      {isLoading && <div className="skeleton rounded-2xl h-64" />}

      {notFound && (
        <div className="rounded-2xl p-10 text-center" style={{ background: "#fff", border: "1px dashed rgba(0,212,255,0.3)", fontFamily: "Cairo,sans-serif", color: "#52607A" }}>
          السجل غير موجود
        </div>
      )}

      {log && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Header card */}
          <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid rgba(0,212,255,0.15)", boxShadow: "0 2px 12px rgba(10,15,30,0.04)" }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SeverityBadge severity={log.severity} />
              <CategoryBadge category={log.category} />
              <span style={{
                marginRight: "auto",
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                fontFamily: "Cairo,sans-serif",
                background: log.resolved ? "rgba(0,255,136,0.1)" : "rgba(179,38,30,0.08)",
                color: log.resolved ? "#111E38" : "#B3261E",
              }}>
                {log.resolved ? "✓ محلولة" : "● مفتوحة"}
              </span>
            </div>

            <p style={{ fontFamily: "Cairo,sans-serif", color: "#0A0F1E", fontSize: 17, fontWeight: 600, lineHeight: 1.7, marginBottom: 16 }}>
              {log.message}
            </p>

            <button
              onClick={() => toggleResolved.mutate(!log.resolved)}
              disabled={toggleResolved.isPending}
              style={{
                background: log.resolved ? "#fff" : "#111E38",
                color: log.resolved ? "#111E38" : "#fff",
                border: log.resolved ? "1.5px solid #111E38" : "none",
                borderRadius: 10, padding: "9px 20px", fontWeight: 700,
                fontFamily: "Cairo,sans-serif", fontSize: 13, cursor: "pointer",
                opacity: toggleResolved.isPending ? 0.6 : 1,
              }}
            >
              {log.resolved ? "إعادة فتح السجل" : "وضع علامة محلولة"}
            </button>
          </div>

          {/* Details grid */}
          <div className="rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-3 gap-5" style={{ background: "#fff", border: "1px solid rgba(0,212,255,0.15)" }}>
            <div><p style={fieldLabel}>المسار</p><p style={{ ...fieldValue, fontFamily: "monospace" }}>{log.route ?? "—"}</p></div>
            <div><p style={fieldLabel}>الطريقة</p><p style={fieldValue}>{log.method ?? "—"}</p></div>
            <div><p style={fieldLabel}>IP</p><p style={{ ...fieldValue, fontFamily: "monospace" }}>{log.ip ?? "—"}</p></div>
            <div><p style={fieldLabel}>المستخدم</p><p style={fieldValue}>{log.userId ?? "غير مسجل"}</p></div>
            <div><p style={fieldLabel}>الدور</p><p style={fieldValue}>{log.role ?? "—"}</p></div>
            <div><p style={fieldLabel}>الوقت</p><p style={fieldValue}>{formatLogDateTime(log.createdAt)}</p></div>
            {log.resolvedAt && (
              <div><p style={fieldLabel}>وقت الحل</p><p style={fieldValue}>{formatLogDateTime(log.resolvedAt)}</p></div>
            )}
            {log.userAgent && (
              <div className="col-span-2 sm:col-span-3">
                <p style={fieldLabel}>الجهاز / المتصفح</p>
                <p style={{ ...fieldValue, fontSize: 12, wordBreak: "break-all" }}>{log.userAgent}</p>
              </div>
            )}
          </div>

          {/* Stack trace */}
          {log.stack && (
            <div className="rounded-2xl p-6" style={{ background: "#0A0F1E", border: "1px solid rgba(0,212,255,0.15)" }}>
              <p style={{ ...fieldLabel, color: "rgba(248,250,255,0.6)", marginBottom: 8 }}>Stack Trace</p>
              <pre style={{ color: "#F8FAFF", fontSize: 12, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", direction: "ltr", textAlign: "left", margin: 0 }}>
                {log.stack}
              </pre>
            </div>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid rgba(0,212,255,0.15)" }}>
              <p style={{ ...fieldLabel, marginBottom: 8 }}>بيانات إضافية</p>
              <pre style={{ color: "#52607A", fontSize: 12, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", direction: "ltr", textAlign: "left", margin: 0 }}>
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

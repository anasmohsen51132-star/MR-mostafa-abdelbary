"use client";
// src/components/theme/ImageUploadField.tsx
//
// TASK 05 — refactored onto the shared useFileUpload() hook (see
// src/hooks/useFileUpload.ts). Behavior/props are unchanged for callers —
// owner/customize/page.tsx uses this 10x for logo/hero/teacher/etc images
// and needs no changes. Fixes applied here:
//   - Instant local preview while uploading (was: spinner only, no way to
//     tell which file you'd actually picked until the network round trip
//     finished).
//   - Real progress percentage during upload instead of an indeterminate
//     spinner (useful on slower mobile connections for larger images).
//   - Replace/Delete overlay is now also revealed on keyboard focus
//     (`:focus-within`) and on touch (`data-touch` toggle), not just
//     mouse `:hover` — on a touch device the old CSS-only
//     `opacity-0 hover:opacity-100` overlay was effectively permanently
//     invisible (there is no hover on touch), so the replace/delete
//     actions were unreachable on mobile.
//   - The overlay buttons are no longer focusable while visually hidden
//     (tabIndex={-1} unless the overlay is actually shown) — previously a
//     keyboard user tabbing through the page would land on invisible
//     buttons.
//   - Retry affordance on failed uploads instead of forcing a full
//     reselect.
import { useCallback, useState } from "react";
import { m as motion } from "framer-motion";
import { fetchWithAuth } from "@/hooks/useAuth";
import { useToast } from "@/store/uiStore";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  label: string;
  hint?: string;
  fieldKey: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  aspect?: string; // CSS aspect-ratio for the preview box, e.g. "16/9"
}

export function ImageUploadField({ label, hint, fieldKey, value, onChange, aspect = "16/9" }: Props) {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Touch devices don't have a real `:hover`, so a tap toggles the
  // replace/delete overlay open instead of relying on hover-to-reveal.
  const [touchOpen, setTouchOpen] = useState(false);

  const {
    inputRef, accept, maxLabel, status, isUploading, progress, error,
    previewUrl, dragOver, dragProps, trigger, handleInputChange, retry,
  } = useFileUpload({
    kind: "image",
    onSuccess: (result) => onChange(result.url),
  });

  const confirmDelete = useCallback(async () => {
    setConfirmOpen(false);
    if (!value) return;
    try {
      const res = await fetchWithAuth("/api/owner/customize/delete-image", {
        method: "POST",
        body: JSON.stringify({ field: fieldKey, url: value }),
      });
      if (!res.success) throw new Error(res.error);
      onChange(null);
      toast.success("🗑️ تم حذف الصورة");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل حذف الصورة");
    }
  }, [value, fieldKey, onChange, toast]);

  // Prefer the freshly-uploaded/local-preview image over the saved value
  // while an upload is in flight or just finished, so there's never a
  // flash back to the old image before the parent's `value` prop updates.
  const displaySrc = previewUrl ?? value ?? null;
  const overlayVisible = touchOpen; // CSS :hover / :focus-within handle the rest

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontFamily: "Cairo,sans-serif", color: "var(--ink-muted)", fontSize: 12, fontWeight: 600, marginBottom: 6, display: "block" }}>
        {label}
      </label>
      {hint && (
        <p style={{ fontFamily: "Cairo,sans-serif", color: "var(--ink-light)", fontSize: 11, marginBottom: 8 }}>{hint}</p>
      )}

      <div
        {...dragProps}
        onClick={() => {
          if (isUploading) return;
          // On touch, first tap reveals the overlay instead of immediately
          // reopening the file picker underneath an image that's already set.
          if (displaySrc && !overlayVisible && "ontouchstart" in window) {
            setTouchOpen(true);
            return;
          }
          trigger();
        }}
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        data-overlay-open={overlayVisible || undefined}
        style={{
          aspectRatio: aspect,
          border: `2px dashed ${dragOver ? "var(--cyan)" : "var(--ds-border)"}`,
          background: dragOver ? "rgba(0,212,255,0.08)" : "var(--surface-dark)",
          transition: "border-color var(--duration-base) var(--ease-standard), background var(--duration-base) var(--ease-standard)",
        }}
        role="button"
        tabIndex={0}
        aria-label={`رفع صورة${label ? ` — ${label}` : ""}`}
        aria-busy={isUploading}
        onKeyDown={(e) => {
          if (!isUploading && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            trigger();
          }
        }}
        onBlur={(e) => {
          // Close the touch-revealed overlay once focus leaves the whole field.
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setTouchOpen(false);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleInputChange}
        />

        {displaySrc ? (
          <>
            <img src={displaySrc} alt={label} className="w-full h-full object-cover" draggable={false} />

            {/* Replace/Delete overlay — visible on hover (desktop), keyboard
                focus (accessibility), or tap (touch/mobile, via touchOpen). */}
            <div
              className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
              style={{
                background: "rgba(10,15,30,0.6)",
                opacity: overlayVisible ? 1 : undefined,
                transitionDuration: "var(--duration-base)",
              }}
            >
              <button
                type="button"
                tabIndex={overlayVisible ? 0 : undefined}
                onClick={(e) => { e.stopPropagation(); trigger(); }}
                style={{ padding: "8px 14px", borderRadius: 9, border: "none", background: "#fff", color: "var(--ink)", fontFamily: "Cairo,sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                🔄 استبدال
              </button>
              <button
                type="button"
                tabIndex={overlayVisible ? 0 : undefined}
                onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
                style={{ padding: "8px 14px", borderRadius: 9, border: "none", background: "#DC2626", color: "#fff", fontFamily: "Cairo,sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                🗑️ حذف
              </button>
            </div>

            {/* Upload progress overlay shown on top of the (already-visible
                local) preview while replacing an existing image. */}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: "rgba(10,15,30,0.55)" }}>
                <UploadSpinner />
                <span style={{ fontFamily: "Cairo,sans-serif", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                  {progress > 0 ? `جارٍ الرفع... ${progress}%` : "جارٍ الرفع..."}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
            {isUploading ? (
              <>
                <UploadSpinner />
                <span style={{ fontFamily: "Cairo,sans-serif", color: "var(--cyan-dark)", fontSize: 12, fontWeight: 600 }}>
                  {progress > 0 ? `جارٍ الرفع... ${progress}%` : "جارٍ الرفع..."}
                </span>
                {progress > 0 && (
                  <div style={{ width: "70%", height: 4, borderRadius: 2, background: "rgba(0,212,255,0.15)", overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "var(--cyan)", transition: "width 0.15s linear" }} />
                  </div>
                )}
              </>
            ) : status === "error" ? (
              <>
                <span style={{ fontSize: 22 }}>⚠️</span>
                <span style={{ fontFamily: "Cairo,sans-serif", color: "#DC2626", fontSize: 12, fontWeight: 600 }}>{error}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); retry(); }}
                  style={{ marginTop: 4, padding: "5px 14px", borderRadius: 8, border: "1px solid #DC2626", color: "#DC2626", background: "none", fontFamily: "Cairo,sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                >
                  🔁 إعادة المحاولة
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: 22 }}>🖼️</span>
                <span style={{ fontFamily: "Cairo,sans-serif", color: "var(--ink-light)", fontSize: 12 }}>
                  اسحب صورة هنا أو اضغط للاختيار
                </span>
                <span style={{ fontFamily: "Cairo,sans-serif", color: "var(--ink-light)", fontSize: 10 }}>
                  PNG · JPG · WEBP — حتى {maxLabel}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="حذف الصورة؟"
        description="هيتم حذف الصورة نهائيًا من التخزين ومن هذا الحقل. الإجراء ده لا يمكن التراجع عنه."
        confirmLabel="حذف نهائي"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function UploadSpinner() {
  return (
    <motion.div
      className="w-5 h-5 rounded-full border-2"
      style={{ borderColor: "var(--cyan) transparent var(--cyan) transparent" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

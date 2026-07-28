// src/components/dashboard/StudentSpinner.tsx
//
// Chemistry-themed full-screen loading state for the Student Experience
// only. The app-wide FullScreenSpinner (src/components/ui/FullScreenSpinner.tsx)
// is shared with the admin/owner/developer/auth layouts, which are out of
// scope here — so rather than restyle it (and change those areas too),
// this is a dedicated drop-in used only by (student)/loading.tsx and the
// (student) layout's own auth-rehydration gate.
export function StudentSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#F0F4FF" }}
    >
      <div
        className="w-10 h-10 rounded-full border-4 animate-spin"
        style={{ borderColor: "rgba(0,212,255,0.2)", borderTopColor: "#00D4FF" }}
        role="status"
        aria-label="جاري التحميل"
      />
    </div>
  );
}

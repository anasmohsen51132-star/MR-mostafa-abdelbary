"use client";
// src/app/(admin)/admin/quiz-builder/page.tsx
// Full quiz/homework builder with:
//  - Text questions
//  - Image-only questions (file upload → /api/upload)
//  - Text+Image questions
//  - Image answer choices (file upload)
//  - Live image preview with error handling
//  - Multi-choice correct-answer selection
//  - Quiz and homework behave identically (auto-graded, multi-choice,
//    3 attempts) — the only difference between them is the label shown.

import { useState, useCallback, memo } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchWithAuth } from "@/hooks/useAuth";
import { useToast } from "@/store/uiStore";
import { useFileUpload } from "@/hooks/useFileUpload";
import type { QuestionForm, ChoiceForm } from "@/types";

// PERF FIX: hoisted out of the component (used to be recreated as a new
// object on every single render). These are passed down to QuestionBlock
// below, which is wrapped in React.memo specifically to stop every question
// re-rendering on every keystroke typed into any one of them (see the note
// on QuestionBlock) — a new object reference for these style props every
// render would silently defeat that memoization, since React.memo does a
// shallow prop comparison and a fresh object is never `===` to the last one.
const FIELD_STYLE: React.CSSProperties = {
  padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid rgba(201,168,76,0.25)",
  background: "#FAFAF8", color: "#1A1208",
  fontFamily: "Cairo,sans-serif", fontSize: 13,
  outline: "none", direction: "rtl", transition: "border-color 0.2s",
};

const SECTION_CARD: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(201,168,76,0.15)",
  boxShadow: "0 2px 12px rgba(26,18,8,0.04)",
  borderRadius: 20,
  padding: 24,
};

// ── Helpers ──────────────────────────────────────────────────

const blank = (): ChoiceForm => ({ text: "", imageUrl: "", isCorrect: false });
const blankQ = (): QuestionForm => ({
  text: "", imageUrl: "", type: "MULTIPLE_CHOICE",
  choices: [blank(), blank(), blank(), blank()],
});

// Image upload for question/choice images now goes entirely through the
// shared useFileUpload() hook (src/hooks/useFileUpload.ts) — see UploadBtn
// below. The local uploadImage()/useImageUpload() implementations that
// used to live here were removed as part of Task 05's upload-system
// unification; the /api/upload endpoint and request shape are unchanged.

// ── Image preview component with remove button ───────────────

function ImagePreview({
  url,
  onRemove,
  maxH = "max-h-40",
  alt = "معاينة صورة",
}: {
  url: string;
  onRemove: () => void;
  maxH?: string;
  alt?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (!url || broken) return null;
  return (
    <div className="relative inline-block mt-2">
      <img
        src={url}
        alt={alt}
        className={`rounded-xl object-contain border ${maxH}`}
        style={{ borderColor: "rgba(201,168,76,0.2)", maxWidth: "100%" }}
        onError={() => setBroken(true)}
        draggable={false}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: "#DC2626",
          color: "#fff",
          border: "2px solid #fff",
          cursor: "pointer",
          lineHeight: 1,
        }}
        title="حذف الصورة"
      >
        ×
      </button>
    </div>
  );
}

// ── Image upload button ──────────────────────────────────────

function UploadBtn({
  onUrl,
  label = "رفع صورة",
  small = false,
}: {
  onUrl: (url: string) => void;
  label?: string;
  small?: boolean;
}) {
  // BUGFIX (Task 05): this button used to receive its disabled/loading
  // state as a prop (`loading`) fed by a *separate*, parent-level state
  // map (qImgLoading/cImgLoading) that was never actually updated by the
  // real upload path — the functions that did update it (handleQImage/
  // handleCImage) were dead code, never called. The button therefore
  // never disabled itself during a real upload, which is exactly what let
  // a fast double-click fire two concurrent uploads for the same field.
  // It now drives its own disabled/progress state directly from its own
  // upload, which can't drift out of sync with reality.
  const { inputRef, accept, isUploading, progress, trigger, handleInputChange } = useFileUpload({
    kind: "image",
    onSuccess: (result) => onUrl(result.url),
  });
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={trigger}
        disabled={isUploading}
        aria-label={label}
        aria-busy={isUploading}
        style={{
          padding:      small ? "4px 10px" : "7px 16px",
          borderRadius: small ? 8 : 10,
          border:       "1.5px solid rgba(0,212,255,0.35)",
          background:   isUploading ? "rgba(0,212,255,0.1)" : "rgba(0,212,255,0.06)",
          color:        "var(--cyan-dark)",
          fontFamily:   "Cairo,sans-serif",
          fontSize:     small ? 11 : 12,
          fontWeight:   600,
          cursor:       isUploading ? "not-allowed" : "pointer",
          whiteSpace:   "nowrap",
          display:      "inline-flex",
          alignItems:   "center",
          gap:          4,
          transition:   "background var(--duration-base) var(--ease-standard)",
        }}
      >
        {isUploading ? `⏳ ${progress > 0 ? `${progress}%` : "..."}` : `🖼️ ${label}`}
      </button>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────

// PERF FIX: this used to be rendered inline inside `questions.map(...)` in
// the main component below. Every keystroke into ANY field called
// setQuestions() with a full new array, and since the inline map wasn't
// memoized, React re-rendered EVERY question block (all its choices, image
// previews, and motion wrappers) on every single keystroke — not just the
// one field being typed into. With several questions already added, this
// visibly cascaded into noticeable input lag, most pronounced on mobile
// CPUs (this is the root cause of "typing feels slow on mobile" for this
// page). Extracting this into its own component wrapped in React.memo, and
// giving it only the narrow, stable-reference callbacks it actually needs
// (see the useCallback wrapping in QuizBuilderPage below), means a
// keystroke in question 3 now only re-renders question 3.
interface QuestionBlockProps {
  q: QuestionForm;
  qi: number;
  questionsLength: number;
  onUpdateQ: (qi: number, field: keyof QuestionForm, value: unknown) => void;
  onUpdateC: (qi: number, ci: number, field: keyof ChoiceForm, value: unknown) => void;
  onSetCorrect: (qi: number, ci: number) => void;
  onRemoveQuestion: (qi: number) => void;
  onAddChoice: (qi: number) => void;
  onRemoveChoice: (qi: number, ci: number) => void;
}

const QuestionBlock = memo(function QuestionBlock({
  q, qi, questionsLength,
  onUpdateQ, onUpdateC, onSetCorrect, onRemoveQuestion, onAddChoice, onRemoveChoice,
}: QuestionBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}
      style={SECTION_CARD}
    >
      {/* Question header */}
      <div className="flex items-center justify-between mb-5">
        <div className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#1A1208", fontFamily: "Cairo,sans-serif" }}>
          سؤال {qi + 1}
        </div>
        {questionsLength > 1 && (
          <button type="button" onClick={() => onRemoveQuestion(qi)}
            style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.25)", color: "#DC2626", background: "none", fontFamily: "Cairo,sans-serif", fontSize: 12, cursor: "pointer" }}>
            حذف السؤال
          </button>
        )}
      </div>

      {/* Question text */}
      <div className="mb-3">
        <label style={{ fontFamily: "Cairo,sans-serif", color: "#4A3F2A", fontSize: 12, marginBottom: 4, display: "block", fontWeight: 600 }}>
          نص السؤال <span style={{ color: "#7A6E5A", fontWeight: 400 }}>(اختياري إذا أضفت صورة)</span>
        </label>
        <textarea
          value={q.text ?? ""}
          onChange={(e) => onUpdateQ(qi, "text", e.target.value)}
          placeholder="اكتب نص السؤال هنا..."
          rows={2}
          style={{ ...FIELD_STYLE, width: "100%", resize: "vertical" }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
          onBlur={(e)  => (e.target.style.borderColor = "rgba(201,168,76,0.25)")}
        />
      </div>

      {/* Question image */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <label style={{ fontFamily: "Cairo,sans-serif", color: "#4A3F2A", fontSize: 12, fontWeight: 600 }}>
            🖼️ صورة السؤال
          </label>
          <UploadBtn
            onUrl={(url) => onUpdateQ(qi, "imageUrl", url)}
            label="رفع من الجهاز"
          />
        </div>
        {/* Also allow URL input */}
        <input
          value={typeof q.imageUrl === "string" && !q.imageUrl.startsWith("data:") ? q.imageUrl : ""}
          onChange={(e) => onUpdateQ(qi, "imageUrl", e.target.value)}
          placeholder="أو أدخل رابط صورة مباشر (https://...)"
          style={{ ...FIELD_STYLE, width: "100%", direction: "ltr", fontSize: 12 }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
          onBlur={(e)  => (e.target.style.borderColor = "rgba(201,168,76,0.25)")}
        />
        <ImagePreview
          url={q.imageUrl ?? ""}
          onRemove={() => onUpdateQ(qi, "imageUrl", "")}
          alt={`معاينة صورة السؤال ${qi + 1}`}
        />
      </div>

      {/* Choices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label style={{ fontFamily: "Cairo,sans-serif", color: "#4A3F2A", fontSize: 13, fontWeight: 600 }}>
            الخيارات — اضغط الدائرة لتحديد الإجابة الصحيحة
          </label>
          <button type="button" onClick={() => onAddChoice(qi)}
            style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid rgba(201,168,76,0.3)", color: "#8B6914", background: "none", fontFamily: "Cairo,sans-serif", fontSize: 12, cursor: "pointer" }}>
            ＋ خيار
          </button>
        </div>

        <div className="space-y-4">
          {q.choices.map((c, ci) => {
            return (
              <div key={ci} className="rounded-xl p-3"
                style={{ border: `1.5px solid ${c.isCorrect ? "rgba(45,158,107,0.4)" : "rgba(201,168,76,0.15)"}`,
                  background: c.isCorrect ? "rgba(45,158,107,0.04)" : "rgba(250,247,240,0.4)",
                  transition: "all 0.15s" }}>
                <div className="flex items-start gap-3">
                  {/* Correct answer radio — shown for both quiz and homework now */}
                  <button type="button" onClick={() => onSetCorrect(qi, ci)}
                    className="mt-1 flex-shrink-0"
                    style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid",
                      borderColor: c.isCorrect ? "#2D9E6B" : "rgba(201,168,76,0.35)",
                      background: c.isCorrect ? "#2D9E6B" : "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 13, transition: "all 0.15s" }}
                    title="الإجابة الصحيحة">
                    {c.isCorrect ? "✓" : ""}
                  </button>

                  <div style={{ flex: 1 }}>
                    {/* Choice text */}
                    <input
                      value={c.text ?? ""}
                      onChange={(e) => onUpdateC(qi, ci, "text", e.target.value)}
                      placeholder={`نص الخيار ${ci + 1}`}
                      style={{ ...FIELD_STYLE, width: "100%", marginBottom: 6,
                        borderColor: c.isCorrect ? "rgba(45,158,107,0.4)" : "rgba(201,168,76,0.25)" }}
                      onFocus={(e) => (e.target.style.borderColor = c.isCorrect ? "rgba(45,158,107,0.6)" : "rgba(201,168,76,0.6)")}
                      onBlur={(e)  => (e.target.style.borderColor = c.isCorrect ? "rgba(45,158,107,0.4)" : "rgba(201,168,76,0.25)")}
                    />

                    {/* Choice image */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <UploadBtn
                        onUrl={(url) => onUpdateC(qi, ci, "imageUrl", url)}
                        label="صورة للخيار"
                        small
                      />
                      <input
                        value={typeof c.imageUrl === "string" && !c.imageUrl.startsWith("data:") ? c.imageUrl : ""}
                        onChange={(e) => onUpdateC(qi, ci, "imageUrl", e.target.value)}
                        placeholder="أو رابط صورة مباشر"
                        style={{ ...FIELD_STYLE, flex: 1, minWidth: 120, fontSize: 11, direction: "ltr", padding: "5px 8px" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
                        onBlur={(e)  => (e.target.style.borderColor = "rgba(201,168,76,0.25)")}
                      />
                    </div>
                    <ImagePreview
                      url={c.imageUrl ?? ""}
                      onRemove={() => onUpdateC(qi, ci, "imageUrl", "")}
                      maxH="max-h-20"
                      alt={`معاينة صورة الاختيار ${ci + 1} — السؤال ${qi + 1}`}
                    />
                  </div>

                  {/* Remove choice */}
                  {q.choices.length > 2 && (
                    <button type="button" onClick={() => onRemoveChoice(qi, ci)}
                      className="mt-1 flex-shrink-0"
                      style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(239,68,68,0.3)", color: "#DC2626", background: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});

export default function QuizBuilderPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const toast        = useToast();
  const qc           = useQueryClient();

  const lectureId = searchParams.get("lectureId") ?? "";
  const type      = (searchParams.get("type") ?? "quiz") as "quiz" | "homework";

  const [quizTitle, setQuizTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionForm[]>([blankQ()]);

  // ── Mutations ──────────────────────────────────────────────

  const createQuiz = useMutation({
    mutationFn: () =>
      fetchWithAuth("/api/quizzes", {
        method: "POST",
        body: JSON.stringify({
          lectureId, title: quizTitle,
          timeLimit: timeLimit ? parseInt(timeLimit) : null,
          questions,
        }),
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("✅ تم إنشاء الاختبار");
        qc.invalidateQueries({ queryKey: ["admin-lecture", lectureId] });
        router.push(`/admin/lectures/${lectureId}`);
      } else {
        toast.error(res.error ?? "فشل الإنشاء");
      }
    },
    onError: () => toast.error("حدث خطأ في الاتصال"),
  });

  const createHomework = useMutation({
    mutationFn: () =>
      fetchWithAuth("/api/homework", {
        method: "POST",
        body: JSON.stringify({ lectureId, title: quizTitle, questions }),
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("✅ تم إنشاء الواجب");
        qc.invalidateQueries({ queryKey: ["admin-lecture", lectureId] });
        router.push(`/admin/lectures/${lectureId}`);
      } else {
        toast.error(res.error ?? "فشل الإنشاء");
      }
    },
    onError: () => toast.error("حدث خطأ في الاتصال"),
  });

  // ── Question helpers ───────────────────────────────────────
  // PERF FIX: wrapped in useCallback (all use the functional setQuestions
  // form, so no dependencies are needed) so each has a stable reference
  // across renders. QuestionBlock above is wrapped in React.memo — without
  // this, a new function identity on every render would still cause every
  // question to re-render on every keystroke, defeating that memoization
  // even though the component itself is memoized correctly.

  const addQuestion = useCallback(() => setQuestions((q) => [...q, blankQ()]), []);

  const removeQuestion = useCallback((qi: number) =>
    setQuestions((q) => q.filter((_, i) => i !== qi)), []);

  const updateQ = useCallback((qi: number, field: keyof QuestionForm, value: unknown) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, [field]: value } : q))
    ), []);

  const updateC = useCallback((qi: number, ci: number, field: keyof ChoiceForm, value: unknown) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qi ? q : {
          ...q,
          choices: q.choices.map((c, j) =>
            j === ci ? { ...c, [field]: value } : c
          ),
        }
      )
    ), []);

  const setCorrect = useCallback((qi: number, ci: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qi ? q : {
          ...q,
          choices: q.choices.map((c, j) => ({ ...c, isCorrect: j === ci })),
        }
      )
    ), []);

  const addChoice = useCallback((qi: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, choices: [...q.choices, blank()] } : q
      )
    ), []);

  const removeChoice = useCallback((qi: number, ci: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qi ? q : { ...q, choices: q.choices.filter((_, j) => j !== ci) }
      )
    ), []);

  // ── Submit validation ──────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      toast.error(`أدخل عنوان ${type === "quiz" ? "الاختبار" : "الواجب"}`);
      return;
    }
    if (!lectureId) {
      toast.error("lectureId مفقود");
      return;
    }
    for (let qi = 0; qi < questions.length; qi++) {
      const q = questions[qi];
      if (!q.text?.trim() && !q.imageUrl?.trim()) {
        toast.error(`السؤال ${qi + 1}: أضف نصاً أو صورة`);
        return;
      }
      // NOTE: a choice's text/image is still optional (letter labels
      // أ/ب/ج/د identify it on the student side regardless), but every
      // question — quiz or homework — must now have a correct answer
      // marked, since homework auto-grades exactly like quiz does.
      if (!q.choices.some((c) => c.isCorrect)) {
        toast.error(`السؤال ${qi + 1}: حدد الإجابة الصحيحة`);
        return;
      }
    }
    type === "quiz" ? createQuiz.mutate() : createHomework.mutate();
  };

  const isPending = createQuiz.isPending || createHomework.isPending;

  return (
    <div style={{ direction: "rtl" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8 flex-wrap"
      >
        <Link
          href={lectureId ? `/admin/lectures/${lectureId}` : "/admin/lectures"}
          style={{ color: "#C9A84C", fontFamily: "Cairo,sans-serif", fontSize: 13, textDecoration: "none" }}
        >
          ← عودة للمحاضرة
        </Link>
        <h1 style={{ fontFamily: "Amiri,serif", color: "#1A1208", fontSize: 28 }}>
          {type === "quiz" ? "🧪 إنشاء اختبار" : "📋 إنشاء واجب"}
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Title + time limit ── */}
        <div style={SECTION_CARD}>
          <div className="flex gap-4 flex-wrap">
            <div style={{ flex: 2, minWidth: 200 }}>
              <label style={{ fontFamily: "Cairo,sans-serif", color: "#4A3F2A", fontSize: 13, fontWeight: 600, marginBottom: 5, display: "block" }}>
                {type === "quiz" ? "عنوان الاختبار *" : "عنوان الواجب *"}
              </label>
              <input
                value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)}
                placeholder={type === "quiz" ? "مثال: اختبار الدرس الأول" : "مثال: واجب المبتدأ والخبر"}
                style={{ ...FIELD_STYLE, width: "100%" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(201,168,76,0.25)")}
              />
            </div>
            {type === "quiz" && (
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={{ fontFamily: "Cairo,sans-serif", color: "#4A3F2A", fontSize: 13, fontWeight: 600, marginBottom: 5, display: "block" }}>
                  الوقت (دقيقة) — اختياري
                </label>
                <input
                  type="number" min="1" value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  placeholder="بلا حد"
                  style={{ ...FIELD_STYLE, width: "100%", direction: "ltr" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(201,168,76,0.25)")}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Questions ── */}
        <AnimatePresence>
          {questions.map((q, qi) => (
            <QuestionBlock
              key={qi}
              q={q}
              qi={qi}
              questionsLength={questions.length}
              onUpdateQ={updateQ}
              onUpdateC={updateC}
              onSetCorrect={setCorrect}
              onRemoveQuestion={removeQuestion}
              onAddChoice={addChoice}
              onRemoveChoice={removeChoice}
            />
          ))}
        </AnimatePresence>

        {/* ── Add question + Submit ── */}
        <div className="flex gap-4 flex-wrap">
          <button type="button" onClick={addQuestion}
            style={{ padding: "12px 28px", borderRadius: 14, border: "1.5px solid rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.06)", color: "#8B6914",
              fontFamily: "Cairo,sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            ＋ إضافة سؤال ({questions.length})
          </button>

          <motion.button type="submit" disabled={isPending}
            whileHover={!isPending ? { y: -2 } : {}} whileTap={!isPending ? { scale: 0.98 } : {}}
            style={{ padding: "12px 40px", borderRadius: 14, border: "none",
              background: isPending ? "rgba(201,168,76,0.35)" : "linear-gradient(135deg,#C9A84C,#8B6914)",
              boxShadow: isPending ? "none" : "0 6px 20px rgba(201,168,76,0.4)",
              color: "#1A1208", fontFamily: "Cairo,sans-serif", fontWeight: 700, fontSize: 15,
              cursor: isPending ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {isPending
              ? "⏳ جارٍ الحفظ..."
              : `💾 حفظ ${type === "quiz" ? "الاختبار" : "الواجب"} (${questions.length} سؤال)`}
          </motion.button>
        </div>

      </form>
    </div>
  );
}

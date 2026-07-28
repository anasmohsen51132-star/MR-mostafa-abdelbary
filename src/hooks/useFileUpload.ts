// src/hooks/useFileUpload.ts
//
// TASK 05 — Upload System Refactor
//
// Single, reusable upload primitive for every file-upload surface in the
// app (owner branding images, lecture PDFs, quiz/choice images). Before
// this, the same fetch+FormData+loading-state pattern was hand-rolled
// three separate times (ImageUploadField.tsx, the PDF uploader in
// admin/lectures/[id]/page.tsx, and useImageUpload() in
// admin/quiz-builder/page.tsx), with real drift between the copies:
//   - Only ImageUploadField validated file type/size on the client before
//     uploading; the other two relied entirely on the server round-trip.
//   - None of them reported real upload progress (all used fetch(), which
//     has no progress event — this hook uses XMLHttpRequest specifically
//     so large PDF uploads can show a percentage instead of an
//     indeterminate spinner).
//   - The quiz-builder's own "loading" state (qImgLoading/cImgLoading) was
//     never actually wired to the real upload path — see the removed dead
//     code in admin/quiz-builder/page.tsx — so those buttons never
//     disabled themselves during an upload, which is exactly what let a
//     fast double-click fire two concurrent uploads for the same field.
//     This hook closes that with a synchronous ref-based lock (`inFlightRef`)
//     that isn't subject to React's async state-batching, so it can't lose
//     a race the way a `useState` flag can.
//
// Client-side validation rules intentionally mirror src/app/api/upload/route.ts
// exactly (same allowed MIME types, same 5MB image / 20MB PDF caps) so the
// user gets an instant, correct Arabic error instead of waiting on a
// network round trip just to be told something the client already knew.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/store/uiStore";

export type UploadKind = "image" | "pdf";
export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadResult {
  url: string;
  name: string;
  type: string;
  size: number;
}

interface UseFileUploadOptions {
  kind: UploadKind;
  /** Called once per successful upload with the server's response + the original File. */
  onSuccess?: (result: UploadResult, file: File) => void;
  /** Suppress the built-in success toast (e.g. the caller shows its own). */
  silent?: boolean;
}

// Mirrors ALLOWED_IMAGE_TYPES / ALLOWED_PDF_TYPES / MAX_IMAGE_SIZE /
// MAX_PDF_SIZE in src/app/api/upload/route.ts. Keep these two in sync if
// the server limits ever change.
const RULES: Record<
  UploadKind,
  { allowed: string[]; maxBytes: number; maxLabel: string; accept: string; typeErrorAr: string }
> = {
  image: {
    allowed: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxBytes: 5 * 1024 * 1024,
    maxLabel: "5MB",
    accept: "image/jpeg,image/png,image/webp,image/gif",
    typeErrorAr: "الصيغة غير مدعومة — PNG أو JPG أو WEBP أو GIF فقط",
  },
  pdf: {
    allowed: ["application/pdf"],
    maxBytes: 20 * 1024 * 1024,
    maxLabel: "20MB",
    accept: "application/pdf",
    typeErrorAr: "الصيغة غير مدعومة — ملفات PDF فقط",
  },
};

export function useFileUpload({ kind, onSuccess, silent }: UseFileUploadOptions) {
  const toast = useToast();
  const rules = RULES[kind];

  const inputRef = useRef<HTMLInputElement>(null);
  // Synchronous lock — checked and set before any state update, so it
  // can't be bypassed by a second click firing before React re-renders
  // with the "uploading" status (the actual mechanism behind the
  // double-upload bug found in quiz-builder's dead qImgLoading state).
  const inFlightRef = useRef(false);
  const objectUrlRef = useRef<string | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const revokePreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  // Revoke any outstanding local preview URL, and abort an in-flight
  // request, if this hook's component unmounts mid-upload.
  useEffect(() => {
    return () => {
      revokePreview();
      xhrRef.current?.abort();
    };
  }, [revokePreview]);

  const validate = useCallback(
    (file: File): string | null => {
      if (file.size === 0) return "الملف فارغ";
      if (!rules.allowed.includes(file.type)) return rules.typeErrorAr;
      if (file.size > rules.maxBytes) return `حجم الملف أكبر من الحد المسموح (${rules.maxLabel})`;
      return null;
    },
    [rules]
  );

  const doUpload = useCallback(
    (file: File) => {
      if (inFlightRef.current) return; // hard guard: ignore a second call mid-upload
      const validationError = validate(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      inFlightRef.current = true;
      setStatus("uploading");
      setProgress(0);
      setError(null);
      setPendingFile(file);

      // Instant local preview for images, shown while the network request
      // is still in flight — replaces the old "spinner with no idea what
      // you picked" state.
      if (kind === "image") {
        revokePreview();
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setPreviewUrl(url);
      }

      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", kind);

      // XHR rather than fetch() specifically because fetch has no upload
      // progress event — this is what powers the percentage progress bar
      // for large PDF uploads instead of an indeterminate spinner.
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };

      xhr.onload = () => {
        inFlightRef.current = false;
        xhrRef.current = null;
        let json: { success?: boolean; data?: UploadResult; error?: string } | null = null;
        try {
          json = JSON.parse(xhr.responseText);
        } catch {
          /* handled by the fallback message below */
        }
        if (xhr.status >= 200 && xhr.status < 300 && json?.success && json.data) {
          setStatus("success");
          setProgress(100);
          if (!silent) {
            toast.success(kind === "image" ? "✅ تم رفع الصورة" : "✅ تم رفع الملف");
          }
          onSuccess?.(json.data, file);
        } else {
          const msg = json?.error ?? "فشل الرفع، حاول مرة أخرى";
          setStatus("error");
          setError(msg);
          toast.error(msg);
        }
      };

      xhr.onerror = () => {
        inFlightRef.current = false;
        xhrRef.current = null;
        const msg = "تعذر الاتصال بالخادم — تحقق من الإنترنت وحاول مرة أخرى";
        setStatus("error");
        setError(msg);
        toast.error(msg);
      };

      xhr.onabort = () => {
        inFlightRef.current = false;
        xhrRef.current = null;
      };

      xhr.open("POST", "/api/upload");
      xhr.send(fd);
    },
    [kind, onSuccess, silent, toast, validate, revokePreview]
  );

  // Handles both real device file pickers AND the "same file picked twice
  // in a row" bug: browsers only fire `onChange` when the input's value
  // actually changes, so re-selecting the exact same file after clearing
  // it (or after a failed upload) silently does nothing unless the input's
  // value is reset immediately after reading the file — done here, not
  // left to each call site to remember.
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) doUpload(file);
    },
    [doUpload]
  );

  const trigger = useCallback(() => {
    if (!inFlightRef.current) inputRef.current?.click();
  }, []);

  const retry = useCallback(() => {
    if (pendingFile) doUpload(pendingFile);
  }, [pendingFile, doUpload]);

  const cancel = useCallback(() => {
    xhrRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    inFlightRef.current = false;
    setStatus("idle");
    setProgress(0);
    setError(null);
    setPendingFile(null);
    revokePreview();
    setPreviewUrl(null);
  }, [revokePreview]);

  const dragProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (!inFlightRef.current) setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) doUpload(file);
    },
  };

  return {
    inputRef,
    accept: rules.accept,
    maxLabel: rules.maxLabel,
    status,
    isUploading: status === "uploading",
    progress,
    error,
    previewUrl,
    pendingFile,
    dragOver,
    dragProps,
    trigger,
    handleInputChange,
    doUpload,
    retry,
    cancel,
    reset,
  };
}

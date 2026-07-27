"use client";
// src/components/auth/RegisterForm.tsx

import { useState } from "react";
import { m as motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ACADEMIC_LEVEL_LABELS, ACADEMIC_LEVELS, type AcademicLevel } from "@/types";
import {
  authFieldStyle,
  authLabelStyle,
  authAccentGradient,
  authColors,
  focusAuthField,
  blurAuthField,
} from "./authTheme";
import {
  UserIcon,
  PhoneIcon,
  LockIcon,
  LevelIcon,
  EyeIcon,
  EyeOffIcon,
  AlertIcon,
  SpinnerIcon,
} from "./AuthIcons";

export function RegisterForm() {
  const { register, isRegisterLoading } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel | "">("");
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!name.trim()) { setLocalError("أدخل اسمك الكامل"); return; }
    if (name.trim().length < 2) { setLocalError("الاسم يجب أن يكون حرفين على الأقل"); return; }
    if (!phone.trim()) { setLocalError("أدخل رقم الهاتف"); return; }
    if (!password) { setLocalError("أدخل كلمة المرور"); return; }
    if (password.length < 6) { setLocalError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (!academicLevel) { setLocalError("اختر مرحلتك الدراسية"); return; }
    register({ name: name.trim(), phone: phone.trim(), password, academicLevel });
  };

  const strength =
    password.length === 0 ? null : password.length < 6 ? "weak" : password.length < 10 ? "ok" : "strong";

  const strengthColor =
    strength === "strong" ? authColors.labGreen : strength === "ok" ? authColors.cyan : authColors.atomOrange;

  const strengthLabel =
    strength === "strong" ? "قوية" : strength === "ok" ? "مقبولة" : "ضعيفة";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <form onSubmit={handleSubmit} noValidate dir="rtl" style={{ direction: "rtl" }}>
        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="reg-name" style={authLabelStyle}>
            <UserIcon size={15} color={authColors.cyanLight} />
            الاسم الكامل
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              style={authFieldStyle}
              onFocus={(e) => focusAuthField(e.target)}
              onBlur={(e) => blurAuthField(e.target)}
            />
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(0,212,255,0.55)", display: "flex" }}>
              <UserIcon size={17} />
            </span>
          </div>
        </div>

        {/* Academic Level */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="reg-level" style={authLabelStyle}>
            <LevelIcon size={15} color={authColors.cyanLight} />
            المرحلة الدراسية
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="reg-level"
              value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
              style={{ ...authFieldStyle, cursor: "pointer", appearance: "none" }}
              onFocus={(e) => focusAuthField(e.target)}
              onBlur={(e) => blurAuthField(e.target)}
            >
              <option value="" disabled style={{ background: authColors.navyMid }}>
                اختر مرحلتك الدراسية
              </option>
              {ACADEMIC_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl} style={{ background: authColors.navyMid, color: authColors.textPrimary }}>
                  {ACADEMIC_LEVEL_LABELS[lvl]}
                </option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(0,212,255,0.55)", display: "flex" }}>
              <LevelIcon size={17} />
            </span>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 11, color: "rgba(0,212,255,0.45)" }}>
              ▼
            </span>
          </div>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="reg-phone" style={authLabelStyle}>
            <PhoneIcon size={15} color={authColors.cyanLight} />
            رقم الهاتف
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              style={authFieldStyle}
              onFocus={(e) => focusAuthField(e.target)}
              onBlur={(e) => blurAuthField(e.target)}
            />
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(0,212,255,0.55)", display: "flex" }}>
              <PhoneIcon size={17} />
            </span>
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 22 }}>
          <label htmlFor="reg-password" style={authLabelStyle}>
            <LockIcon size={15} color={authColors.cyanLight} />
            كلمة المرور
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="reg-password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل"
              style={{ ...authFieldStyle, paddingRight: 46, paddingLeft: 58 }}
              onFocus={(e) => focusAuthField(e.target)}
              onBlur={(e) => blurAuthField(e.target)}
            />
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(0,212,255,0.55)", display: "flex" }}>
              <LockIcon size={17} />
            </span>
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              aria-label={showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              style={{
                position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)",
                minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center",
                background: "none", border: "none", borderRadius: 8, cursor: "pointer",
                color: "rgba(248,250,255,0.6)",
              }}
            >
              {showPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          {/* Strength bar */}
          {strength && (
            <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 6 }}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    transition: "background 0.3s",
                    background: password.length > i * 2 ? strengthColor : "rgba(248,250,255,0.1)",
                  }}
                />
              ))}
              <span style={{ fontFamily: "Cairo,sans-serif", fontSize: 10, color: authColors.textFaint, whiteSpace: "nowrap" }}>
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        {/* Error */}
        {localError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-4 px-4 py-3 rounded-xl text-sm text-center"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.32)",
              color: "#FFB3B3", fontFamily: "Cairo,sans-serif",
            }}
          >
            <AlertIcon size={16} />
            {localError}
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isRegisterLoading}
          whileHover={!isRegisterLoading ? { y: -2 } : {}}
          whileTap={!isRegisterLoading ? { scale: 0.98 } : {}}
          style={{
            width: "100%", padding: "15px", borderRadius: 14, border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: isRegisterLoading ? "rgba(0,212,255,0.35)" : authAccentGradient,
            boxShadow: isRegisterLoading ? "none" : "0 6px 22px rgba(0,212,255,0.35)",
            color: authColors.navyDeep, fontFamily: "Cairo,sans-serif",
            fontWeight: 700, fontSize: 16,
            cursor: isRegisterLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {isRegisterLoading ? (
            <>
              <SpinnerIcon size={17} />
              جارٍ إنشاء الحساب...
            </>
          ) : (
            "إنشاء الحساب"
          )}
        </motion.button>

        <p className="text-center mt-3" style={{ fontFamily: "Cairo,sans-serif", color: authColors.textFaint, fontSize: 11, lineHeight: 1.6 }}>
          بالتسجيل تقبل شروط الاستخدام وسياسة الخصوصية
        </p>

        <p className="text-center mt-4" style={{ fontFamily: "Cairo,sans-serif", color: authColors.textMuted, fontSize: 13 }}>
          لديك حساب؟{" "}
          <Link href="/login" style={{ color: authColors.cyanLight, fontWeight: 600, textDecoration: "none" }}>
            سجّل دخولك
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

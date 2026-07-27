"use client";
// src/components/auth/LoginForm.tsx

import { useState } from "react";
import { m as motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  authFieldStyle,
  authLabelStyle,
  authAccentGradient,
  authColors,
  focusAuthField,
  blurAuthField,
  invalidAuthField,
} from "./authTheme";
import { PhoneIcon, LockIcon, EyeIcon, EyeOffIcon, AlertIcon, SpinnerIcon } from "./AuthIcons";

export function LoginForm() {
  const { login, isLoginLoading } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!phone.trim()) {
      setLocalError("أدخل رقم الهاتف");
      return;
    }

    if (!password) {
      setLocalError("أدخل كلمة المرور");
      return;
    }

    login({ phone: phone.trim(), password });
  };

  const phoneInvalid = Boolean(localError && !phone.trim());
  const passwordInvalid = Boolean(localError && !password);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
      style={{ width: "100%", maxWidth: 460, margin: "0 auto" }}
    >
      <form onSubmit={handleSubmit} noValidate dir="rtl" style={{ width: "100%", direction: "rtl" }}>
        {/* Phone field */}
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="phone" style={authLabelStyle}>
            <PhoneIcon size={15} color={authColors.cyanLight} />
            رقم الهاتف
          </label>

          <div style={{ position: "relative", width: "100%" }}>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              aria-invalid={phoneInvalid}
              aria-describedby={localError ? "login-error" : undefined}
              style={authFieldStyle}
              onFocus={(e) => (phoneInvalid ? invalidAuthField(e.target) : focusAuthField(e.target))}
              onBlur={(e) => blurAuthField(e.target)}
            />
            <span
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "rgba(0,212,255,0.55)",
                display: "flex",
              }}
            >
              <PhoneIcon size={17} />
            </span>
          </div>
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 22 }}>
          <label htmlFor="password" style={authLabelStyle}>
            <LockIcon size={15} color={authColors.cyanLight} />
            كلمة المرور
          </label>

          <div style={{ position: "relative", width: "100%" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={passwordInvalid}
              aria-describedby={localError ? "login-error" : undefined}
              style={{ ...authFieldStyle, paddingRight: 46, paddingLeft: 62 }}
              onFocus={(e) => (passwordInvalid ? invalidAuthField(e.target) : focusAuthField(e.target))}
              onBlur={(e) => blurAuthField(e.target)}
            />

            <span
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "rgba(0,212,255,0.55)",
                display: "flex",
              }}
            >
              <LockIcon size={17} />
            </span>

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              style={{
                position: "absolute",
                left: 6,
                top: "50%",
                transform: "translateY(-50%)",
                minWidth: 40,
                minHeight: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                color: "rgba(248,250,255,0.6)",
              }}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {localError && (
          <motion.div
            id="login-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }}
            transition={{ x: { duration: 0.4 } }}
            role="alert"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: 16,
              padding: "11px 14px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "rgba(255,107,107,0.12)",
              border: "1px solid rgba(255,107,107,0.32)",
              color: "#FFB3B3",
              fontFamily: "Cairo, sans-serif",
              fontSize: "clamp(12px, 3.5vw, 14px)",
            }}
          >
            <AlertIcon size={16} />
            {localError}
          </motion.div>
        )}

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isLoginLoading}
          whileHover={!isLoginLoading ? { y: -2 } : {}}
          whileTap={!isLoginLoading ? { scale: 0.98 } : {}}
          style={{
            width: "100%",
            minHeight: 54,
            boxSizing: "border-box",
            padding: "14px 16px",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: isLoginLoading ? "rgba(0,212,255,0.35)" : authAccentGradient,
            boxShadow: isLoginLoading ? "none" : "0 6px 22px rgba(0,212,255,0.35)",
            color: authColors.navyDeep,
            fontFamily: "Cairo, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 4vw, 16px)",
            border: "none",
            cursor: isLoginLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {isLoginLoading ? (
            <>
              <SpinnerIcon size={17} />
              جارٍ تسجيل الدخول...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </motion.button>

        {/* Footer link */}
        <p
          className="text-center"
          style={{
            marginTop: 20,
            paddingInline: 8,
            fontFamily: "Cairo, sans-serif",
            color: authColors.textMuted,
            fontSize: "clamp(12px, 3.5vw, 13px)",
            lineHeight: 1.8,
          }}
        >
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            style={{
              color: authColors.cyanLight,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            أنشئ حساباً الآن
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

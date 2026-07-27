"use client";
// src/app/(auth)/login/page.tsx

import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageShell title="أكاديمية مستر مصطفى" subtitle="تسجيل الدخول إلى حسابك" maxWidth={460}>
      <LoginForm />
    </AuthPageShell>
  );
}

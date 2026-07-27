"use client";
// src/app/(auth)/register/page.tsx

import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthPageShell title="انضم إلى الأكاديمية" subtitle="أنشئ حسابك وابدأ رحلة التعلم في الكيمياء" maxWidth={500}>
      <RegisterForm />
    </AuthPageShell>
  );
}

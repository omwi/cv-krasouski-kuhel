import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm"

import "@/features/auth/style/auth.css"

export default function ForgotPassword() {
  return (
    <section className="auth-container flex h-dvh w-full items-center justify-center">
      <ForgotPasswordForm />
    </section>
  )
}

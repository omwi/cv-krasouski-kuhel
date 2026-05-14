import AuthHeader from "@/features/auth/components/AuthHeader"

import "@/features/auth/style/auth.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthHeader />
      <section className="auth-container flex h-dvh w-full items-center justify-center">
        {children}
      </section>
    </>
  )
}

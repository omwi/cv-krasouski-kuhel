import "@/features/auth/style/auth.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="auth-container flex h-dvh w-full items-center justify-center">
      {children}
    </section>
  )
}

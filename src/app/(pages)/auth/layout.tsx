import TabHeader, { HeaderLink } from "@/components/layout/tab-header"

import "@/features/auth/style/auth.css"

import { paths } from "@/config/paths"

const LINKS: HeaderLink[] = [
  { href: paths.auth.login.get(), i18nKey: "header.login" },
  { href: paths.auth.signup.get(), i18nKey: "header.signup" },
]
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TabHeader i18nNamespace="auth" links={LINKS} />
      <section className="auth-container flex h-dvh w-full items-center justify-center">
        {children}
      </section>
    </>
  )
}

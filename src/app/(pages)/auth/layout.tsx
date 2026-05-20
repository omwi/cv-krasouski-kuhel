import TabNav, { TabLink } from "@/components/layout/tab-nav"

import "@/features/auth/style/auth.css"

import { paths } from "@/config/paths"

const LINKS: TabLink[] = [
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
      <header>
        <TabNav i18nNamespace="auth" links={LINKS} className="justify-center" />
      </header>

      <section className="auth-container flex h-dvh w-full items-center justify-center">
        {children}
      </section>
    </>
  )
}

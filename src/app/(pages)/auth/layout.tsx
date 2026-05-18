import TabHeader from "@/components/layout/TabHeader"

import "@/features/auth/style/auth.css"

import { paths } from "@/config/paths"
import { HeaderLink } from "@/types/tab-header"

const LINKS: HeaderLink[] = [
  { href: paths.auth.login.get(), labelKey: "header.login" },
  { href: paths.auth.signup.get(), labelKey: "header.signup" },
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

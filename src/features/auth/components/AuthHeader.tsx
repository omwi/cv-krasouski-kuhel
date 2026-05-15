"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useT } from "next-i18next/client"

export default function AuthHeader() {
  const { t } = useT("auth")
  const pathname = usePathname()

  return (
    <header>
      <nav className="fixed top-0 left-0 flex w-full flex-row items-center justify-center">
        <Link
          href="/auth/login"
          className={`relative block min-w-35 px-4 py-3 text-center uppercase ${pathname === "/auth/login" ? "active text-primary" : ""}`}
        >
          {t("header.login")}
        </Link>
        <Link
          href="/auth/signup"
          className={`relative block min-w-35 px-4 py-3 text-center uppercase ${pathname === "/auth/signup" ? "active text-primary" : ""}`}
        >
          {t("header.signup")}
        </Link>
      </nav>
    </header>
  )
}

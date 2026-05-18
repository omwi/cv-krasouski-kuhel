"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useT } from "next-i18next/client"

import ActiveIndicator from "@/components/layout/ActiveIndicator"
import { paths } from "@/config/paths"
import { TabHeaderProps } from "@/types/tab-header"

export default function TabHeader({ i18nNamespace, links }: TabHeaderProps) {
  const { t } = useT(i18nNamespace)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  if (pathname === paths.auth.forgotPassword.get().split("?")[0]) {
    return null
  }
  return (
    <header className="fixed top-0 left-0 w-full">
      <nav
        ref={navRef}
        className="relative flex flex-row items-center justify-center"
      >
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              linkRefs.current[index] = el
            }}
            className="relative block min-w-35 px-4 py-3 text-center uppercase"
          >
            {t(link.labelKey)}
          </Link>
        ))}

        <ActiveIndicator links={links} linkRefs={linkRefs} navRef={navRef} />
      </nav>
    </header>
  )
}

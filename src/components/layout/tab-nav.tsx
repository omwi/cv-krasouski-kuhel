"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useT } from "next-i18next/client"

import ActiveIndicator from "@/components/layout/active-indicator"
import { paths } from "@/config/paths"
import { useActiveIndicator } from "@/hooks/use-active-indicator"
import { cn } from "@/lib/utils"

export type TabLink = {
  href: string
  i18nKey: string
}

type TabHeaderProps = {
  i18nNamespace: string
  links: TabLink[]
  className?: string
}

export default function TabNav({
  i18nNamespace,
  links,
  className,
}: TabHeaderProps) {
  const { t } = useT(i18nNamespace)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const { activeIndex, indicatorStyle } = useActiveIndicator(
    links,
    navRef,
    linkRefs
  )

  if (pathname === paths.auth.forgotPassword.get().split("?")[0]) {
    return null
  }

  return (
    <nav
      ref={navRef}
      className={cn("relative flex flex-row items-center", className)}
    >
      {links.map((link, index) => {
        const isActive = activeIndex === index
        return (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              linkRefs.current[index] = el
            }}
            className={cn(
              "relative block min-w-35 px-4 py-3 text-center uppercase transition-colors",
              isActive && "active text-primary"
            )}
          >
            {t(link.i18nKey)}
          </Link>
        )
      })}

      <ActiveIndicator style={indicatorStyle} />
    </nav>
  )
}

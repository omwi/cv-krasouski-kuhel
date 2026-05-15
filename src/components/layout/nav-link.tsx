"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { isEqualPath } from "@/utils/url"

type Props = {
  to: string
  text: string
  icon: React.JSX.Element
  isDesktopOnly?: boolean
  className?: string
}

export default function NavLink({
  text,
  to,
  icon,
  isDesktopOnly = false,
  className,
}: Props) {
  const path = usePathname()
  const isActive = isEqualPath(path, to)

  return (
    <Link
      href={to}
      className={cn(
        className,
        "flex flex-row items-center gap-4 text-foreground/70",
        "my-auto h-10 flex-1 justify-center rounded-[200px] px-2 py-1",
        "md:h-14 md:flex-none md:justify-start md:rounded-l-none md:px-4 md:py-2",
        "hover:bg-nav-hover hover:text-foreground active:bg-nav-hover active:text-foreground",
        "transition duration-300 ease-in-out",
        {
          "bg-nav-hover text-foreground": isActive,
          "hidden md:flex": isDesktopOnly,
        }
      )}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </Link>
  )
}

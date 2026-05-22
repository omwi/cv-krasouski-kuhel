"use client"

import { useState } from "react"
import {
  ChevronLeft,
  FileUser,
  Languages,
  TrendingUp,
  Users,
} from "lucide-react"
import { useT } from "next-i18next/client"

import { paths } from "@/config/paths"
import { cn } from "@/lib/utils"

import IconButton from "../../shared/icon-button"
import ActionsPopover from "./actions-popover"
import NavAvatar from "./nav-avatar"
import NavLink from "./nav-link"

type NavLink = {
  i18: string
  to: string
  icon: React.JSX.Element
  isDesktopOnly?: boolean
}
const navLinks: readonly NavLink[] = [
  {
    i18: "employees",
    to: paths.users.get(),
    icon: <Users className="shrink-0" />,
  },
  {
    i18: "skills",
    to: paths.skills.get(),
    icon: <TrendingUp className="shrink-0" />,
  },
  {
    i18: "languages",
    to: paths.languages.get(),
    icon: <Languages className="shrink-0" />,
  },
  {
    i18: "cvs",
    to: paths.cvs.get(),
    icon: <FileUser className="shrink-0" />,
    isDesktopOnly: true,
  },
] as const

export default function SideNav() {
  const { t } = useT("nav")

  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleSidebar = () => setIsCollapsed((prev) => !prev)

  return (
    <aside
      className={cn(
        "flex flex-shrink-0 flex-row overflow-x-hidden",
        "h-14 gap-3.5 px-4",
        "md:h-full md:flex-col md:justify-between md:overflow-y-auto md:px-0 md:pt-11 md:pb-4",
        "transition-discrete duration-300",
        isCollapsed ? "md:w-14" : "md:w-50"
      )}
    >
      <nav className={cn("flex w-3/4 flex-row gap-3.5 md:w-full md:flex-col")}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            text={t(link.i18)}
            to={link.to}
            icon={link.icon}
            isDesktopOnly={link?.isDesktopOnly}
          />
        ))}
      </nav>
      <div className="flex w-1/4 flex-col md:w-full">
        <ActionsPopover>
          <NavAvatar />
        </ActionsPopover>
        <IconButton
          onClick={toggleSidebar}
          className="mt-3 ml-2 hidden size-10 self-start p-2 md:flex md:justify-center"
        >
          <ChevronLeft
            className={cn(
              "transition duration-200 ease-in-out",
              isCollapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </IconButton>
      </div>
    </aside>
  )
}

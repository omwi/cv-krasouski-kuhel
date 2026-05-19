"use client"

import { useState } from "react"
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined"
import GroupIcon from "@mui/icons-material/Group"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import TranslateIcon from "@mui/icons-material/Translate"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import { useT } from "next-i18next/client"

import { paths } from "@/config/paths"
import { cn } from "@/lib/utils"

import IconButton from "../shared/icon-button"
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
    icon: <GroupIcon />,
  },
  {
    i18: "skills",
    to: paths.skills.get(),
    icon: <TrendingUpIcon />,
  },
  {
    i18: "languages",
    to: paths.languages.get(),
    icon: <TranslateIcon />,
  },
  {
    i18: "cvs",
    to: paths.cvs.get(),
    icon: <ContactPageOutlinedIcon />,
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
        "flex flex-row overflow-x-hidden",
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
          <KeyboardArrowLeftIcon
            sx={{
              transition: "transform 0.2s ease-in-out",
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </div>
    </aside>
  )
}

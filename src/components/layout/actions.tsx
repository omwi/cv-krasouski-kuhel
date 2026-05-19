import { useReactiveVar } from "@apollo/client/react"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SettingsIcon from "@mui/icons-material/Settings"
import { useT } from "next-i18next/client"

import { paths } from "@/config/paths"
import { authUserVar } from "@/lib/apollo/auth-var"

import { Separator } from "../ui/separator"
import ActionLink from "./action-link"
import LogoutButton from "./logout-button"

export default function Actions() {
  const { t } = useT("nav")
  const user = useReactiveVar(authUserVar)

  const userId = parseInt(user?.id ?? "0")

  return (
    <div className="flex flex-col gap-2 py-2">
      <nav className="flex flex-col">
        <ActionLink to={paths.users.profile.get(userId)}>
          <AccountCircleIcon />
          {t("profile")}
        </ActionLink>
        <ActionLink to={paths.settings.get()}>
          <SettingsIcon />
          {t("settings")}
        </ActionLink>
      </nav>

      <Separator />

      <LogoutButton />
    </div>
  )
}

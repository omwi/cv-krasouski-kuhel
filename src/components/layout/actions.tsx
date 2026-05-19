import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SettingsIcon from "@mui/icons-material/Settings"
import { useT } from "next-i18next/client"

import { paths } from "@/config/paths"

import { Separator } from "../ui/separator"
import ActionLink from "./action-link"
import LogoutButton from "./logout-button"

const user = {
  id: 1,
}

export default function Actions() {
  const { id } = user

  const { t } = useT("nav")

  return (
    <div className="flex flex-col gap-2 py-2">
      <nav className="flex flex-col">
        <ActionLink to={paths.users.profile.get(id)}>
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

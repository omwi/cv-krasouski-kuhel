import { CircleUser, Settings } from "lucide-react"
import { useT } from "next-i18next/client"

import ActionLink from "@/components/layout/sidebar/action-link"
import LogoutButton from "@/components/layout/sidebar/logout-button"
import { Separator } from "@/components/ui/separator"
import { paths } from "@/config/paths"
import { useAuthContext } from "@/features/auth/components/auth-provider"

export default function Actions() {
  const { t } = useT("nav")
  const { userId } = useAuthContext()

  if (!userId) return null

  return (
    <div className="flex flex-col gap-2 py-2">
      <nav className="flex flex-col">
        <ActionLink to={paths.users.details.get(parseInt(userId))}>
          <CircleUser />
          {t("profile")}
        </ActionLink>
        <ActionLink to={paths.settings.get()}>
          <Settings />
          {t("settings")}
        </ActionLink>
      </nav>

      <Separator />

      <LogoutButton />
    </div>
  )
}

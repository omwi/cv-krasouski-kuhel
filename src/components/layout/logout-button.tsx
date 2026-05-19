import { LogOut } from "lucide-react"
import { useT } from "next-i18next/client"

import { useLogout } from "@/features/auth/hooks/use-logout"

import { Button } from "../ui/button"

export default function LogoutButton() {
  const { t } = useT("nav")

  const { logout } = useLogout()

  return (
    <Button
      onClick={logout}
      variant={"ghost"}
      className="h-fit min-w-0 justify-start gap-2 rounded-none border-none px-4 py-1.5 font-normal text-foreground"
    >
      <LogOut className="size-6" />
      {t("logout")}
    </Button>
  )
}

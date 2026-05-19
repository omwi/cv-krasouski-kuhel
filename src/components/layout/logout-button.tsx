import LogoutIcon from "@mui/icons-material/Logout"
import { useT } from "next-i18next/client"

import { Button } from "../ui/button"

export default function LogoutButton() {
  const { t } = useT("nav")

  const handleClick = () => {
    // todo: logout
  }

  return (
    <Button
      onClick={handleClick}
      variant={"ghost"}
      className="h-fit min-w-0 justify-start gap-2 rounded-none border-none px-4 py-1.5 font-normal text-foreground"
    >
      <LogoutIcon />
      {t("logout")}
    </Button>
  )
}

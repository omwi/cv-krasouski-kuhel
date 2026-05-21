import { useRouter } from "next/navigation"
import { ChevronRight, MoreVertical } from "lucide-react"
import { useT } from "next-i18next/client"

import type { CurrentUser } from "@/app/(pages)/(main)/users/page"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { paths } from "@/config/paths"
import { TableUser } from "@/features/users/components/users-table"

export function UserRowActions({
  rowUser,
  currentUser,
}: {
  rowUser: TableUser
  currentUser: CurrentUser
}) {
  const router = useRouter()
  const { t } = useT("user-table")

  if (!currentUser) return null

  const isMe = currentUser.id === rowUser.id
  const isAdmin = currentUser.role?.toLowerCase() === "admin"
  const isEmployee = currentUser.role?.toLowerCase() === "employee"

  if (isAdmin || isMe) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 min-w-0 p-0"
            aria-label={t("control-actions.aria-label")}
          >
            <MoreVertical className="h-4 w-4 text-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          hideWhenDetached
          className="mx-4 w-50 rounded-xs p-0 shadow-lg"
        >
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className="min-w-0 justify-start rounded-none text-foreground"
              onClick={() => {
                router.push(paths.users.details.get(Number(rowUser.id)))
              }}
            >
              {t("control-actions.profile")}
            </Button>
            <Button
              variant="ghost"
              className="min-w-0 justify-start rounded-none text-foreground"
              onClick={() => console.log("Edit user", rowUser.id)}
            >
              {t("control-actions.update-user")}
            </Button>
            <Button
              variant="ghost"
              className="min-w-0 justify-start rounded-none text-foreground"
              onClick={() => console.log("Delete", rowUser.id)}
              disabled={isMe}
            >
              {t("control-actions.delete-user")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  if (isEmployee && !isMe) {
    return (
      <Button
        variant="ghost"
        className="h-9 w-9 min-w-0"
        onClick={() => {
          router.push(paths.users.details.get(Number(rowUser.id)))
        }}
        aria-label={t("open-profile-aria-label", {
          name: rowUser.profile?.full_name || "user",
        })}
      >
        <ChevronRight />
      </Button>
    )
  }

  return null
}

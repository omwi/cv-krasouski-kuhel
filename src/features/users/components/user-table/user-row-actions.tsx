import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, MoreVertical } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { paths } from "@/config/paths"
import DeleteUser from "@/features/users/components/actions/delete-user"
import UpdateUser from "@/features/users/components/actions/update-user"
import { TableUser } from "@/features/users/components/user-table/users-table"
import type { CurrentUser } from "@/utils/permissions"

export function UserRowActions({
  rowUser,
  currentUser,
}: {
  rowUser: TableUser
  currentUser: CurrentUser
}) {
  const router = useRouter()
  const { t } = useT("table")

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!currentUser) return null

  const isMe = currentUser.id === rowUser.id
  const isAdmin = currentUser.role?.toLowerCase() === "admin"
  const isEmployee = currentUser.role?.toLowerCase() === "employee"

  if (isAdmin || isMe) {
    return (
      <>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 min-w-0 p-0"
              aria-label={t("user-table.control-actions.aria-label")}
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
                  setPopoverOpen(false)
                  router.push(paths.users.details.get(Number(rowUser.id)))
                }}
              >
                {t("user-table.control-actions.profile")}
              </Button>
              <Button
                variant="ghost"
                className="min-w-0 justify-start rounded-none text-foreground"
                onClick={() => {
                  setPopoverOpen(false)
                  setEditOpen(true)
                }}
              >
                {t("user-table.control-actions.update-user")}
              </Button>
              <Button
                variant="ghost"
                className="w-full min-w-0 justify-start rounded-none text-foreground"
                disabled={isMe}
                onClick={() => {
                  setPopoverOpen(false)
                  setDeleteOpen(true)
                }}
              >
                {t("user-table.control-actions.delete-user")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {editOpen && (
          <UpdateUser
            user={rowUser}
            currentUser={currentUser}
            open={editOpen}
            onOpenChangeAction={setEditOpen}
          />
        )}

        {deleteOpen && (
          <DeleteUser
            user={rowUser}
            open={deleteOpen}
            onOpenChangeAction={setDeleteOpen}
          />
        )}
      </>
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
        aria-label={t("user-table.open-profile-aria-label", {
          name: rowUser.profile?.full_name || "user",
        })}
      >
        <ChevronRight />
      </Button>
    )
  }

  return null
}

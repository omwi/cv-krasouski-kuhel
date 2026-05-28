import { Plus, Trash } from "lucide-react"
import { useT } from "next-i18next/client"

import { useSelection } from "@/components/shared/selection-provider"
import { Button } from "@/components/ui/button"
import UserLanguageAddDialog from "@/features/users/components/languages/user-language-add-dialog"
import { useUserLanguagesDelete } from "@/features/users/hooks/use-user-languages-delete"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"

export default function UserLanguagesActions({
  userId,
  hasLanguages,
}: {
  userId: string
  hasLanguages: boolean
}) {
  const { t } = useT("buttons")

  const { canUpdateUser } = usePermissions()
  const hasPermissions = canUpdateUser(userId)

  const { isSelecting, hasSelection, selectedCount } = useSelection()

  const { handleStartDelete, handleCancelDelete, handleConfirmDelete } =
    useUserLanguagesDelete(userId)

  return (
    <div
      className={cn(
        "flex flex-row justify-between gap-4 sm:justify-end",
        !hasPermissions && "hidden"
      )}
    >
      {!isSelecting ? (
        <>
          <UserLanguageAddDialog userId={userId}>
            <Button
              variant={"ghost"}
              disabled={!hasPermissions}
              className="gap-4"
            >
              <Plus className="size-6" />
              <span>{t("add-language")}</span>
            </Button>
          </UserLanguageAddDialog>

          {hasLanguages && (
            <Button
              variant={"ghost-primary"}
              disabled={!hasPermissions || !hasLanguages}
              className="gap-4"
              onClick={handleStartDelete}
            >
              <Trash className="size-6" />
              <span>{t("remove-language")}</span>
            </Button>
          )}
        </>
      ) : (
        <>
          <Button variant={"outline"} onClick={handleCancelDelete}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={!hasSelection}
            className="flex flex-row gap-4"
          >
            <span>{t("delete")}</span>
            {hasSelection && (
              <div className="flex size-6 items-center justify-center rounded-full bg-primary-foreground text-primary">
                {selectedCount}
              </div>
            )}
          </Button>
        </>
      )}
    </div>
  )
}

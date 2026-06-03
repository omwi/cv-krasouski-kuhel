import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import SelectForDeletionButton from "@/components/shared/selection/select-for-deletion-button"
import SelectionButtons from "@/components/shared/selection/selection-buttons"
import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import UserLanguageAddDialog from "@/features/users/components/languages/user-language-add-dialog"
import { useUserLanguagesDelete } from "@/features/users/hooks/languages/use-user-languages-delete"
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

  const { isSelecting } = useSelection()

  const { handleStartDelete, handleCancelDelete, handleConfirmDelete } =
    useUserLanguagesDelete(userId)

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap justify-between gap-4 sm:justify-end",
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

          <SelectForDeletionButton
            label={t("remove-language")}
            onClick={handleStartDelete}
            disabled={!hasPermissions || !hasLanguages}
            hidden={!hasLanguages}
          />
        </>
      ) : (
        <SelectionButtons
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  )
}

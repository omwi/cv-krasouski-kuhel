import { Plus, Trash } from "lucide-react"
import { useT } from "next-i18next/client"

import { useSelection } from "@/components/shared/selection-provider"
import { Button } from "@/components/ui/button"
import UserSkillAddDialog from "@/features/users/components/skills/user-skill-add-dialog"
import { useUserSkillsDelete } from "@/features/users/hooks/use-user-skills-delete"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"

export default function UserSkillsActions({
  userId,
  hasSkills,
}: {
  userId: string
  hasSkills: boolean
}) {
  const { t } = useT("buttons")

  const { canUpdateUser } = usePermissions()
  const hasPermissions = canUpdateUser(userId)

  const { isSelecting, hasSelection, selectedCount } = useSelection()

  const { handleStartDelete, handleCancelDelete, handleConfirmDelete } =
    useUserSkillsDelete(userId)

  return (
    <div
      className={cn(
        "flex flex-row justify-between gap-4 sm:justify-end",
        !hasPermissions && "hidden"
      )}
    >
      {!isSelecting ? (
        <>
          <UserSkillAddDialog userId={userId}>
            <Button
              variant={"ghost"}
              disabled={!hasPermissions}
              className="gap-4"
            >
              <Plus className="size-6" />
              <span>{t("add-skill")}</span>
            </Button>
          </UserSkillAddDialog>

          {hasSkills && (
            <Button
              variant={"ghost-primary"}
              disabled={!hasPermissions || !hasSkills}
              className="gap-4"
              onClick={handleStartDelete}
            >
              <Trash className="size-6" />
              <span>{t("remove-skills")}</span>
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

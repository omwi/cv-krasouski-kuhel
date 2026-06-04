import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import SelectForDeletionButton from "@/components/shared/selection/select-for-deletion-button"
import SelectionButtons from "@/components/shared/selection/selection-buttons"
import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import UserSkillAddDialog from "@/features/users/components/skills/user-skill-add-dialog"
import { useUserSkillsDelete } from "@/features/users/hooks/skills/use-user-skills-delete"
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

  const { isSelecting } = useSelection()

  const { handleStartDelete, handleCancelDelete, handleConfirmDelete } =
    useUserSkillsDelete(userId)

  return (
    <div
      data-testid="user-skills-actions"
      className={cn(
        "flex flex-row flex-wrap justify-between gap-4 sm:justify-end",
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

          <SelectForDeletionButton
            label={t("remove-skills")}
            onClick={handleStartDelete}
            disabled={!hasPermissions || !hasSkills}
            hidden={!hasSkills}
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

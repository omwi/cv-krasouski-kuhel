import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import SelectForDeletionButton from "@/components/shared/selection/select-for-deletion-button"
import SelectionButtons from "@/components/shared/selection/selection-buttons"
import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import CvSkillAddDialog from "@/features/cvs/components/skills/cv-skill-add-dialog"
import { useCvSkillsDelete } from "@/features/cvs/hooks/use-cv-skill-delete"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"
import { CvUserId } from "@/types/graphql-types"

export default function CvSkillsActions({
  cvUserId,
  hasSkills,
}: {
  cvUserId: CvUserId
  hasSkills: boolean
}) {
  const { t } = useT("buttons")

  const { canUpdateCv } = usePermissions()
  const hasPermissions = canUpdateCv(cvUserId.user?.id)

  const { isSelecting } = useSelection()

  const { handleStartDelete, handleCancelDelete, handleConfirmDelete } =
    useCvSkillsDelete(cvUserId)

  return (
    <div
      className={cn(
        "flex flex-row justify-between gap-4 sm:justify-end",
        !hasPermissions && "hidden"
      )}
    >
      {!isSelecting ? (
        <>
          <CvSkillAddDialog cvUserId={cvUserId}>
            <Button
              variant={"ghost"}
              disabled={!hasPermissions}
              className="gap-4"
            >
              <Plus className="size-6" />
              <span>{t("add-skill")}</span>
            </Button>
          </CvSkillAddDialog>

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

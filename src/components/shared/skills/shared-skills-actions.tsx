import { ReactNode } from "react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import SelectForDeletionButton from "@/components/shared/selection/select-for-deletion-button"
import SelectionButtons from "@/components/shared/selection/selection-buttons"
import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  hasSkills: boolean
  hasPermissions: boolean
  handleStartDelete: () => void
  handleCancelDelete: () => void
  handleConfirmDelete: () => Promise<void>
  renderAddDialog: (children: ReactNode) => ReactNode
}

export default function SharedSkillsActions({
  hasSkills,
  hasPermissions,
  handleStartDelete,
  handleCancelDelete,
  handleConfirmDelete,
  renderAddDialog,
}: Props) {
  const { t } = useT("buttons")
  const { isSelecting } = useSelection()

  return (
    <div
      data-testid="user-skills-actions"
      className={cn(
        "flex flex-row justify-between gap-4 sm:justify-end",
        !hasPermissions && "hidden"
      )}
    >
      {!isSelecting ? (
        <>
          {renderAddDialog(
            <Button
              variant={"ghost"}
              disabled={!hasPermissions}
              className="gap-4"
            >
              <Plus className="size-6" />
              <span>{t("add-skill")}</span>
            </Button>
          )}

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

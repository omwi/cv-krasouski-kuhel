"use client"

import { useT } from "next-i18next/client"

import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"

type Props = {
  handleCancelDelete: () => void
  handleConfirmDelete: () => Promise<void>
}

export default function SelectionButtons({
  handleCancelDelete,
  handleConfirmDelete,
}: Props) {
  const { t } = useT("buttons")

  const { hasSelection, selectedCount } = useSelection()

  return (
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
  )
}

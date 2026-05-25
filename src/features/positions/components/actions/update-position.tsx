import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { EntityNameFormDialog } from "@/components/shared/form/entity-name-form-dialog"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { useUpdatePositionForm } from "@/features/positions/hooks/use-update-position-form"

type Props = {
  position: TablePosition
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdatePosition({
  position,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["position-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const { form, onSubmit, loading } = useUpdatePositionForm(
    position,
    open,
    setOpen
  )

  const {
    formState: { isSubmitting, isDirty, isValid },
  } = form

  return (
    <EntityNameFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("update.title", { ns: "position-actions" })}
      submitLabel={t("update", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid || !isDirty}
      form={form}
    />
  )
}

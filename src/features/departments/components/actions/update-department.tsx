import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { EntityNameFormDialog } from "@/components/shared/form/entity-name-form-dialog"
import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import { useUpdateDepartmentForm } from "@/features/departments/hooks/use-update-department-form"

export type Props = {
  department: TableDepartment
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdateDepartment({
  department,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["department-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const { form, onSubmit, loading } = useUpdateDepartmentForm(
    department,
    open,
    t,
    () => setOpen(false)
  )

  const {
    formState: { isSubmitting, isDirty, isValid },
  } = form

  return (
    <EntityNameFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("update.title", { ns: "department-actions" })}
      submitLabel={t("update", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid || !isDirty}
      form={form}
    />
  )
}

import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { EntityNameFormDialog } from "@/components/shared/form/entity-name-form-dialog"
import { useCreateDepartmentForm } from "@/features/departments/hooks/use-create-department-form"

export type CreateDepartmentProps = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateDepartment({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateDepartmentProps) {
  const { t } = useT(["department-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { form, onSubmit, loading } = useCreateDepartmentForm(t, () =>
    setOpen(false)
  )

  const {
    formState: { isSubmitting, isValid },
  } = form

  return (
    <EntityNameFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("create.title", { ns: "department-actions" })}
      submitLabel={t("create", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid}
      form={form}
    />
  )
}

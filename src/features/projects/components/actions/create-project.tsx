import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { ProjectFormDialog } from "@/components/shared/form/project-form-dialog"
import { useCreateProjectForm } from "@/features/projects/hooks/use-create-project-form"

export type Props = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateProject({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["project-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const { form, onSubmit, loading } = useCreateProjectForm(t, () =>
    setOpen(false)
  )

  const {
    formState: { isSubmitting, isValid },
  } = form

  return (
    <ProjectFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("create.title", { ns: "project-actions" })}
      submitLabel={t("create", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid}
      form={form}
    />
  )
}

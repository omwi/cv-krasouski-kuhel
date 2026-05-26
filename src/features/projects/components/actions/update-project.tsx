import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { ProjectFormDialog } from "@/components/shared/form/project-form-dialog"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import { useUpdateProjectForm } from "@/features/projects/hooks/use-update-project-form"

type Props = {
  project: TableProjects
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdateProject({
  project,
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

  const { form, onSubmit, loading } = useUpdateProjectForm(t, project, () =>
    setOpen(false)
  )

  const {
    formState: { isSubmitting, isDirty, isValid },
  } = form

  return (
    <ProjectFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("update.title", { ns: "project-actions" })}
      submitLabel={t("update", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid || !isDirty}
      form={form}
    />
  )
}

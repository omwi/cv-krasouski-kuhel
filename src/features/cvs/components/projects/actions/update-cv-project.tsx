import { useState } from "react"
import { useT } from "next-i18next/client"

import CvProjectFormDialog from "@/features/cvs/components/projects/actions/cv-project-form-dialog"
import { useUpdateCvProject } from "@/features/cvs/hooks/projects/use-update-cv-project"
import { CvProject, CvUserId } from "@/types/graphql-types"

type Props = {
  cvProject: CvProject
  cvUserId: CvUserId
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdateCvProject({
  cvProject,
  cvUserId,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["cv-project-actions", "buttons"])

  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { form, onSubmit, isSubmitReady, selectedProject } = useUpdateCvProject(
    cvProject,
    cvUserId,
    { open, setOpen }
  )

  return (
    <CvProjectFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("update.title")}
      submitLabel={t("update", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitReady={isSubmitReady}
      form={form}
      selectedProject={selectedProject}
      cvId={cvUserId.id}
      isUpdate={true}
    />
  )
}

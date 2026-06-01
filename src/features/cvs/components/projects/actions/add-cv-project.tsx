import { useT } from "next-i18next/client"

import CvProjectFormDialog from "@/features/cvs/components/projects/actions/cv-project-form-dialog"
import { useAddCvProject } from "@/features/cvs/hooks/projects/use-add-cv-project"
import { CvUserId } from "@/types/graphql-types"

export type Props = {
  children?: React.ReactNode
  cvUserId: CvUserId
}

export default function AddCvProject({ children, cvUserId }: Props) {
  const { t } = useT(["cv-project-actions", "buttons"])

  const { form, onSubmit, isSubmitReady, selectedProject, open, setOpen } =
    useAddCvProject(cvUserId)

  return (
    <CvProjectFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("create.title")}
      submitLabel={t("add", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitReady={isSubmitReady}
      form={form}
      selectedProject={selectedProject}
      cvId={cvUserId.id}
    />
  )
}

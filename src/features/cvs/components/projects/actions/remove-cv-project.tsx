import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { useRemoveCvProject } from "@/features/cvs/hooks/projects/use-remove-cv-project"
import { CvProject, CvUserId } from "@/types/graphql-types"

export default function RemoveCvProject({
  cvProject,
  cvUserId,
  open,
  onOpenChange,
}: {
  cvProject: CvProject
  cvUserId: CvUserId
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { handleDelete } = useRemoveCvProject(cvProject, cvUserId)

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="cv-project-actions"
      entityName={cvProject.name}
      onConfirm={handleDelete}
    />
  )
}

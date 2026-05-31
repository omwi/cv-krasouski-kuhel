import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { useDeleteCv } from "@/features/cvs/hooks/use-delete-cv"
import { Cv } from "@/types/graphql-types"

export default function DeleteCv({
  cv,
  open,
  onOpenChange,
}: {
  cv: Cv
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { handleDelete } = useDeleteCv(cv)

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="cv-actions"
      entityName={cv.name}
      onConfirm={handleDelete}
    />
  )
}

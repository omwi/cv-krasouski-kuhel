import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { DELETE_CV } from "@/graphql/cvs/mutations"
import { GET_CVS } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"
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
  const [deleteCv] = useMutation(DELETE_CV, {
    refetchQueries: [{ query: GET_CVS }],
  })

  const { canDeleteCv } = usePermissions()

  const handleDelete = async () => {
    if (!canDeleteCv(cv.user?.id)) return
    await deleteCv({ variables: { cv: { cvId: cv.id } } })
  }

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

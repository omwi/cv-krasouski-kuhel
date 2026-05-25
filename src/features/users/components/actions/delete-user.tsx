"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TableUser } from "@/features/users/components/user-table/users-table"
import { DELETE_USER } from "@/graphql/users/mutations"
import { GET_USERS_LIST } from "@/graphql/users/queries"

type Props = {
  user: TableUser
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DeleteUser({
  user,
  open = false,
  onOpenChange = () => {},
}: Props) {
  const [mutateDelete] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS_LIST }],
  })

  const firstName = user.profile?.first_name || ""
  const lastName = user.profile?.last_name || ""
  const fullName = `${firstName} ${lastName}`.trim()
  const displayName = fullName || user.email || ""

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="user-actions"
      entityName={displayName}
      onConfirm={async () => {
        await mutateDelete({
          variables: { userId: String(user.id) },
        })
      }}
    />
  )
}

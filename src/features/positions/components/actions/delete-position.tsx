"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/delete-dialog"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { DELETE_POSITION } from "@/graphql/positions/mutations"
import { GET_POSITIONS } from "@/graphql/positions/queries"

type Props = {
  position: TablePosition
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DeletePosition({
  position,
  open = false,
  onOpenChange = () => {},
}: Props) {
  const [mutateDelete] = useMutation(DELETE_POSITION, {
    refetchQueries: [{ query: GET_POSITIONS }],
  })

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="position"
      entityName={position.name}
      onConfirm={async () => {
        await mutateDelete({
          variables: { position: { positionId: String(position.id) } },
        })
      }}
    />
  )
}

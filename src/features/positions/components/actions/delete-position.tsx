"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { DELETE_POSITION } from "@/graphql/positions/mutations"

type Props = {
  position: TablePosition
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeletePosition({
  position,
  open,
  onOpenChange,
}: Props) {
  const [mutateDelete] = useMutation(DELETE_POSITION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: "Position", id: position.id }),
      })
      cache.gc()
    },
  })

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="position-actions"
      entityName={position.name}
      onConfirm={async () => {
        await mutateDelete({
          variables: { position: { positionId: String(position.id) } },
        })
      }}
    />
  )
}

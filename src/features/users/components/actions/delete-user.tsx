"use client"

import { ReactNode, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TableUser } from "@/features/users/components/user-table/users-table"
import { DELETE_USER } from "@/graphql/users/mutations"
import { GET_USERS_LIST } from "@/graphql/users/queries"
import { convertId } from "@/utils/convert-id"

export type DeleteUserProps = {
  user: TableUser
  children?: ReactNode
  open?: boolean
  onOpenChangeAction?: (open: boolean) => void
}

export default function DeleteUser({
  user,
  children,
  open: controlledOpen,
  onOpenChangeAction: controlledOnOpenChange,
}: DeleteUserProps) {
  const { t } = useT(["delete", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const [mutateDelete, { loading }] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS_LIST }],
  })

  const firstName = user.profile?.first_name || ""
  const lastName = user.profile?.last_name || ""
  const fullName = `${firstName} ${lastName}`.trim()
  const displayName = fullName || user.email || ""

  const handleDelete = async () => {
    try {
      await mutateDelete({
        variables: { userId: String(user.id) },
      })
      toast.success(t("delete:user.success"))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : t("delete:user.error")
      toast.error(errorMessage)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-150">
        <DialogHeader>
          <DialogTitle>{t("delete:user.title")}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-foreground">
          {t("delete:user.description", { name: displayName })}
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              {t("buttons:cancel")}
            </Button>
          </DialogClose>
          <Button type="button" disabled={loading} onClick={handleDelete}>
            {t("buttons:delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

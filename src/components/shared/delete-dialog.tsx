"use client"

import { useState } from "react"
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
} from "@/components/ui/dialog"

export interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  i18nKey: string
  entityName?: string
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  i18nKey,
  entityName,
}: DeleteDialogProps) {
  const { t: tButtons } = useT("buttons")
  const { t: tEntity } = useT(i18nKey)
  const [loading, setLoading] = useState(false)

  const title = tEntity("delete.title")
  const description = tEntity("delete.description", { name: entityName })
  const successMessage = tEntity("delete.success")
  const errorMessage = tEntity("delete.error")

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onConfirm()
      if (successMessage) {
        toast.success(successMessage)
      }
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      const finalErrorMsg =
        error instanceof Error
          ? error.message
          : errorMessage || "An error occurred"
      toast.error(finalErrorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-foreground">
          {description}
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              {tButtons("cancel")}
            </Button>
          </DialogClose>
          <Button type="button" disabled={loading} onClick={handleDelete}>
            {tButtons("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

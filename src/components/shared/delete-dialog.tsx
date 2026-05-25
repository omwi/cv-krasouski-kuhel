"use client"

import { useState } from "react"
import { useT } from "next-i18next/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  const { t } = useT(["buttons", i18nKey])
  const [loading, setLoading] = useState(false)

  const title = t(`${i18nKey}:delete.title`)
  const description = t(`${i18nKey}:delete.description`, { name: entityName })
  const successMessage = t(`${i18nKey}:delete.success`)
  const errorMessage = t(`${i18nKey}:delete.error`)

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
      <DialogContent aria-describedby={undefined} className="max-w-150">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="text-foreground">{description}</div>

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

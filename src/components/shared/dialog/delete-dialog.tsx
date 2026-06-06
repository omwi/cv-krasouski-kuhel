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

  const title = t(`delete.title`, { ns: i18nKey })
  const description = t(`delete.description`, { name: entityName, ns: i18nKey })
  const successMessage = t(`delete.success`, { ns: i18nKey })
  const errorMessage = t(`delete.error`, { ns: i18nKey })

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onConfirm()
      toast.success(successMessage)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      const finalErrorMsg =
        error instanceof Error ? error.message : errorMessage
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
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              data-testid="delete-dialog-cancel-button"
            >
              {t("cancel", { ns: "buttons" })}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            data-testid="delete-dialog-confirm-button"
          >
            {t("delete", { ns: "buttons" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

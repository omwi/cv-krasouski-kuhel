"use client"

import { ReactNode } from "react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  trigger?: ReactNode
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
  submitDisabled?: boolean
  cancelLabel?: string
  children: ReactNode
  className?: string
  dialogClassName?: string
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  trigger,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submitDisabled = false,
  cancelLabel,
  children,
  className,
  dialogClassName,
}: FormDialogProps) {
  const { t } = useT("buttons")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        aria-describedby={undefined}
        className={cn(dialogClassName)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className={cn(className, "flex flex-col gap-6")}
        >
          {children}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                {cancelLabel ?? t("cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitDisabled || isSubmitting}>
              {submitLabel ?? t("confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

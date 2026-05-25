"use client"

import { ReactNode, useState } from "react"
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
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { useUpdatePositionForm } from "@/features/positions/hooks/use-update-position-form"

type Props = {
  position: TablePosition
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdatePosition({
  position,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["position", "input", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const {
    register,
    onSubmit,
    loading,
    formState: { errors, isSubmitting, isDirty },
  } = useUpdatePositionForm(position, open, setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t("update.title", { ns: "position" })}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1">
            <Field>
              <FloatingInput
                id="name"
                label={t("name", { ns: "input" })}
                {...register("name")}
              />
              {errors.name && (
                <FieldError className="mt-1">{errors.name.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={loading || isSubmitting}
              >
                {t("cancel", { ns: "buttons" })}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isDirty || loading || isSubmitting}
            >
              {t("update", { ns: "buttons" })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

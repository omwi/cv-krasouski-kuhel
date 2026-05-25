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
import { useCreateDepartmentForm } from "@/features/departments/hooks/use-create-department-form"

export type CreateDepartmentProps = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateDepartment({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateDepartmentProps) {
  const { t } = useT(["department-actions", "input", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const { form, onSubmit, loading } = useCreateDepartmentForm(t, () =>
    setOpen(false)
  )

  const {
    register,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          reset()
        }
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {t("create.title", { ns: "department-actions" })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1">
            <Field>
              <FloatingInput
                id="name"
                label={t("name", { ns: "input" })}
                disabled={loading || isSubmitting}
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
              disabled={!isValid || loading || isSubmitting}
            >
              {t("create", { ns: "buttons" })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import { useUpdateDepartmentForm } from "@/features/departments/hooks/use-update-department-form"

export type Props = {
  department: TableDepartment
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdateDepartment({
  department,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["department-actions", "input", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const { form, onSubmit, loading } = useUpdateDepartmentForm(
    department,
    open,
    t,
    () => setOpen(false)
  )

  const {
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = form

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {t("update.title", { ns: "department-actions" })}
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
              disabled={!isValid || !isDirty || loading || isSubmitting}
            >
              {t("update", { ns: "buttons" })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

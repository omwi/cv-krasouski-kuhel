"use client"

import { ReactNode, useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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
import { UPDATE_DEPARTMENT } from "@/graphql/departments/mutations"
import { GET_DEPARTMENTS } from "@/graphql/departments/queries"

export type Props = {
  department: TableDepartment
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const getUpdateSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("input:errors.name"),
    }),
  })

type UpdateFormValues = {
  name: string
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

  const [mutateUpdate, { loading }] = useMutation(UPDATE_DEPARTMENT, {
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  })

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(getUpdateSchema(t)),
    defaultValues: {
      name: department.name || "",
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = form

  useEffect(() => {
    if (open) {
      reset({ name: department.name || "" })
    }
  }, [open, department, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!isDirty) {
      toast.info(t("department-actions:update.no-changes"))
      setOpen(false)
      return
    }

    try {
      await mutateUpdate({
        variables: {
          department: {
            departmentId: String(department.id),
            name: data.name,
          },
        },
      })
      toast.success(t("department-actions:update.success"))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("department-actions:update.error")
      toast.error(errorMessage)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t("department-actions:update.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1">
            <Field>
              <FloatingInput
                id="name"
                label={t("input:name")}
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
                {t("buttons:cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isValid || !isDirty || loading || isSubmitting}
            >
              {t("buttons:update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

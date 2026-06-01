import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import { UPDATE_DEPARTMENT } from "@/graphql/departments/mutations"

const getUpdateSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
  })

export type UpdateFormValues = {
  name: string
}

export function useUpdateDepartmentForm(
  department: TableDepartment,
  open: boolean,
  t: TFunction,
  onSuccess?: () => void
) {
  const [mutateUpdate, { loading }] = useMutation(UPDATE_DEPARTMENT)

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(getUpdateSchema(t)),
    defaultValues: {
      name: department.name || "",
    },
  })

  const { reset } = form

  useEffect(() => {
    if (open) {
      reset({ name: department.name || "" })
    }
  }, [open, department, reset])

  const onSubmit = form.handleSubmit(async (data) => {
    if (!form.formState.isDirty) {
      toast.info(t("update.no-changes", { ns: "department-actions" }))
      onSuccess?.()
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
      toast.success(t("update.success", { ns: "department-actions" }))
      onSuccess?.()
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("update.error", { ns: "department-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}

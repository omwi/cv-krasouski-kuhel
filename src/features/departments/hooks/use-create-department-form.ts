import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { DEPARTMENT_FIELDS_FRAGMENT } from "@/graphql/departments/fragments"
import { CREATE_DEPARTMENT } from "@/graphql/departments/mutations"
import { appendUniqueRef } from "@/utils/cache"

const getCreateDepartmentSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
  })

export type CreateDepartmentFormValues = {
  name: string
}

export function useCreateDepartmentForm(t: TFunction, onSuccess?: () => void) {
  const [mutateCreate, { loading }] = useMutation(CREATE_DEPARTMENT, {
    update(cache, { data }) {
      const newDepartment = data?.createDepartment
      if (!newDepartment) return

      const newRef = cache.writeFragment({
        data: newDepartment,
        fragment: DEPARTMENT_FIELDS_FRAGMENT,
      })
      if (!newRef) return

      cache.modify({
        fields: {
          departments: appendUniqueRef(newRef, newDepartment.id),
        },
      })
    },
  })

  const form = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(getCreateDepartmentSchema(t)),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutateCreate({
        variables: {
          department: {
            name: data.name,
          },
        },
      })
      toast.success(t("create.success", { ns: "department-actions" }))
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("create.error", { ns: "department-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}

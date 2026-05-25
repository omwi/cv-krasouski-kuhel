import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { CREATE_DEPARTMENT } from "@/graphql/departments/mutations"
import { GET_DEPARTMENTS } from "@/graphql/departments/queries"

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
    refetchQueries: [{ query: GET_DEPARTMENTS }],
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

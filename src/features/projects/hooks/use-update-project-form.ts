import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { getProjectSchema, ProjectFormValues } from "@/features/projects/schema"
import { UPDATE_PROJECT } from "@/graphql/projects/mutations"

export function useUpdateProjectForm(
  t: TFunction,
  initialData: ProjectFormValues & { id: string },
  onSuccess?: () => void
) {
  const [mutateUpdate, { loading }] = useMutation(UPDATE_PROJECT)

  const getNormalizedValues = (data: ProjectFormValues) => ({
    name: data.name,
    description: data.description,
    domain: data.domain,
    environment: data.environment,
    start_date: data.start_date,
    end_date: data.end_date || "",
  })

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(getProjectSchema(t)),
    mode: "onBlur",
    defaultValues: getNormalizedValues(initialData),
  })

  useEffect(() => {
    form.reset(getNormalizedValues(initialData))
  }, [initialData, form])

  const onSubmit = form.handleSubmit(async (data) => {
    if (!form.formState.isDirty) {
      onSuccess?.()
      return
    }

    try {
      await mutateUpdate({
        variables: {
          project: {
            projectId: initialData.id,
            name: data.name,
            description: data.description,
            domain: data.domain,
            environment: data.environment,
            start_date: data.start_date,
            end_date: data.end_date || undefined,
          },
        },
      })
      toast.success(t("update.success", { ns: "project-actions" }))
      onSuccess?.()
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("update.error", { ns: "project-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}

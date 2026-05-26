import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { getProjectSchema, ProjectFormValues } from "@/features/projects/schema"
import { CREATE_PROJECT } from "@/graphql/projects/mutations"
import { GET_PROJECTS } from "@/graphql/projects/queries"

export function useCreateProjectForm(t: TFunction, onSuccess?: () => void) {
  const [mutateCreate, { loading }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  })

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(getProjectSchema(t)),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      domain: "",
      environment: [],
      start_date: "",
      end_date: "",
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutateCreate({
        variables: {
          project: {
            name: data.name,
            description: data.description,
            domain: data.domain,
            environment: data.environment,
            start_date: data.start_date,
            end_date: data.end_date,
          },
        },
      })
      toast.success(t("create.success", { ns: "project-actions" }))
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("create.error", { ns: "project-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}

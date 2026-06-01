import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { getProjectSchema, ProjectFormValues } from "@/features/projects/schema"
import { PROJECT_FIELDS_FRAGMENT } from "@/graphql/projects/fragments"
import { CREATE_PROJECT } from "@/graphql/projects/mutations"
import { appendUniqueRef } from "@/utils/cache"

export function useCreateProjectForm(t: TFunction, onSuccess?: () => void) {
  const [mutateCreate, { loading }] = useMutation(CREATE_PROJECT, {
    update(cache, { data }) {
      const newProject = data?.createProject
      if (!newProject) return

      const newRef = cache.writeFragment({
        data: newProject,
        fragment: PROJECT_FIELDS_FRAGMENT,
      })
      if (!newRef) return

      cache.modify({
        fields: {
          projects: appendUniqueRef(newRef, newProject.id),
        },
      })
    },
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
            end_date: data.end_date || null,
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

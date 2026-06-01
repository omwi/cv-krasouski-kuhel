import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { ADD_CV_PROJECT } from "@/graphql/cvs/mutations"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { GET_PROJECTS } from "@/graphql/projects/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { CvUserId } from "@/types/graphql-types"

const schema = z.object({
  projectId: z.string().min(1),
  responsibilities: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().nullable(),
})

type AddCvProjectInput = z.infer<typeof schema>

export function useAddCvProject({ id, user }: CvUserId) {
  const { t } = useT("cv-project-actions")

  const [open, setOpen] = useState(false)

  const { canUpdateCv } = usePermissions()

  const form = useForm<AddCvProjectInput>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      projectId: "",
      responsibilities: "",
    },
  })
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = form
  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const [addCvProject] = useMutation(ADD_CV_PROJECT, {
    refetchQueries: [{ query: GET_CV_PROJECTS, variables: { cvId: id } }],
  })
  const onSubmit = async (values: AddCvProjectInput) => {
    if (!canUpdateCv(user?.id)) return

    try {
      await addCvProject({
        variables: {
          project: {
            cvId: id,
            projectId: values.projectId,
            responsibilities: values.responsibilities.split(" "), // todo: util parse responsibilities
            start_date: values.startDate,
            end_date: values.endDate,
            roles: [],
          },
        },
      })
      toast.success(t("create.success"))
    } catch (error) {
      console.error(error)
      toast.error(t("create.error"))
    } finally {
      setOpen(false)
    }
  }

  const { data } = useQuery(GET_PROJECTS)
  const projects = data?.projects ?? []
  const selectProjectId = form.watch("projectId")
  const selectedProject = projects.find((p) => p.id === selectProjectId)

  useEffect(() => {
    if (!selectedProject) return

    form.setValue("startDate", selectedProject.start_date, {
      shouldValidate: true,
      shouldDirty: true,
    })
    form.setValue("endDate", selectedProject.end_date, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [selectedProject, form])

  return {
    form,
    reset,
    control,
    register,
    open,
    setOpen,
    onSubmit: handleSubmit(onSubmit),
    isSubmitReady: isDirty && isValid,
    selectedProject: selectedProject,
  }
}

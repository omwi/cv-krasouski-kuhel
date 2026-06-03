import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import {
  CvProjectFormValues,
  cvProjectSchema,
} from "@/features/cvs/components/projects/actions/cv-project-schema"
import { ADD_CV_PROJECT } from "@/graphql/cvs/mutations"
import { GET_PROJECTS } from "@/graphql/projects/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { CvUserId } from "@/types/graphql-types"

export function useAddCvProject({ id, user }: CvUserId) {
  const { t } = useT("cv-project-actions")

  const [open, setOpen] = useState(false)

  const { canUpdateCv } = usePermissions()

  const form = useForm<CvProjectFormValues>({
    resolver: standardSchemaResolver(cvProjectSchema),
    defaultValues: {
      projectId: "",
      responsibilities: [],
    },
  })

  const {
    reset,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = form

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const [addCvProject] = useMutation(ADD_CV_PROJECT)

  const onSubmit = async (values: CvProjectFormValues) => {
    if (!canUpdateCv(user?.id)) return

    try {
      await addCvProject({
        variables: {
          project: {
            cvId: id,
            projectId: values.projectId,
            responsibilities: values.responsibilities,
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
  const selectProjectId = useWatch({
    control,
    name: "projectId",
  })
  const selectedProject = projects.find((p) => p.id === selectProjectId)

  useEffect(() => {
    if (!selectedProject) return

    setValue("startDate", selectedProject.start_date, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue("endDate", selectedProject.end_date, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [selectedProject, setValue])

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

import { useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  CvProjectFormValues,
  cvProjectSchema,
} from "@/features/cvs/components/projects/actions/cv-project-schema"
import {
  joinResponsibilities,
  splitResponsibilities,
} from "@/features/cvs/utils/cv-project"
import { UPDATE_CV_PROJECT } from "@/graphql/cvs/mutations"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { GET_PROJECTS } from "@/graphql/projects/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { CvProject, CvUserId } from "@/types/graphql-types"

export function useUpdateCvProject(
  cvProject: CvProject,
  cvUserId: CvUserId,
  dialog?: { open: boolean; setOpen: (open: boolean) => void }
) {
  const { t } = useT("cv-project-actions")

  const { canUpdateCv } = usePermissions()

  const form = useForm<CvProjectFormValues>({
    resolver: standardSchemaResolver(cvProjectSchema),
    defaultValues: {
      projectId: cvProject.project.id,
      responsibilities: joinResponsibilities(cvProject.responsibilities),
      startDate: cvProject.start_date,
      endDate: cvProject.end_date,
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
    if (!dialog?.open) return

    reset({
      projectId: cvProject.project.id,
      responsibilities: joinResponsibilities(cvProject.responsibilities),
      startDate: cvProject.start_date,
      endDate: cvProject.end_date,
    })
  }, [cvProject, reset, dialog?.open])

  const [updateCvProject] = useMutation(UPDATE_CV_PROJECT, {
    refetchQueries: [
      { query: GET_CV_PROJECTS, variables: { cvId: cvUserId.id } },
    ],
  })

  const onSubmit = async (values: CvProjectFormValues) => {
    if (!canUpdateCv(cvUserId.user?.id)) return

    try {
      await updateCvProject({
        variables: {
          project: {
            cvId: cvUserId.id,
            projectId: cvProject.project.id,
            responsibilities: splitResponsibilities(values.responsibilities),
            start_date: values.startDate,
            end_date: values.endDate,
            roles: cvProject.roles,
          },
        },
      })
      toast.success(t("update.success"))
    } catch (error) {
      console.error(error)
      toast.error(t("update.error"))
    } finally {
      if (dialog) {
        dialog.setOpen(false)
      }
    }
  }

  const { data } = useQuery(GET_PROJECTS)
  const projects = data?.projects ?? []

  const selectedProject = projects.find((p) => p.id === cvProject.project.id)

  return {
    form,
    reset,
    control,
    register,
    onSubmit: handleSubmit(onSubmit),
    isSubmitReady: isDirty && isValid,
    selectedProject: selectedProject,
  }
}

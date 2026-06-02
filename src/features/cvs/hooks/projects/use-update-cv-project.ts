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
import { UPDATE_CV_PROJECT } from "@/graphql/cvs/mutations"
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
      responsibilities: cvProject.responsibilities,
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
      responsibilities: cvProject.responsibilities,
      startDate: cvProject.start_date,
      endDate: cvProject.end_date,
    })
  }, [cvProject, reset, dialog?.open])

  const [updateCvProject] = useMutation(UPDATE_CV_PROJECT)
  const onSubmit = async (values: CvProjectFormValues) => {
    if (!canUpdateCv(cvUserId.user?.id)) return

    try {
      await updateCvProject({
        variables: {
          project: {
            cvId: cvUserId.id,
            projectId: cvProject.project.id,
            responsibilities: values.responsibilities,
            start_date: values.startDate,
            end_date: values.endDate ?? undefined,
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

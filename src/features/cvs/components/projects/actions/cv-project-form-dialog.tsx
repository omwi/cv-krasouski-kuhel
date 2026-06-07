import { ReactNode } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { Controller, UseFormReturn } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { FormDateRangePicker } from "@/components/shared/form/form-date-range-picker"
import FloatingBadgeInput from "@/components/shared/input/floating-badge-input"
import { EnvironmentSelect } from "@/components/shared/select/environment-select"
import { Field, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { FloatingTextarea } from "@/components/ui/floating-label-textarea"
import { CvProjectFormValues } from "@/features/cvs/components/projects/actions/cv-project-schema"
import ProjectSelect from "@/features/projects/components/project-select"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { Project } from "@/types/graphql-types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel: string
  trigger?: ReactNode
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitReady: boolean
  form: UseFormReturn<CvProjectFormValues>
  selectedProject?: Project
  cvId: string
  isUpdate?: boolean
}

export default function CvProjectFormDialog({
  open,
  onOpenChange: setOpen,
  title,
  submitLabel,
  trigger,
  onSubmit,
  isSubmitReady,
  form,
  selectedProject,
  cvId,
  isUpdate = false,
}: Props) {
  const { t } = useT("input")

  const { data } = useSuspenseQuery(GET_CV_PROJECTS, { variables: { cvId } })
  const cvProjects = data.cv.projects ?? []

  const { control } = form

  return (
    <FormDialog
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      title={title}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      submitDisabled={!isSubmitReady}
    >
      <FieldGroup className="flex flex-col gap-5 pt-2">
        <div className="grid grid-cols-2 gap-5">
          <Field>
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <ProjectSelect
                  data-testid="project-select"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isUpdate}
                  excludedNames={
                    isUpdate ? [] : cvProjects.map((cs) => cs.name)
                  }
                />
              )}
            />
          </Field>
          <Field>
            <FloatingInput
              id="domain"
              label={t("domain")}
              readOnly={true}
              value={selectedProject?.domain ?? ""}
            />
          </Field>
        </div>

        <FormDateRangePicker
          form={form}
          startName="startDate"
          endName="endDate"
        />

        <Field>
          <FloatingTextarea
            id="description"
            label={t("description")}
            readOnly={true}
            value={selectedProject?.description ?? ""}
          />
        </Field>

        <EnvironmentSelect
          disabled={true}
          value={selectedProject?.environment ?? []}
          onValueChange={() => {}}
        />

        <Field>
          <Controller
            control={control}
            name="responsibilities"
            render={({ field }) => (
              <FloatingBadgeInput
                id="responsibilities"
                label={t("responsibilities")}
                value={field.value ?? []}
                onValueChange={field.onChange}
              />
            )}
          />
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}

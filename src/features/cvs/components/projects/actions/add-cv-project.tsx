import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { FormDateRangePicker } from "@/components/shared/form/form-date-range-picker"
import { EnvironmentSelect } from "@/components/shared/select/environment-select"
import { Field, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { FloatingTextarea } from "@/components/ui/floating-label-textarea"
import { useAddCvProject } from "@/features/cvs/hooks/projects/use-add-cv-project"
import ProjectSelect from "@/features/projects/components/project-select"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { CvUserId } from "@/types/graphql-types"

export type Props = {
  children?: React.ReactNode
  cvUserId: CvUserId
}

export default function AddCvProject({ children, cvUserId }: Props) {
  const { t } = useT(["cv-project-actions", "buttons", "input"])

  const {
    form,
    register,
    control,
    onSubmit,
    isSubmitReady,
    selectedProject,
    open,
    setOpen,
  } = useAddCvProject(cvUserId)

  const { data } = useSuspenseQuery(GET_CV_PROJECTS, {
    variables: { cvId: cvUserId.id },
  })
  const cvProjects = data.cv.projects ?? []

  return (
    <FormDialog
      trigger={children}
      open={open}
      onOpenChange={setOpen}
      title={t("create.title")}
      submitLabel={t("add", { ns: "buttons" })}
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
                  value={field.value}
                  onValueChange={field.onChange}
                  excludedNames={cvProjects.map((cs) => cs.name)}
                />
              )}
            />
          </Field>
          <Field>
            <FloatingInput
              id="domain"
              label={t("domain", { ns: "input" })}
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
            label={t("description", { ns: "input" })}
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
          <FloatingTextarea
            id="responsibilities"
            label={t("responsibilities", { ns: "input" })}
            {...register("responsibilities")}
          />
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}

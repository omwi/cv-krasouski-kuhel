"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { Field } from "@/components/ui/field"
import { useCvSkillAddForm } from "@/features/cvs/hooks/use-add-cv-skill-form"
import SkillMasterySelect from "@/features/skills/components/skill-mastery-select"
import SkillSelect from "@/features/skills/components/skill-select"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"
import { CvUserId } from "@/types/graphql-types"

type Props = {
  children: React.ReactNode
  cvUserId: CvUserId
}

export default function CvSkillAddDialog({ children, cvUserId }: Props) {
  const { t } = useT(["buttons", "skills"])

  const { control, isSubmitReady, onSubmit, open, setOpen } =
    useCvSkillAddForm(cvUserId)
  const { data } = useSuspenseQuery(GET_CV_SKILLS, {
    variables: { cvId: cvUserId.id },
  })
  const cvSkill = data.cv.skills

  return (
    <FormDialog
      title={t("dialog.add", { ns: "skills" })}
      submitLabel={t("confirm")}
      cancelLabel={t("cancel")}
      trigger={children}
      open={open}
      onOpenChange={setOpen}
      onSubmit={onSubmit}
      dialogClassName="w-150"
      submitDisabled={!isSubmitReady}
    >
      <Field>
        <Controller
          control={control}
          name="skillId"
          render={({ field }) => (
            <SkillSelect
              value={field.value}
              onValueChange={field.onChange}
              excludedNames={cvSkill.map((cs) => cs.name)}
            />
          )}
        />
      </Field>
      <Field>
        <Controller
          control={control}
          name="mastery"
          render={({ field }) => (
            <SkillMasterySelect
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </Field>
    </FormDialog>
  )
}

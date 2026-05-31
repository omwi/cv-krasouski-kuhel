"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { Field } from "@/components/ui/field"
import SkillMasterySelect from "@/features/skills/components/skill-mastery-select"
import SkillSelect from "@/features/skills/components/skill-select"
import { useUserSkillAddForm } from "@/features/users/hooks/skills/use-user-skill-add-form"
import { GET_USER_SKILLS } from "@/graphql/users/queries"

type Props = {
  children: React.ReactNode
  userId: string
}

export default function UserSkillAddDialog({ children, userId }: Props) {
  const { t } = useT(["buttons", "skills"])

  const { control, isSubmitReady, onSubmit, open, setOpen } =
    useUserSkillAddForm(userId)

  const { data } = useSuspenseQuery(GET_USER_SKILLS, { variables: { userId } })
  const userSkills = data.profile.skills

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
              excludedNames={userSkills.map((us) => us.name)}
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

"use client"

import { useState } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import FormDialog from "@/components/shared/form-dialog"
import { Field } from "@/components/ui/field"
import SkillMasterySelect from "@/features/skills/components/skill-mastery-select"
import SkillSelect from "@/features/skills/components/skill-select"
import { useUserSkillAddForm } from "@/features/users/hooks/use-user-skill-add-form"
import { GET_USER_SKILLS } from "@/graphql/users/queries"

type Props = {
  children: React.ReactNode
  userId: string
}

const formId = "user-skill-add-form"

export default function UserSkillAddDialog({ children, userId }: Props) {
  const { t } = useT(["buttons", "skills"])

  const [isOpen, setIsOpen] = useState(false)

  const { control, reset, isDirty, isValid, onSubmit } =
    useUserSkillAddForm(userId)

  const { data } = useSuspenseQuery(GET_USER_SKILLS, { variables: { userId } })
  const userSkills = data.profile.skills

  return (
    <FormDialog
      title={t("dialog.add", { ns: "skills" })}
      formId={formId}
      confirmButtonText={t("confirm")}
      cancelButtonText={t("cancel")}
      trigger={children}
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      onCancel={() => {
        setIsOpen(false)
        reset()
      }}
      className="w-150"
      isReady={isValid && isDirty}
    >
      <form
        id={formId}
        onSubmit={(e) => {
          onSubmit(e)
          setIsOpen(false)
        }}
        className="flex flex-col gap-4"
      >
        <Field>
          <Controller
            control={control}
            name="skillId"
            render={({ field }) => (
              <SkillSelect
                required
                value={field.value}
                onValueChange={field.onChange}
                userSkills={userSkills}
              />
            )}
          />
          <Controller
            control={control}
            name="mastery"
            render={({ field }) => (
              <SkillMasterySelect
                required
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </Field>
      </form>
    </FormDialog>
  )
}

"use client"

import { useState } from "react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import FormDialog from "@/components/shared/form-dialog"
import { Field } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SkillMasterySelect from "@/features/skills/components/skill-mastery-select"
import { useUserSkillUpdateForm } from "@/features/users/hooks/use-user-skill-update-form"
import { UserSkill } from "@/types/graphql-types"

type Props = {
  children: React.ReactNode
  userId: string
  userSkill: UserSkill
}

export default function UserSkillUpdateDialog({
  children,
  userId,
  userSkill,
}: Props) {
  const { t } = useT(["buttons", "skills"])

  const formId = `user-skill-${userSkill.name}-update-form`

  const [isOpen, setIsOpen] = useState(false)

  const { control, reset, isDirty, isValid, onSubmit } = useUserSkillUpdateForm(
    userId,
    userSkill
  )

  return (
    <FormDialog
      title={t("dialog.update", { ns: "skills" })}
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
          <Select value={userSkill.name} disabled={true}>
            <SelectTrigger className="text-muted-foreground">
              <SelectValue placeholder="Select skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={userSkill.name}>{userSkill.name}</SelectItem>
            </SelectContent>
          </Select>
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

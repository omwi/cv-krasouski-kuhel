"use client"

import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
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

  const { control, onSubmit, isSubmitReady, open, setOpen } =
    useUserSkillUpdateForm(userId, userSkill)

  return (
    <FormDialog
      title={t("dialog.update", { ns: "skills" })}
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
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </Field>
    </FormDialog>
  )
}

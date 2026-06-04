import React from "react"
import { useT } from "next-i18next/client"
import { Control, Controller, FieldValues, Path } from "react-hook-form"

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
import { UserSkill } from "@/types/graphql-types"

type SkillUpdateDialogProps<TFieldValues extends FieldValues> = {
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  isSubmitReady: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void
  control: Control<TFieldValues>
  skill: UserSkill
}

export function SkillUpdateDialog<TFieldValues extends FieldValues>({
  children,
  open,
  setOpen,
  isSubmitReady,
  onSubmit,
  control,
  skill,
}: SkillUpdateDialogProps<TFieldValues>) {
  const { t } = useT(["buttons", "skills"])

  return (
    <FormDialog
      title={t("dialog.update", { ns: "skills" })}
      submitLabel={t("confirm")}
      cancelLabel={t("cancel")}
      trigger={children}
      open={open}
      onOpenChange={setOpen}
      onSubmit={async (e) => {
        await onSubmit(e)
      }}
      dialogClassName="w-150"
      submitDisabled={!isSubmitReady}
    >
      <Field>
        <Select value={skill.name} disabled={true}>
          <SelectTrigger className="text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={skill.name}>{skill.name}</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <Controller
          control={control}
          name={"mastery" as Path<TFieldValues>}
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

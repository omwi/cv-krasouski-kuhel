"use client"

import React from "react"
import { useT } from "next-i18next/client"
import { Control, Controller, FieldValues, Path } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { Field } from "@/components/ui/field"
import SkillMasterySelect from "@/features/skills/components/skill-mastery-select"
import SkillSelect from "@/features/skills/components/skill-select"

type SkillAddDialogProps<TFieldValues extends FieldValues> = {
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  isSubmitReady: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void
  control: Control<TFieldValues>
  excludedSkillNames: string[]
}

export function SkillAddDialog<TFieldValues extends FieldValues>({
  children,
  open,
  setOpen,
  isSubmitReady,
  onSubmit,
  control,
  excludedSkillNames,
}: SkillAddDialogProps<TFieldValues>) {
  const { t } = useT(["buttons", "skills"])

  return (
    <FormDialog
      title={t("dialog.add", { ns: "skills" })}
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
        <Controller
          control={control}
          name={"skillId" as Path<TFieldValues>}
          render={({ field }) => (
            <SkillSelect
              value={field.value}
              onValueChange={field.onChange}
              excludedNames={excludedSkillNames}
            />
          )}
        />
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

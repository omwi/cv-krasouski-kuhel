"use client"

import { ReactNode } from "react"
import { Controller, UseFormReturn } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { NameInput } from "@/components/shared/input/name-input"
import { SkillCategorySelect } from "@/components/shared/select/skill-category-select"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"

export type SkillFormValues = {
  name: string
  categoryId?: string
}

export interface SkillFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel?: string
  trigger?: ReactNode
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitting?: boolean
  submitDisabled?: boolean
  form: UseFormReturn<SkillFormValues>
}

export function SkillFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  trigger,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  form,
}: SkillFormDialogProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      trigger={trigger}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
      submitDisabled={submitDisabled}
    >
      <FieldGroup className="grid grid-cols-1 gap-5 pt-2">
        <NameInput
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />

        <Field>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SkillCategorySelect
                value={field.value || ""}
                onValueChangeAction={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.categoryId && (
            <FieldError className="mt-1">
              {errors.categoryId.message}
            </FieldError>
          )}
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}

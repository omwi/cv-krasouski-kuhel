"use client"

import { ReactNode } from "react"
import { Controller, UseFormReturn } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { NameInput } from "@/components/shared/input/name-input"
import { SkillCategorySelect } from "@/components/shared/select/skill-category-select"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { ProjectFormValues } from "@/features/projects/schema"

export interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel?: string
  trigger?: ReactNode
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitting?: boolean
  submitDisabled?: boolean
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  trigger,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  form,
}: ProjectFormDialogProps) {
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
      </FieldGroup>
    </FormDialog>
  )
}

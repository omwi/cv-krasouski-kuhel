"use client"

import { ReactNode } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { NameInput } from "@/components/shared/input/name-input"
import { FieldGroup } from "@/components/ui/field"

export interface EntityNameFormDialogProps<TFieldValues extends FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel?: string
  trigger?: ReactNode
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitting?: boolean
  submitDisabled?: boolean
  form: UseFormReturn<TFieldValues>
}

export function EntityNameFormDialog<TFieldValues extends { name: string }>({
  open,
  onOpenChange,
  title,
  submitLabel,
  trigger,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  form,
}: EntityNameFormDialogProps<TFieldValues>) {
  const {
    register,
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
      <FieldGroup className="grid grid-cols-1">
        <NameInput
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </FieldGroup>
    </FormDialog>
  )
}

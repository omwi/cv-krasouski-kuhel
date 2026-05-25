"use client"

import { ReactNode } from "react"
import { useT } from "next-i18next/client"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

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
  const { t } = useT(["input"])
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
        <Field>
          <FloatingInput
            id="name"
            label={t("name", { ns: "input" })}
            disabled={isSubmitting}
            {...register("name" as Path<TFieldValues>)}
          />
          {errors.name && (
            <FieldError className="mt-1">
              {errors.name.message as string}
            </FieldError>
          )}
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}

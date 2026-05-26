"use client"

import { ReactNode } from "react"
import { useT } from "next-i18next/client"
import { UseFormReturn } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { NameInput } from "@/components/shared/input/name-input"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

export type LanguagesFormValues = {
  name: string
  native_name?: string
  iso2: string
  languageId?: string
}

export interface LanguageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel?: string
  trigger?: ReactNode
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitting?: boolean
  submitDisabled?: boolean
  form: UseFormReturn<LanguagesFormValues>
}

export function LanguageFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  trigger,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  form,
}: LanguageFormDialogProps) {
  const {
    register,
    formState: { errors },
  } = form
  const { t } = useT(["input"])

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
          <FloatingInput
            id="native-name"
            label={t("native-name", { ns: "input" })}
            disabled={isSubmitting}
            {...form.register("native_name")}
          />
          {errors.native_name && (
            <FieldError className="mt-1">
              {errors.native_name.message}
            </FieldError>
          )}
        </Field>
        <Field>
          <FloatingInput
            className="uppercase"
            id="iso2"
            label={t("iso2", { ns: "input" })}
            disabled={isSubmitting}
            {...form.register("iso2")}
          />
          {errors.iso2 && (
            <FieldError className="mt-1">{errors.iso2.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}

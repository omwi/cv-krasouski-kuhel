"use client"

import { ReactNode } from "react"
import { useT } from "next-i18next/client"
import { Controller, UseFormReturn } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { FormDateRangePicker } from "@/components/shared/form/form-date-range-picker"
import { NameInput } from "@/components/shared/input/name-input"
import { EnvironmentSelect } from "@/components/shared/select/environment-select"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { FloatingTextarea } from "@/components/ui/floating-label-textarea"
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
  const { t } = useT("input")

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
      <FieldGroup className="flex flex-col gap-5 pt-2">
        <div className="grid grid-cols-2 gap-5">
          <NameInput
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />
          <Field>
            <FloatingInput
              id="domain"
              label={t("domain")}
              disabled={isSubmitting}
              {...register("domain")}
            />
            {errors.domain && (
              <FieldError className="mt-1">{errors.domain.message}</FieldError>
            )}
          </Field>
        </div>

        <FormDateRangePicker
          form={form}
          startName="start_date"
          endName="end_date"
          isSubmitting={isSubmitting}
        />

        <Field>
          <FloatingTextarea
            id="description"
            label={t("description")}
            disabled={isSubmitting}
            {...register("description")}
          />
          {errors.description && (
            <FieldError className="mt-1">
              {errors.description.message}
            </FieldError>
          )}
        </Field>

        <Controller
          control={control}
          name="environment"
          render={({ field }) => (
            <Field>
              <EnvironmentSelect
                value={field.value || []}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              />
              {errors.environment && (
                <FieldError className="mt-1">
                  {errors.environment.message}
                </FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </FormDialog>
  )
}

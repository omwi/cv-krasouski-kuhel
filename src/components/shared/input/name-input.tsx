"use client"

import { useT } from "next-i18next/client"
import { FieldErrors, Path, UseFormRegister } from "react-hook-form"

import { Field, FieldError } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

export type NameInputProps<TFieldValues extends { name: string }> = {
  register: UseFormRegister<TFieldValues>
  errors: FieldErrors<TFieldValues>
  isSubmitting?: boolean
}

export function NameInput<TFieldValues extends { name: string }>({
  register,
  errors,
  isSubmitting,
}: NameInputProps<TFieldValues>) {
  const { t } = useT(["input"])

  return (
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
  )
}

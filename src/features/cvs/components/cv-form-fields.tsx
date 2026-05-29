import { useT } from "next-i18next/client"
import { FieldErrors, UseFormRegister } from "react-hook-form"

import { Field, FieldError } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { FloatingTextarea } from "@/components/ui/floating-label-textarea"

type Props = {
  register: UseFormRegister<{
    name: string
    education: string
    description: string
  }>
  errors: FieldErrors<{
    name: string
    education: string
    description: string
  }>
  disabled?: boolean
  readOnly?: boolean
}

export default function CvFormFields({
  register,
  errors,
  disabled = false,
  readOnly = false,
}: Props) {
  const { t } = useT("input")

  return (
    <>
      <Field>
        <FloatingInput
          id="name"
          label={t("name")}
          disabled={disabled}
          required={true}
          readOnly={readOnly}
          {...register("name")}
        />
        <FieldError>{errors.name?.message ?? ""}</FieldError>
      </Field>
      <Field>
        <FloatingInput
          id="education"
          label={t("education")}
          disabled={disabled}
          readOnly={readOnly}
          {...register("education")}
        />
        <FieldError>{errors.education?.message ?? ""}</FieldError>
      </Field>
      <Field>
        <FloatingTextarea
          id="description"
          label={t("description")}
          disabled={disabled}
          required={true}
          readOnly={readOnly}
          {...register("description")}
        />
        <FieldError>{errors.description?.message ?? ""}</FieldError>
      </Field>
    </>
  )
}

import { useState } from "react"
import { useT } from "next-i18next/client"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { Field, FieldError } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { FloatingTextarea } from "@/components/ui/floating-label-textarea"
import { useUpdateCvForm } from "@/features/cvs/hooks/use-update-cv-form"
import { Cv } from "@/types/graphql-types"
import { CurrentUser } from "@/utils/permissions"

export default function UpdateCv({
  children,
  currentUser,
  cv,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children?: React.ReactNode
  currentUser: CurrentUser
  cv: Cv
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { t } = useT(["cv-actions", "buttons", "input"])

  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { onSubmit, register, isSubmitting, isSubmitReady, errors } =
    useUpdateCvForm(cv, { open, setOpen })

  return (
    <FormDialog
      trigger={children}
      open={open}
      onOpenChange={setOpen}
      title={t("update.title")}
      submitLabel={t("update", { ns: "buttons" })}
      onSubmit={onSubmit}
      submitDisabled={!isSubmitReady}
      isSubmitting={isSubmitting}
    >
      <Field>
        <FloatingInput
          id="name"
          label={t("name", { ns: "input" })}
          disabled={isSubmitting}
          required={true}
          {...register("name")}
        />
        <FieldError>{errors.name?.message ?? ""}</FieldError>
      </Field>
      <Field>
        <FloatingInput
          id="education"
          label={t("education", { ns: "input" })}
          disabled={isSubmitting}
          {...register("education")}
        />
        <FieldError>{errors.education?.message ?? ""}</FieldError>
      </Field>
      <Field>
        <FloatingTextarea
          id="description"
          label={t("description", { ns: "input" })}
          disabled={isSubmitting}
          required={true}
          {...register("description")}
        />
        <FieldError>{errors.description?.message ?? ""}</FieldError>
      </Field>
    </FormDialog>
  )
}

import { useState } from "react"
import { useT } from "next-i18next/client"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import CvFormFields from "@/features/cvs/components/cv-form-fields"
import { useCreateCvForm } from "@/features/cvs/hooks/use-create-cv-form"

export default function CreateCv({
  children,
  userId,
}: {
  children: React.ReactNode
  userId?: string
}) {
  const { t } = useT(["cv-actions", "buttons"])
  const [open, setOpen] = useState(false)

  const { onSubmit, register, isSubmitting, isSubmitReady, errors } =
    useCreateCvForm(userId, { open, setOpen })

  return (
    <FormDialog
      trigger={children}
      open={open}
      onOpenChange={setOpen}
      title={t("create.title")}
      submitLabel={t("create", { ns: "buttons" })}
      onSubmit={onSubmit}
      submitDisabled={!isSubmitReady}
      isSubmitting={isSubmitting}
    >
      <CvFormFields
        register={register}
        errors={errors}
        disabled={isSubmitting}
      />
    </FormDialog>
  )
}

import { useState } from "react"
import { useT } from "next-i18next/client"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import CvFormFields from "@/features/cvs/components/cv-form-fields"
import { useUpdateCvForm } from "@/features/cvs/hooks/use-update-cv-form"
import { Cv } from "@/types/graphql-types"

export default function UpdateCv({
  children,
  cv,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children?: React.ReactNode
  cv: Cv
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { t } = useT(["cv-actions", "buttons"])

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
      <CvFormFields
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </FormDialog>
  )
}

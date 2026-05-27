import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { LanguageFormDialog } from "@/components/shared/form/language-form-dialog"
import { useCreateLanguageForm } from "@/features/languages/hooks/use-create-language-form"

export type Props = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateLanguage({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["language-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { form, onSubmit, loading } = useCreateLanguageForm(t, () =>
    setOpen(false)
  )

  const {
    formState: { isSubmitting, isValid },
  } = form

  return (
    <LanguageFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("create.title", { ns: "language-actions" })}
      submitLabel={t("create", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid}
      form={form}
    />
  )
}

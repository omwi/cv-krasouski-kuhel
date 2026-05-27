import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { LanguageFormDialog } from "@/components/shared/form/language-form-dialog"
import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"
import { useUpdateLanguageForm } from "@/features/languages/hooks/use-update-language-form"

export type Props = {
  language: TableLanguages
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdateLanguage({
  language,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["language-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { form, onSubmit, loading } = useUpdateLanguageForm(
    language,
    open,
    t,
    () => setOpen(false)
  )

  const {
    formState: { isSubmitting, isDirty, isValid },
  } = form

  return (
    <LanguageFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("update.title", { ns: "language-actions" })}
      submitLabel={t("update", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid || !isDirty}
      form={form}
    />
  )
}

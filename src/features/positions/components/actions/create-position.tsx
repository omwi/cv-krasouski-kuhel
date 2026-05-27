"use client"

import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { EntityNameFormDialog } from "@/components/shared/form/entity-name-form-dialog"
import { useCreatePositionForm } from "@/features/positions/hooks/use-create-position-form"

export type CreatePositionProps = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreatePosition({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreatePositionProps) {
  const { t } = useT(["position-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { form, onSubmit, loading } = useCreatePositionForm(open, setOpen)

  const {
    formState: { isSubmitting, isValid },
  } = form

  return (
    <EntityNameFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("create.title", { ns: "position-actions" })}
      submitLabel={t("create", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid}
      form={form}
    />
  )
}

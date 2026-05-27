"use client"

import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { SkillFormDialog } from "@/components/shared/form/skill-form-dialog"
import { useCreateSkillForm } from "@/features/skills/hooks/use-create-skill-form"

export type CreateSkillProps = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateSkill({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateSkillProps) {
  const { t } = useT(["skill-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { form, onSubmit, loading } = useCreateSkillForm(open, setOpen)

  const {
    formState: { isSubmitting, isValid },
  } = form

  return (
    <SkillFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("create.title", { ns: "skill-actions" })}
      submitLabel={t("create", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid}
      form={form}
    />
  )
}

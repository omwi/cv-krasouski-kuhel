"use client"

import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"

import { SkillFormDialog } from "@/components/shared/form/skill-form-dialog"
import { TableSkill } from "@/features/skills/components/table/skills-table-columns"
import { useUpdateSkillForm } from "@/features/skills/hooks/use-update-skill-form"

type Props = {
  skill: TableSkill
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdateSkill({
  skill,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["skill-actions", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const { form, onSubmit, loading } = useUpdateSkillForm(skill, open, setOpen)

  const {
    formState: { isSubmitting, isDirty, isValid },
  } = form

  return (
    <SkillFormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("update.title", { ns: "skill-actions" })}
      submitLabel={t("update", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={loading || isSubmitting}
      submitDisabled={!isValid || !isDirty}
      form={form}
    />
  )
}

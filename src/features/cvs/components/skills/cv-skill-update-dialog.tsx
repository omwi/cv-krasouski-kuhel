"use client"

import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { Field } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCvSkillUpdateForm } from "@/features/cvs/hooks/use-update-cv-skill-form"
import SkillMasterySelect from "@/features/skills/components/skill-mastery-select"
import { CvSkill, CvUserId } from "@/types/graphql-types"

type Props = {
  children: React.ReactNode
  cvUserId: CvUserId
  cvSkill: CvSkill
}

export default function CvSkillUpdateDialog({
  children,
  cvUserId,
  cvSkill,
}: Props) {
  const { t } = useT(["buttons", "skills"])

  const { control, onSubmit, isSubmitReady, open, setOpen } =
    useCvSkillUpdateForm(cvUserId, cvSkill)

  return (
    <FormDialog
      title={t("dialog.update", { ns: "skills" })}
      submitLabel={t("confirm")}
      cancelLabel={t("cancel")}
      trigger={children}
      open={open}
      onOpenChange={setOpen}
      onSubmit={onSubmit}
      dialogClassName="w-150"
      submitDisabled={!isSubmitReady}
    >
      <Field>
        <Select value={cvSkill.name} disabled={true}>
          <SelectTrigger className="text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={cvSkill.name}>{cvSkill.name}</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <Controller
          control={control}
          name="mastery"
          render={({ field }) => (
            <SkillMasterySelect
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </Field>
    </FormDialog>
  )
}

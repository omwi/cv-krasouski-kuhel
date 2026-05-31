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
import LanguageProficiencySelect from "@/features/languages/components/language-proficiency-select"
import { useUserLanguageUpdateForm } from "@/features/users/hooks/languages/use-user-language-update-form"
import { UserLanguage } from "@/types/graphql-types"

type Props = {
  children: React.ReactNode
  userId: string
  userLanguage: UserLanguage
}

export default function UserSkillUpdateDialog({
  children,
  userId,
  userLanguage,
}: Props) {
  const { t } = useT(["buttons", "skills"])

  const { control, onSubmit, isSubmitReady, open, setOpen } =
    useUserLanguageUpdateForm(userId, userLanguage)

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
        <Select value={userLanguage.name} disabled={true}>
          <SelectTrigger className="text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={userLanguage.name}>
              {userLanguage.name}
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <Controller
          control={control}
          name="proficiency"
          render={({ field }) => (
            <LanguageProficiencySelect
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </Field>
    </FormDialog>
  )
}

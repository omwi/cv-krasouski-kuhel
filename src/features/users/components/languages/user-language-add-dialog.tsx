import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { Field } from "@/components/ui/field"
import LanguageProficiencySelect from "@/features/languages/components/language-proficiency-select"
import LanguageSelect from "@/features/languages/components/language-select"
import { useUserLanguageAddForm } from "@/features/users/hooks/use-user-language-add-form"
import { GET_USER_LANGUAGES } from "@/graphql/users/queries"

type Props = {
  children: React.ReactNode
  userId: string
}

export default function UserLanguageAddDialog({ children, userId }: Props) {
  const { t } = useT(["buttons", "languages"])

  const { control, isSubmitReady, onSubmit, open, setOpen } =
    useUserLanguageAddForm(userId)

  const { data } = useSuspenseQuery(GET_USER_LANGUAGES, {
    variables: { userId },
  })
  const userLanguages = data.profile.languages

  return (
    <FormDialog
      title={t("dialog.add", { ns: "languages" })}
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
        <Controller
          control={control}
          name="languageName"
          render={({ field }) => (
            <LanguageSelect
              value={field.value}
              onValueChange={field.onChange}
              userLanguages={userLanguages}
            />
          )}
        />
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

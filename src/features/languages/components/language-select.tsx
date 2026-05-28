import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { Select, SelectItem } from "@/components/ui/select"
import { getNotOwnedLanguages } from "@/features/languages/utils/languages"
import { GET_LANGUAGES } from "@/graphql/languages/queries"
import { Language, UserLanguage } from "@/types/graphql-types"

type Props = React.ComponentProps<typeof Select> & {
  userLanguages?: UserLanguage[]
}

export default function LanguageSelect({ userLanguages, ...props }: Props) {
  const { t } = useT("input")

  const { data } = useQuery(GET_LANGUAGES)
  const languages = useMemo(() => {
    let result: NonNullable<Language>[] = (data?.languages ?? []).filter(
      (l) => l !== null
    )
    if (userLanguages) {
      result = getNotOwnedLanguages(userLanguages, result)
    }
    return result
  }, [data?.languages, userLanguages])

  return (
    <FloatingSelect label={t("language")} {...props}>
      {languages.map((language) => (
        <SelectItem key={language.id} value={language.name}>
          {language.name}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}

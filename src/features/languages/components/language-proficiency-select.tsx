import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { Select, SelectItem } from "@/components/ui/select"
import { LANGUAGE_PROFICIENCIES } from "@/config/const"

type Props = React.ComponentProps<typeof Select>

export default function LanguageProficiencySelect({ ...props }: Props) {
  const { t } = useT(["input"])

  return (
    <FloatingSelect label={t("language-proficiency")} {...props}>
      {LANGUAGE_PROFICIENCIES.map((proficiency) => (
        <SelectItem key={proficiency} value={proficiency}>
          {proficiency}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}

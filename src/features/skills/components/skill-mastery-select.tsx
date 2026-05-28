import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { Select, SelectItem } from "@/components/ui/select"
import { SKILL_MASTERIES } from "@/config/const"

type Props = React.ComponentProps<typeof Select>

export default function SkillMasterySelect({ ...props }: Props) {
  const { t } = useT(["skills", "input"])

  return (
    <FloatingSelect label={t("skill-mastery", { ns: "input" })} {...props}>
      {SKILL_MASTERIES.map((mastery) => (
        <SelectItem key={mastery} value={mastery}>
          {t(`mastery.${mastery}`)}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}

import { useT } from "next-i18next/client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SKILL_MASTERIES } from "@/config/const"

type Props = React.ComponentProps<typeof Select>

export default function SkillMasterySelect({ ...props }: Props) {
  const { t } = useT(["skills", "input"])

  return (
    <Select defaultValue={SKILL_MASTERIES[0]} {...props}>
      <SelectTrigger>
        <SelectValue placeholder={t("skill-mastery", { ns: "input" })} />
      </SelectTrigger>

      <SelectContent>
        {SKILL_MASTERIES.map((mastery) => (
          <SelectItem key={mastery} value={mastery}>
            {mastery}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

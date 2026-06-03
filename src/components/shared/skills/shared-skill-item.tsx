import { ReactNode } from "react"

import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Mastery } from "@/types/__generated__/graphql"
import { getColors } from "@/utils/skill-colors"

type Props = {
  skill: { name: string; mastery: Mastery }
  disabled?: boolean
  renderDialog: (children: ReactNode) => ReactNode
}

export default function SharedSkillItem({
  skill,
  disabled,
  renderDialog,
}: Props) {
  const { isSelecting, toggle, isSelected } = useSelection()

  const { color, trackColor, percent } = getColors(skill.mastery)

  const content = (
    <>
      <Progress
        value={isSelecting && isSelected(skill.name) ? 0 : percent}
        indicatorClassName={color}
        className={cn(trackColor, "w-20")}
      />
      <p
        className={cn(
          isSelecting && isSelected(skill.name) && "text-foreground"
        )}
      >
        {skill.name}
      </p>
    </>
  )

  if (!isSelecting) {
    return renderDialog(
      <Button
        variant="ghost"
        disabled={disabled}
        className="flex flex-row justify-start gap-4 px-4"
      >
        {content}
      </Button>
    )
  }

  return (
    <Button
      variant={isSelected(skill.name) ? "outline" : "ghost"}
      className="flex flex-row justify-start gap-4 px-4"
      onClick={() => toggle(skill.name)}
    >
      {content}
    </Button>
  )
}

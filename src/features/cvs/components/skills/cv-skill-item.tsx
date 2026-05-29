import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import CvSkillUpdateDialog from "@/features/cvs/components/skills/cv-skill-update-dialog"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"
import { CvSkill, CvUserId } from "@/types/graphql-types"
import { getColors } from "@/utils/skill-colors"

export default function CvSKillItem({
  skill,
  cvUserId,
}: {
  skill: CvSkill
  cvUserId: CvUserId
}) {
  const { canUpdateCv } = usePermissions()

  const { isSelecting, toggle, isSelected } = useSelection()

  const { color, trackColor, percent } = getColors(skill.mastery)

  return !isSelecting ? (
    <CvSkillUpdateDialog cvUserId={cvUserId} cvSkill={skill}>
      <Button
        variant={"ghost"}
        disabled={!canUpdateCv(cvUserId.user?.id)}
        className="flex flex-row justify-start gap-4 px-4"
      >
        <Progress
          value={percent}
          indicatorClassName={color}
          className={cn(trackColor, "w-20")}
        />
        <p>{skill.name}</p>
      </Button>
    </CvSkillUpdateDialog>
  ) : (
    <Button
      variant={isSelected(skill.name) ? "outline" : "ghost"}
      className="flex flex-row justify-start gap-4 px-4"
      onClick={() => toggle(skill.name)}
    >
      <Progress
        value={isSelected(skill.name) ? 0 : percent}
        indicatorClassName={color}
        className={cn(trackColor, "w-20")}
      />
      <p className={cn(isSelected(skill.name) && "text-foreground")}>
        {skill.name}
      </p>
    </Button>
  )
}

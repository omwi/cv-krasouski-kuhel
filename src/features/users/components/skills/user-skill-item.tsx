import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import UserSkillUpdateDialog from "@/features/users/components/skills/user-skill-update-dialog"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"
import { UserSkill } from "@/types/graphql-types"
import { getColors } from "@/utils/skill-colors"

export default function UserSKillItem({
  skill,
  userId,
}: {
  skill: UserSkill
  userId: string
}) {
  const { canUpdateUser } = usePermissions()

  const { isSelecting, toggle, isSelected } = useSelection()

  const { color, trackColor, percent } = getColors(skill.mastery)

  return !isSelecting ? (
    <UserSkillUpdateDialog userId={userId} userSkill={skill}>
      <Button
        variant={"ghost"}
        disabled={!canUpdateUser(userId)}
        className="flex flex-row justify-start gap-4 px-4"
      >
        <Progress
          value={percent}
          indicatorClassName={color}
          className={cn(trackColor, "w-20")}
        />
        <p>{skill.name}</p>
      </Button>
    </UserSkillUpdateDialog>
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

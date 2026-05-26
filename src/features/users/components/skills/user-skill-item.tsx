import { useSelection } from "@/components/shared/selection-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import UserSkillUpdateDialog from "@/features/users/components/skills/user-skill-update-dialog"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"
import { Mastery } from "@/types/__generated__/graphql"
import { UserSkill } from "@/types/graphql-types"

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
      variant={"ghost"}
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

function getColors(mastery: Mastery) {
  switch (mastery) {
    case "Novice":
      return {
        color: "bg-skill-novice",
        trackColor: "bg-skill-novice-track",
        percent: 20,
      }
    case "Advanced":
      return {
        color: "bg-skill-advanced",
        trackColor: "bg-skill-advanced-track",
        percent: 40,
      }
    case "Competent":
      return {
        color: "bg-skill-competent",
        trackColor: "bg-skill-competent-track",
        percent: 60,
      }
    case "Proficient":
      return {
        color: "bg-skill-proficient",
        trackColor: "bg-skill-proficient-track",
        percent: 80,
      }
    case "Expert":
      return {
        color: "bg-skill-expert",
        trackColor: "bg-skill-expert-track",
        percent: 100,
      }
    default:
      const _: never = mastery
      return _
  }
}

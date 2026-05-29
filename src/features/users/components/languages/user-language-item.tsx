import { useSelection } from "@/components/shared/selection/selection-provider"
import { Button } from "@/components/ui/button"
import UserLanguageUpdateDialog from "@/features/users/components/languages/user-language-update-dialog"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"
import { UserLanguage } from "@/types/graphql-types"

export default function UserLanguageItem({
  language,
  userId,
}: {
  language: UserLanguage
  userId: string
}) {
  const { canUpdateUser } = usePermissions()

  const { isSelecting, toggle, isSelected } = useSelection()

  return !isSelecting ? (
    <UserLanguageUpdateDialog userId={userId} userLanguage={language}>
      <Button
        variant={"ghost"}
        disabled={!canUpdateUser(userId)}
        className="flex flex-row justify-start gap-16 px-4"
      >
        <p>{language.proficiency}</p>
        <p>{language.name}</p>
      </Button>
    </UserLanguageUpdateDialog>
  ) : (
    <Button
      variant={isSelected(language.name) ? "outline" : "ghost"}
      onClick={() => toggle(language.name)}
      className={cn(
        "flex flex-row justify-start gap-16 px-4",
        isSelected(language.name) && "text-foreground"
      )}
    >
      <p>{language.proficiency}</p>
      <p>{language.name}</p>
    </Button>
  )
}

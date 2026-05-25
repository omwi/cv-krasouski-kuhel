"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import { Plus, Trash } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import UserSKillsCategory from "@/features/users/components/skills/user-skills-category"
import { GET_USER_SKILLS } from "@/graphql/users/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"

export default function UserSKills({ userId }: { userId: string }) {
  const { t } = useT("buttons")

  const { data } = useSuspenseQuery(GET_USER_SKILLS, { variables: { userId } })
  const userSkills = data.profile.skills

  const { canUpdateUser } = usePermissions()
  const hasPermissions = canUpdateUser(userId)

  const skillsByCategory = Map.groupBy(userSkills, (skill) => skill.categoryId)
    .entries()
    .toArray()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 self-center px-4 py-6">
      <div className="flex flex-col gap-8">
        {skillsByCategory.map(([categoryId, skills]) => (
          <UserSKillsCategory
            key={categoryId ?? "other"}
            category={categoryId ?? "other"}
            skills={skills}
            userId={userId}
          />
        ))}
      </div>

      <div
        className={cn(
          "flex flex-row justify-between gap-4 sm:justify-end",
          !hasPermissions && "hidden"
        )}
      >
        <Button variant={"ghost"} disabled={!hasPermissions} className="gap-4">
          <Plus className="size-6" />
          <span>{t("add-skill")}</span>
        </Button>
        <Button
          variant={"ghost-primary"}
          disabled={!hasPermissions}
          className="gap-4"
        >
          <Trash className="size-6" />
          <span>{t("remove-skills")}</span>
        </Button>
      </div>
    </div>
  )
}

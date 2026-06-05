"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TableSkill } from "@/features/skills/components/table/skills-table-columns"
import { DELETE_SKILL } from "@/graphql/skills/mutations"

type Props = {
  skill: TableSkill
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteSkill({ skill, open, onOpenChange }: Props) {
  const [mutateDelete] = useMutation(DELETE_SKILL, {
    update(cache) {
      cache.evict({ id: cache.identify({ __typename: "Skill", id: skill.id }) })
      cache.gc()
    },
  })

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="skill-actions"
      entityName={skill.name}
      onConfirm={async () => {
        await mutateDelete({
          variables: { skill: { skillId: String(skill.id) } },
        })
      }}
    />
  )
}

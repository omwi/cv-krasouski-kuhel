"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TableSkill } from "@/features/skills/components/table/skills-table-columns"
import { DELETE_SKILL } from "@/graphql/skills/mutations"
import { GET_SKILLS } from "@/graphql/skills/queries"

type Props = {
  skill: TableSkill
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DeleteSkill({
  skill,
  open = false,
  onOpenChange = () => {},
}: Props) {
  const [mutateDelete] = useMutation(DELETE_SKILL, {
    refetchQueries: [{ query: GET_SKILLS }],
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

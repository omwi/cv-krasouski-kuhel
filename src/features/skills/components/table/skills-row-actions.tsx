"use client"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteSkill from "@/features/skills/components/actions/delete-skill"
import UpdateSkill from "@/features/skills/components/actions/update-skill"
import { TableSkill } from "@/features/skills/components/table/skills-table-columns"
import type { CurrentUser } from "@/utils/permissions"

export default function SkillsRowActions({
  skill,
  currentUser,
}: {
  skill: TableSkill
  currentUser: CurrentUser
}) {
  if (!currentUser) return null

  return (
    <EntityRowActions<TableSkill>
      entity={skill}
      entityType="skills"
      entityId={String(skill.id)}
      currentUser={currentUser}
      renderEditModal={(props) => (
        <UpdateSkill skill={props.entity} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteSkill skill={props.entity} {...props} />
      )}
    />
  )
}

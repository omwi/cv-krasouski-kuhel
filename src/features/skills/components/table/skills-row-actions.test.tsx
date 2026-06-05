import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteSkill from "@/features/skills/components/actions/delete-skill"
import UpdateSkill from "@/features/skills/components/actions/update-skill"
import { TableSkill } from "@/features/skills/components/table/skills-table-columns"

import SkillsRowActions from "./skills-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/skills/components/actions/update-skill", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/skills/components/actions/delete-skill", () => ({
  default: vi.fn(() => <span />),
}))

describe("SkillsRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props to Update/Delete dialogs", () => {
    const mockSkill = {
      __typename: "Skill",
      id: "skill-1",
      name: "TypeScript",
    } as unknown as TableSkill

    render(<SkillsRowActions skill={mockSkill} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockSkill,
        entityType: "skills",
        entityId: "skill-1",
      })
    )

    expect(vi.mocked(UpdateSkill).mock.calls[0][0]).toEqual(
      expect.objectContaining({ skill: mockSkill })
    )

    expect(vi.mocked(DeleteSkill).mock.calls[0][0]).toEqual(
      expect.objectContaining({ skill: mockSkill })
    )
  })

  it("should coerce numeric skill id to string for entityId", () => {
    const mockSkill = {
      __typename: "Skill",
      id: 99,
      name: "React",
    } as unknown as TableSkill

    vi.mocked(EntityRowActions).mockClear()

    render(<SkillsRowActions skill={mockSkill} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0].entityId).toBe("99")
  })
})

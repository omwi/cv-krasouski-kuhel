import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TableSkill } from "@/features/skills/components/table/skills-table-columns"

import { getColumns } from "./skills-table-columns"

vi.mock("@/features/skills/components/table/skills-row-actions", () => ({
  default: vi.fn(({ skill }) => (
    <div data-testid="skills-row-actions">{skill.name}</div>
  )),
}))

describe("skills-table-columns", () => {
  it("should define columns with correct IDs and settings", () => {
    const columns = getColumns()

    expect(columns).toHaveLength(3)
    expect(columns.map((c) => c.id)).toEqual([
      "name",
      "category_name",
      "actions",
    ])

    const nameCol = columns.find((c) => c.id === "name")
    expect(nameCol?.titleKey).toBe("skills-table.columns.name")
    expect(nameCol?.sortable).toBe(true)
    expect(nameCol?.searchable).toBe(true)

    const categoryCol = columns.find((c) => c.id === "category_name")
    expect(categoryCol?.titleKey).toBe("skills-table.columns.category")
    expect(categoryCol?.sortable).toBe(true)
    expect(categoryCol?.searchable).toBe(true)

    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol?.isSrOnly).toBe(true)
    expect(actionsCol?.sortable).toBe(false)
    expect(actionsCol?.searchable).toBe(false)
  })

  it("should render actions column cell with SkillsRowActions", () => {
    const actionsCol = getColumns().find((c) => c.id === "actions")!

    render(
      actionsCol.cell!({
        row: { id: "skill-1", name: "TypeScript" } as TableSkill,
        value: "",
      })
    )

    expect(screen.getByTestId("skills-row-actions")).toHaveTextContent(
      "TypeScript"
    )
  })
})

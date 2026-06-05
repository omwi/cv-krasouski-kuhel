import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Cv } from "@/types/graphql-types"

import { getColumns } from "./cvs-table-columns"

vi.mock("@/features/cvs/components/table/cvs-row-actions", () => ({
  default: vi.fn(({ cv }) => (
    <div data-testid="cvs-row-actions">{cv.name}</div>
  )),
}))

describe("cvs-table-columns", () => {
  it("should define columns with correct IDs and settings", () => {
    const columns = getColumns()
    expect(columns).toHaveLength(5)
    expect(columns.map((c) => c.id)).toEqual([
      "name",
      "description",
      "education",
      "employee",
      "actions",
    ])

    const nameCol = columns.find((c) => c.id === "name")
    expect(nameCol?.titleKey).toBe("cvs-table.columns.name")
    expect(nameCol?.sortable).toBe(true)
    expect(nameCol?.searchable).toBe(true)
  })

  it("should render description column cell with truncation", () => {
    const descCol = getColumns().find((c) => c.id === "description")!
    render(
      descCol.cell!({
        row: { description: "Brief description" } as Cv,
        value: "",
      })
    )
    expect(screen.getByText("Brief description")).toHaveClass(
      "max-w-64",
      "truncate"
    )
  })

  it("should accessor employee column returning email or empty string", () => {
    const empCol = getColumns().find((c) => c.id === "employee")!
    expect(
      empCol.accessorFn!({ user: { email: "user@example.com" } } as Cv)
    ).toBe("user@example.com")
    expect(empCol.accessorFn!({ user: null } as Cv)).toBe("")
  })

  it("should render actions column cell with CvsRowActions", () => {
    const actionsCol = getColumns().find((c) => c.id === "actions")!
    render(
      actionsCol.cell!({
        row: { id: "cv-1", name: "Candidate CV" } as Cv,
        value: "",
      })
    )
    expect(screen.getByTestId("cvs-row-actions")).toHaveTextContent(
      "Candidate CV"
    )
  })
})

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

  it("should render description column cell correctly", () => {
    const columns = getColumns()
    const descCol = columns.find((c) => c.id === "description")
    expect(descCol).toBeDefined()
    expect(descCol?.cell).toBeDefined()

    const mockRow = {
      description: "Brief description of the candidate",
    } as unknown as Cv
    if (descCol && descCol.cell) {
      const element = descCol.cell({
        row: mockRow,
        value: "",
      })
      render(element)
      const div = screen.getByText("Brief description of the candidate")
      expect(div).toBeInTheDocument()
      expect(div).toHaveClass("max-w-64", "truncate")
    }
  })

  it("should accessor employee column correctly", () => {
    const columns = getColumns()
    const empCol = columns.find((c) => c.id === "employee")
    expect(empCol).toBeDefined()
    expect(empCol?.accessorFn).toBeDefined()

    if (empCol && empCol.accessorFn) {
      // With user
      const mockRowWithUser = {
        user: { id: "u-1", email: "user@example.com" },
      } as unknown as Cv
      expect(empCol.accessorFn(mockRowWithUser)).toBe("user@example.com")

      // Without user
      const mockRowWithoutUser = { user: null } as unknown as Cv
      expect(empCol.accessorFn(mockRowWithoutUser)).toBe("")
    }
  })

  it("should render actions column cell correctly", () => {
    const columns = getColumns()
    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol).toBeDefined()
    expect(actionsCol?.cell).toBeDefined()

    const mockRow = { id: "cv-1", name: "Candidate CV" } as unknown as Cv
    if (actionsCol && actionsCol.cell) {
      const element = actionsCol.cell({
        row: mockRow,
        value: "",
      })
      render(element)
      expect(screen.getByTestId("cvs-row-actions")).toHaveTextContent(
        "Candidate CV"
      )
    }
  })
})

import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"

import { getColumns } from "./departments-table-columns"

vi.mock(
  "@/features/departments/components/table/departments-row-actions",
  () => ({
    default: vi.fn(({ department }) => (
      <div data-testid="departments-row-actions">{department.name}</div>
    )),
  })
)

describe("departments-table-columns", () => {
  it("should define columns with correct IDs and settings", () => {
    const columns = getColumns()
    expect(columns).toHaveLength(2)
    expect(columns.map((c) => c.id)).toEqual(["name", "actions"])

    const nameCol = columns.find((c) => c.id === "name")
    expect(nameCol?.titleKey).toBe("departments-table.columns.name")
    expect(nameCol?.sortable).toBe(true)
    expect(nameCol?.searchable).toBe(true)

    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol?.isSrOnly).toBe(true)
    expect(actionsCol?.sortable).toBe(false)
    expect(actionsCol?.searchable).toBe(false)
  })

  it("should render actions column cell with DepartmentsRowActions", () => {
    const actionsCol = getColumns().find((c) => c.id === "actions")!
    render(
      actionsCol.cell!({
        row: { id: "dept-1", name: "Engineering" } as TableDepartment,
        value: "",
      })
    )
    expect(screen.getByTestId("departments-row-actions")).toHaveTextContent(
      "Engineering"
    )
  })
})

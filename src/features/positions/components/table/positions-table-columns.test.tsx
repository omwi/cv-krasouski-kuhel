import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TablePosition } from "@/features/positions/components/table/positions-table-columns"

import { getColumns } from "./positions-table-columns"

vi.mock("@/features/positions/components/table/positions-row-actions", () => ({
  default: vi.fn(({ position }) => (
    <div data-testid="positions-row-actions">{position.name}</div>
  )),
}))

describe("positions-table-columns", () => {
  it("should define columns with correct IDs and settings", () => {
    const columns = getColumns()
    expect(columns).toHaveLength(2)
    expect(columns.map((c) => c.id)).toEqual(["name", "actions"])

    const nameCol = columns.find((c) => c.id === "name")
    expect(nameCol?.titleKey).toBe("positions-table.columns.name")
    expect(nameCol?.sortable).toBe(true)
    expect(nameCol?.searchable).toBe(true)

    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol?.isSrOnly).toBe(true)
    expect(actionsCol?.sortable).toBe(false)
    expect(actionsCol?.searchable).toBe(false)
  })

  it("should render actions column cell with PositionsRowActions", () => {
    const actionsCol = getColumns().find((c) => c.id === "actions")!
    render(
      actionsCol.cell!({
        row: { id: "pos-1", name: "Software Engineer" } as TablePosition,
        value: "",
      })
    )
    expect(screen.getByTestId("positions-row-actions")).toHaveTextContent(
      "Software Engineer"
    )
  })
})

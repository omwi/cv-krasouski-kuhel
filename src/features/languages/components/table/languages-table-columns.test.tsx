import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"

import { getColumns } from "./languages-table-columns"

vi.mock("@/features/languages/components/table/languages-row-actions", () => ({
  default: vi.fn(({ language }) => (
    <div data-testid="languages-row-actions">{language.name}</div>
  )),
}))

describe("languages-table-columns", () => {
  it("should define columns with correct IDs and settings", () => {
    const columns = getColumns()
    expect(columns).toHaveLength(4)
    expect(columns.map((c) => c.id)).toEqual([
      "name",
      "native_name",
      "iso2",
      "actions",
    ])

    const nameCol = columns.find((c) => c.id === "name")
    expect(nameCol?.titleKey).toBe("languages-table.columns.name")
    expect(nameCol?.sortable).toBe(true)
    expect(nameCol?.searchable).toBe(true)

    const nativeNameCol = columns.find((c) => c.id === "native_name")
    expect(nativeNameCol?.titleKey).toBe("languages-table.columns.native-name")
    expect(nativeNameCol?.sortable).toBe(true)
    expect(nativeNameCol?.searchable).toBe(true)

    const iso2Col = columns.find((c) => c.id === "iso2")
    expect(iso2Col?.titleKey).toBe("languages-table.columns.iso2")
    expect(iso2Col?.sortable).toBe(true)
    expect(iso2Col?.searchable).toBe(true)

    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol?.isSrOnly).toBe(true)
    expect(actionsCol?.sortable).toBe(false)
    expect(actionsCol?.searchable).toBe(false)
  })

  it("should render actions column cell with LanguagesRowActions", () => {
    const actionsCol = getColumns().find((c) => c.id === "actions")!
    render(
      actionsCol.cell!({
        row: { id: "lang-1", name: "English" } as TableLanguages,
        value: "",
      })
    )
    expect(screen.getByTestId("languages-row-actions")).toHaveTextContent(
      "English"
    )
  })
})

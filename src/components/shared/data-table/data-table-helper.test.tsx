import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type {
  TableCellValue,
  TableColumnConfig,
} from "@/components/shared/data-table/data-table"
import { mapColumnsToColumnDefs } from "@/components/shared/data-table/data-table-helper"

vi.mock("next-i18next/client", () => ({
  useT: (ns?: string) => ({
    t: (key: string) => `${ns || "table"}:${key}`,
  }),
}))

vi.mock("@/components/shared/data-table/data-table-column-header", () => ({
  DataTableColumnHeader: ({
    title,
    sortKey,
    defaultSortBy,
  }: {
    title: string
    sortKey: string
    defaultSortBy?: string
  }) => (
    <div
      data-testid="sortable-header"
      data-sort-key={sortKey}
      data-default-sort={defaultSortBy}
    >
      {title}
    </div>
  ),
}))

type TestData = {
  id: string
  name: string
  age: number | null
  metadata?: string
}

type AccessorColumnDef<TData, TValue> = Extract<
  ColumnDef<TData, TValue>,
  { accessorFn?: unknown }
>

describe("mapColumnsToColumnDefs", () => {
  it("should parse standard IDs, apply default string accessors, and render plain fallback cell formats", () => {
    const configs: TableColumnConfig<TestData, TableCellValue>[] = [
      { id: "name", titleKey: "labels.name" },
      { id: "age", titleKey: "labels.age" },
    ]
    const rowData: TestData = { id: "1", name: "Alice", age: 30 }

    const [nameDef, ageDef] = mapColumnsToColumnDefs(
      configs
    ) as AccessorColumnDef<TestData, TableCellValue>[]

    expect(nameDef.id).toBe("name")
    expect(ageDef.id).toBe("age")

    if (
      typeof nameDef.accessorFn !== "function" ||
      typeof ageDef.accessorFn !== "function"
    ) {
      throw new Error("accessorFn must be a function")
    }
    expect(nameDef.accessorFn(rowData, 0)).toBe("Alice")
    expect(ageDef.accessorFn(rowData, 0)).toBe(30)

    if (typeof nameDef.header !== "function")
      throw new Error("Header must be a function")
    const mockHeaderContext = {} as HeaderContext<TestData, TableCellValue>
    const { rerender } = render(<>{nameDef.header(mockHeaderContext)}</>)
    expect(screen.getByText("table:labels.name")).toBeInTheDocument()

    if (typeof nameDef.cell !== "function")
      throw new Error("Cell must be a function")
    const mockCellContext = { getValue: () => "Alice" } as CellContext<
      TestData,
      TableCellValue
    >
    rerender(<>{nameDef.cell(mockCellContext)}</>)
    const cellContainer = screen.getByText("Alice")
    expect(cellContainer).toHaveClass("text-sm")

    const mockNullContext = { getValue: () => null } as CellContext<
      TestData,
      TableCellValue
    >
    const mockUndefinedContext = { getValue: () => undefined } as CellContext<
      TestData,
      TableCellValue
    >
    const { container: nullContainer } = render(
      <>{nameDef.cell(mockNullContext)}</>
    )
    const { container: undefinedContainer } = render(
      <>{nameDef.cell(mockUndefinedContext)}</>
    )
    expect(nullContainer).toBeEmptyDOMElement()
    expect(undefinedContainer).toBeEmptyDOMElement()
  })

  it("should dynamically resolve standard, screen-reader-only, and complex sortable headers", () => {
    const configs: TableColumnConfig<TestData, TableCellValue>[] = [
      { id: "id", titleKey: "labels.id", isSrOnly: true, ns: "custom-ns" },
      { id: "name", titleKey: "labels.name", sortable: true },
    ]

    const [srDef, sortDef] = mapColumnsToColumnDefs(configs, "name")

    if (
      typeof srDef.header !== "function" ||
      typeof sortDef.header !== "function"
    ) {
      throw new Error("Headers must be functions")
    }

    const mockHeaderContext = {} as HeaderContext<TestData, TableCellValue>
    const { rerender } = render(<>{srDef.header(mockHeaderContext)}</>)
    const srElement = screen.getByText("custom-ns:labels.id")
    expect(srElement).toHaveClass("sr-only")

    rerender(<>{sortDef.header(mockHeaderContext)}</>)
    const sortElement = screen.getByTestId("sortable-header")
    expect(sortElement).toHaveTextContent("table:labels.name")
    expect(sortElement).toHaveAttribute("data-sort-key", "name")
    expect(sortElement).toHaveAttribute("data-default-sort", "name")
  })

  it("should respect explicit custom accessors and custom cell render intercepts", () => {
    const customAccessorMock = vi.fn((row: TestData) => `MAPPED_${row.name}`)
    const customCellSpy = vi.fn(({ value }: { value: TableCellValue }) => (
      <span data-testid="custom-cell">{String(value)}</span>
    ))

    const configs: TableColumnConfig<TestData, TableCellValue>[] = [
      {
        id: "name",
        titleKey: "labels.name",
        accessorFn: customAccessorMock,
        cell: customCellSpy,
      },
    ]
    const rowData: TestData = { id: "1", name: "Bob", age: null }

    const [colDef] = mapColumnsToColumnDefs(configs) as AccessorColumnDef<
      TestData,
      TableCellValue
    >[]

    if (typeof colDef.accessorFn !== "function")
      throw new Error("accessorFn must be a function")
    const accessorResult = colDef.accessorFn(rowData, 0)
    expect(customAccessorMock).toHaveBeenCalledWith(rowData, expect.anything())
    expect(accessorResult).toBe("MAPPED_Bob")

    if (typeof colDef.cell !== "function")
      throw new Error("Cell must be a function")
    const mockCellContext = {
      row: { original: rowData },
      getValue: () => accessorResult,
    } as CellContext<TestData, TableCellValue>
    render(<>{colDef.cell(mockCellContext)}</>)

    expect(customCellSpy).toHaveBeenCalledWith({
      row: rowData,
      value: "MAPPED_Bob",
    })
    expect(screen.getByTestId("custom-cell")).toHaveTextContent("MAPPED_Bob")
  })
})

import React from "react"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "./data-table"

vi.mock("@/components/shared/data-table/data-table-helper", () => ({
  mapColumnsToColumnDefs: vi.fn(() => [
    { id: "name", header: "Name", cell: () => "mapped-cell" },
  ]),
}))

vi.mock("@tanstack/react-table", async () => {
  return {
    useReactTable: vi.fn(),
    getCoreRowModel: vi.fn(() => ({})),
    flexRender: (comp: unknown) => (typeof comp === "function" ? comp() : comp),
  }
})

vi.mock("@/components/shared/search-panel", () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="search-panel">{value}</div>
  ),
}))

vi.mock("@/components/shared/data-table/data-table-pagination", () => ({
  DataTablePagination: ({ totalText }: { totalText: string }) => (
    <div data-testid="pagination">{totalText}</div>
  ),
}))

vi.mock("@/components/ui/table", () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
  TableHead: ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  ),
}))

vi.mock("@/lib/utils", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

const mockUseReactTable = vi.fn()

vi.mocked(await import("@tanstack/react-table")).useReactTable =
  mockUseReactTable

const baseTableMock = {
  getHeaderGroups: () => [
    {
      id: "hg1",
      headers: [
        {
          id: "name",
          isPlaceholder: false,
          column: { columnDef: { header: () => "Name" } },
          getContext: () => ({}),
        },
      ],
    },
  ],
  getRowModel: () => ({
    rows: [
      {
        id: "r1",
        original: { name: "John" },
        getIsSelected: () => false,
        getVisibleCells: () => [
          {
            id: "c1",
            column: { id: "name", columnDef: { cell: () => "John" } },
            getContext: () => ({}),
          },
        ],
      },
    ],
  }),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("DataTable", () => {
  it("should render no results text when there are no rows", () => {
    mockUseReactTable.mockReturnValue({
      getHeaderGroups: () => [],
      getRowModel: () => ({ rows: [] }),
    })

    render(
      <DataTable columns={[]} data={[]} totalCount={0} totalText="total" />
    )

    expect(screen.getByText("not-found")).toBeInTheDocument()
  })

  it("should render rows and cells when data exists", () => {
    mockUseReactTable.mockReturnValue(baseTableMock)

    render(
      <DataTable
        columns={[{ id: "name", titleKey: "name" }]}
        data={[{ name: "John" }]}
        totalCount={1}
        totalText="total"
      />
    )

    expect(screen.getByText("Name")).toBeInTheDocument()
  })

  it("should show search panel when searchValue and onSearchChangeAction are provided", () => {
    mockUseReactTable.mockReturnValue(baseTableMock)

    render(
      <DataTable
        columns={[]}
        data={[]}
        totalCount={0}
        totalText="total"
        searchValue="john"
        onSearchChangeAction={vi.fn()}
      />
    )

    expect(screen.getByTestId("search-panel")).toBeInTheDocument()
  })

  it("should not render toolbar when searchValue and actions are not provided", () => {
    mockUseReactTable.mockReturnValue(baseTableMock)

    render(
      <DataTable columns={[]} data={[]} totalCount={0} totalText="total" />
    )

    expect(screen.queryByTestId("search-panel")).not.toBeInTheDocument()
  })

  it("should render actions when provided", () => {
    mockUseReactTable.mockReturnValue(baseTableMock)

    render(
      <DataTable
        columns={[]}
        data={[]}
        totalCount={0}
        totalText="total"
        actions={<button>Action</button>}
        searchValue="x"
      />
    )

    expect(screen.getByText("Action")).toBeInTheDocument()
  })

  it("should render subRows when renderSubRow is provided", () => {
    mockUseReactTable.mockReturnValue(baseTableMock)

    const renderSubRow = (row: { name: string }) => <div>Subrow {row.name}</div>

    render(
      <DataTable
        columns={[{ id: "name", titleKey: "name" }]}
        data={[{ name: "John" }]}
        totalCount={1}
        totalText="total"
        renderSubRow={renderSubRow}
      />
    )

    expect(screen.getByText("Subrow John")).toBeInTheDocument()
  })

  it("should call mapColumnsToColumnDefs when custom column config is provided", async () => {
    const { mapColumnsToColumnDefs } =
      await import("@/components/shared/data-table/data-table-helper")

    mockUseReactTable.mockReturnValue(baseTableMock)

    render(
      <DataTable
        columns={[{ id: "name", titleKey: "name" }]}
        data={[]}
        totalCount={0}
        totalText="total"
      />
    )

    expect(mapColumnsToColumnDefs).toHaveBeenCalled()
  })
})

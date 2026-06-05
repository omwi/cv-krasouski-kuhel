import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import CreatePosition from "@/features/positions/components/actions/create-position"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import PositionsTable from "./positions-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      positions: [
        { id: "pos-1", name: "Software Engineer" },
        { id: "pos-2", name: "Designer" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/positions/components/actions/create-position", () => ({
  default: vi.fn(({ children }) => <>{children}</>),
}))

vi.mock("@/hooks/use-table-url-state", () => ({
  useTableUrlState: vi.fn(),
}))

vi.mock("@/hooks/use-processed-data", () => ({
  useProcessedData: vi.fn(),
}))

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(),
}))

describe("PositionsTable", () => {
  const mockUpdateParams = vi.fn()

  const mockPositions = [
    { id: "pos-1", name: "Software Engineer" },
    { id: "pos-2", name: "Designer" },
  ] as unknown as TablePosition[]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useTableUrlState).mockReturnValue({
      params: {
        search: "test-query",
        sortBy: "name",
        sortOrder: "asc",
        page: 1,
        pageSize: 10,
      },
      updateParams: mockUpdateParams,
    } as unknown as ReturnType<typeof useTableUrlState>)

    vi.mocked(useProcessedData).mockReturnValue({
      paginatedData: mockPositions,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should pass correct props to DataTable and render create button when admin", () => {
    render(<PositionsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")

    props.onSearchChangeAction?.("new-search")
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    expect(vi.mocked(CreatePosition)).toHaveBeenCalled()
  })

  it("should not render CreatePosition when not admin", () => {
    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: false,
    } as unknown as ReturnType<typeof usePermissions>)

    render(<PositionsTable />)

    expect(vi.mocked(CreatePosition)).not.toHaveBeenCalled()
  })

  it("should pass positions from query to useProcessedData", () => {
    render(<PositionsTable />)

    const processedDataArgs = vi.mocked(useProcessedData).mock.calls[0][0]
    expect(processedDataArgs.data).toEqual(mockPositions)
  })

  it("should pass paginated data and totalCount to DataTable", () => {
    render(<PositionsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.data).toEqual(mockPositions)
    expect(props.totalCount).toBe(2)
  })

  it("should pass defaultSortBy='name' to DataTable", () => {
    render(<PositionsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.defaultSortBy).toBe("name")
  })
})

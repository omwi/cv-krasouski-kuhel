import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import CreateDepartment from "@/features/departments/components/actions/create-department"
import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import DepartmentsTable from "./departments-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      departments: [
        { id: "dept-1", name: "Engineering" },
        { id: "dept-2", name: "Design" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/departments/components/actions/create-department", () => ({
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

describe("DepartmentsTable", () => {
  const mockUpdateParams = vi.fn()

  const mockDepartments = [
    { id: "dept-1", name: "Engineering" },
    { id: "dept-2", name: "Design" },
  ] as unknown as TableDepartment[]

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
      paginatedData: mockDepartments,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should pass correct props to DataTable and render create button when admin", () => {
    render(<DepartmentsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")

    props.onSearchChangeAction?.("new-search")
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    expect(vi.mocked(CreateDepartment)).toHaveBeenCalled()
  })

  it("should not render CreateDepartment when not admin", () => {
    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: false,
    } as unknown as ReturnType<typeof usePermissions>)

    render(<DepartmentsTable />)

    expect(vi.mocked(CreateDepartment)).not.toHaveBeenCalled()
  })

  it("should pass departments from query to useProcessedData", () => {
    render(<DepartmentsTable />)

    const processedDataArgs = vi.mocked(useProcessedData).mock.calls[0][0]
    expect(processedDataArgs.data).toEqual(mockDepartments)
  })

  it("should pass paginated data and totalCount to DataTable", () => {
    render(<DepartmentsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.data).toEqual(mockDepartments)
    expect(props.totalCount).toBe(2)
  })
})

import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import CreateUser from "@/features/users/components/actions/create-user"
import { TableUser } from "@/features/users/components/user-table/users-table"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import UsersTable from "./users-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      users: [
        { id: "user-1", firstName: "John" },
        { id: "user-2", firstName: "Jane" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/users/components/actions/create-user", () => ({
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

describe("UsersTable", () => {
  const mockUpdateParams = vi.fn()

  const mockUsers = [
    { id: "user-1", firstName: "John" },
    { id: "user-2", firstName: "Jane" },
  ] as unknown as TableUser[]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useTableUrlState).mockReturnValue({
      params: {
        search: "test-query",
        sortBy: "firstName",
        sortOrder: "asc",
        page: 1,
        pageSize: 10,
      },
      updateParams: mockUpdateParams,
    } as unknown as ReturnType<typeof useTableUrlState>)

    vi.mocked(useProcessedData).mockReturnValue({
      paginatedData: mockUsers,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      currentUserId: "user-1",
      canCreateUser: vi.fn(() => true),
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should pass correct props to DataTable and render create button when allowed", () => {
    render(<UsersTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")

    props.onSearchChangeAction?.("new-search")
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    expect(vi.mocked(CreateUser)).toHaveBeenCalled()
  })

  it("should not render CreateUser when permission denied", () => {
    vi.mocked(usePermissions).mockReturnValue({
      currentUserId: "user-1",
      canCreateUser: vi.fn(() => false),
    } as unknown as ReturnType<typeof usePermissions>)

    render(<UsersTable />)

    expect(vi.mocked(CreateUser)).not.toHaveBeenCalled()
  })

  it("should pass users data to useProcessedData", () => {
    render(<UsersTable />)

    const args = vi.mocked(useProcessedData).mock.calls[0][0]

    expect(args.data).toEqual(mockUsers)
  })

  it("should pass paginated data and totalCount to DataTable", () => {
    render(<UsersTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.data).toEqual(mockUsers)
    expect(props.totalCount).toBe(2)
  })

  it("should pass hoistPredicate based on currentUserId", () => {
    render(<UsersTable />)

    const args = vi.mocked(useProcessedData).mock.calls[0][0]

    expect(typeof args.hoistPredicate).toBe("function")
    expect(args.hoistPredicate!({ id: "user-1" } as TableUser)).toBe(true)
    expect(args.hoistPredicate!({ id: "user-2" } as TableUser)).toBe(false)
  })

  it("should pass defaultSortBy to DataTable", () => {
    render(<UsersTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.defaultSortBy).toBe("firstName")
  })
})

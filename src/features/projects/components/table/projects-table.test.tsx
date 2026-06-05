import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import CreateProject from "@/features/projects/components/actions/create-project"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import ProjectsTable from "./projects-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      projects: [
        { id: "project-1", name: "Apollo Migration" },
        { id: "project-2", name: "Internal Tool" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/projects/components/actions/create-project", () => ({
  default: vi.fn(({ children }) => <>{children}</>),
}))

vi.mock("@/hooks/use-table-url-state", () => ({
  useTableUrlState: vi.fn(),
}))

vi.mock("@/hooks/use-processed-data", () => ({
  useProcessedData: vi.fn(),
}))

describe("ProjectsTable", () => {
  const mockUpdateParams = vi.fn()

  const mockProjects = [
    { id: "project-1", name: "Apollo Migration" },
    { id: "project-2", name: "Internal Tool" },
  ] as unknown as TableProjects[]

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
      paginatedData: mockProjects,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should pass correct props to DataTable and render create button when admin", () => {
    render(<ProjectsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")

    props.onSearchChangeAction?.("new-search")

    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    expect(vi.mocked(CreateProject)).toHaveBeenCalled()
  })

  it("should not render CreateProject when not admin", () => {
    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: false,
    } as unknown as ReturnType<typeof usePermissions>)

    render(<ProjectsTable />)

    expect(vi.mocked(CreateProject)).not.toHaveBeenCalled()
  })

  it("should pass projects from query to useProcessedData", () => {
    render(<ProjectsTable />)

    const processedDataArgs = vi.mocked(useProcessedData).mock.calls[0][0]

    expect(processedDataArgs.data).toEqual(mockProjects)
  })

  it("should pass paginated data and totalCount to DataTable", () => {
    render(<ProjectsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.data).toEqual(mockProjects)
    expect(props.totalCount).toBe(2)
  })
})

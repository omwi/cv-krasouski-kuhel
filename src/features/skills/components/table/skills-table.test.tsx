import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import CreateSkill from "@/features/skills/components/actions/create-skill"
import { TableSkill } from "@/features/skills/components/table/skills-table-columns"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import SkillsTable from "./skills-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      skills: [
        { id: "skill-1", name: "TypeScript" },
        { id: "skill-2", name: "React" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/skills/components/actions/create-skill", () => ({
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

describe("SkillsTable", () => {
  const mockUpdateParams = vi.fn()

  const mockSkills = [
    { id: "skill-1", name: "TypeScript" },
    { id: "skill-2", name: "React" },
  ] as unknown as TableSkill[]

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
      paginatedData: mockSkills,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should pass correct props to DataTable and render create button when admin", () => {
    render(<SkillsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")

    props.onSearchChangeAction?.("new-search")
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    expect(vi.mocked(CreateSkill)).toHaveBeenCalled()
  })

  it("should not render CreateSkill when not admin", () => {
    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: false,
    } as unknown as ReturnType<typeof usePermissions>)

    render(<SkillsTable />)

    expect(vi.mocked(CreateSkill)).not.toHaveBeenCalled()
  })

  it("should pass skills from query to useProcessedData", () => {
    render(<SkillsTable />)

    const args = vi.mocked(useProcessedData).mock.calls[0][0]

    expect(args.data).toEqual(mockSkills)
  })

  it("should pass paginated data and totalCount to DataTable", () => {
    render(<SkillsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.data).toEqual(mockSkills)
    expect(props.totalCount).toBe(2)
  })

  it("should pass defaultSortBy to DataTable", () => {
    render(<SkillsTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]

    expect(props.defaultSortBy).toBe("name")
  })
})

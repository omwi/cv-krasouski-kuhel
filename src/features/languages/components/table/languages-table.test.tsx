import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import CreateLanguage from "@/features/languages/components/actions/create-language"
import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import LanguagesTable from "./languages-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      languages: [
        { id: "lang-1", name: "English" },
        { id: "lang-2", name: "French" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/languages/components/actions/create-language", () => ({
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

describe("LanguagesTable", () => {
  const mockUpdateParams = vi.fn()

  const mockLanguages = [
    { id: "lang-1", name: "English" },
    { id: "lang-2", name: "French" },
  ] as unknown as TableLanguages[]

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
      paginatedData: mockLanguages,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should pass correct props to DataTable and render create button when admin", () => {
    render(<LanguagesTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")

    props.onSearchChangeAction?.("new-search")
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    expect(vi.mocked(CreateLanguage)).toHaveBeenCalled()
  })

  it("should not render CreateLanguage when not admin", () => {
    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: false,
    } as unknown as ReturnType<typeof usePermissions>)

    render(<LanguagesTable />)

    expect(vi.mocked(CreateLanguage)).not.toHaveBeenCalled()
  })

  it("should pass languages from query to useProcessedData", () => {
    render(<LanguagesTable />)

    const processedDataArgs = vi.mocked(useProcessedData).mock.calls[0][0]
    expect(processedDataArgs.data).toEqual(mockLanguages)
  })

  it("should pass paginated data and totalCount to DataTable", () => {
    render(<LanguagesTable />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.data).toEqual(mockLanguages)
    expect(props.totalCount).toBe(2)
  })
})

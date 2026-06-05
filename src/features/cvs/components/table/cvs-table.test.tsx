import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import CreateCv from "@/features/cvs/components/actions/create-cv"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { Cv } from "@/types/graphql-types"

import { mockTableUrlStateReturn } from "../cv-test-helpers"
import CvsTable from "./cvs-table"

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/cvs/components/actions/create-cv", () => ({
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

describe("CvsTable", () => {
  const mockUpdateParams = vi.fn()
  const mockCanCreateCv = vi.fn()

  const mockCvs = [
    { id: "cv-1", name: "CV 1", user: { id: "user-1" } },
    { id: "cv-2", name: "CV 2", user: null },
  ] as unknown as Cv[]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useTableUrlState).mockReturnValue(
      mockTableUrlStateReturn(mockUpdateParams) as ReturnType<
        typeof useTableUrlState
      >
    )

    vi.mocked(useProcessedData).mockReturnValue({
      paginatedData: mockCvs,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      currentUserId: "user-1",
      canCreateCv: mockCanCreateCv,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should pass correct props to DataTable and show create button if permission granted", () => {
    mockCanCreateCv.mockReturnValue(true)

    render(<CvsTable cvs={mockCvs} userId="user-target" />)

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")

    // Search callback
    props.onSearchChangeAction?.("new-search")
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    // Create button is rendered (actions slot is rendered by mock)
    expect(vi.mocked(CreateCv).mock.calls[0][0]).toEqual(
      expect.objectContaining({ userId: "user-target" })
    )
  })

  it("should not render CreateCv if permission is denied", () => {
    mockCanCreateCv.mockReturnValue(false)

    render(<CvsTable cvs={mockCvs} userId="user-target" />)

    expect(CreateCv).not.toHaveBeenCalled()
  })

  it("should define a hoistPredicate prioritizing current user's CVs", () => {
    mockCanCreateCv.mockReturnValue(true)
    render(<CvsTable cvs={mockCvs} />)

    const hoistPredicate =
      vi.mocked(useProcessedData).mock.calls[0][0].hoistPredicate
    expect(hoistPredicate).toBeDefined()

    expect(hoistPredicate!({ id: "cv-1", user: { id: "user-1" } } as Cv)).toBe(
      true
    )
    expect(hoistPredicate!({ id: "cv-2", user: { id: "user-2" } } as Cv)).toBe(
      false
    )
    expect(hoistPredicate!({ id: "cv-3", user: null } as Cv)).toBe(false)
  })
})

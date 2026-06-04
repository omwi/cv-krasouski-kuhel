import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { Cv } from "@/types/graphql-types"

import CvsTable from "./cvs-table"

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(
    ({ actions, totalText, searchValue, onSearchChangeAction }) => (
      <div data-testid="data-table">
        <span data-testid="total-text">{totalText}</span>
        <span data-testid="search-value">{searchValue}</span>
        <button
          data-testid="search-btn"
          onClick={() => onSearchChangeAction("new-search")}
        />
        <div data-testid="table-actions">{actions}</div>
      </div>
    )
  ),
}))

vi.mock("@/features/cvs/components/actions/create-cv", () => ({
  default: vi.fn(({ children, userId }) => (
    <div data-testid="create-cv-trigger" data-user-id={userId}>
      {children}
    </div>
  )),
}))

vi.mock("@/hooks/use-table-url-state", () => ({
  useTableUrlState: vi.fn(),
}))

vi.mock("@/hooks/use-processed-data", () => ({
  useProcessedData: vi.fn(),
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

    vi.mocked(useTableUrlState).mockReturnValue({
      params: {
        search: "test-query",
        sortBy: "name",
        sortOrder: "asc",
        page: 1,
        perPage: 10,
      },
      updateParams: mockUpdateParams,
    })

    vi.mocked(useProcessedData).mockReturnValue({
      paginatedData: mockCvs,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      currentUserId: "user-1",
      canCreateCv: mockCanCreateCv,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should render DataTable with correct props and create button if permission is granted", () => {
    mockCanCreateCv.mockReturnValue(true)

    render(<CvsTable cvs={mockCvs} userId="user-target" />)

    expect(screen.getByTestId("data-table")).toBeInTheDocument()
    expect(screen.getByTestId("total-text")).toHaveTextContent("total") // from useT mock returning key
    expect(screen.getByTestId("search-value")).toHaveTextContent("test-query")

    // Verify search action triggers updateParams
    screen.getByTestId("search-btn").click()
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    // Verify Create button is visible
    expect(screen.getByTestId("create-cv-trigger")).toBeInTheDocument()
    expect(screen.getByTestId("create-cv-trigger")).toHaveAttribute(
      "data-user-id",
      "user-target"
    )
    expect(screen.getByText("cvs-table.create")).toBeInTheDocument()
  })

  it("should hide create button if permission is denied", () => {
    mockCanCreateCv.mockReturnValue(false)

    render(<CvsTable cvs={mockCvs} userId="user-target" />)

    expect(screen.queryByTestId("create-cv-trigger")).not.toBeInTheDocument()
  })

  it("should define a hoistPredicate prioritizing current user's CVs", () => {
    mockCanCreateCv.mockReturnValue(true)

    render(<CvsTable cvs={mockCvs} />)

    // Retrieve the hoistPredicate callback passed to useProcessedData
    const useProcessedDataCalls = vi.mocked(useProcessedData).mock.calls
    const hoistPredicate = useProcessedDataCalls[0][0].hoistPredicate
    expect(hoistPredicate).toBeDefined()

    // Test cases for hoistPredicate
    // 1. Current user's CV
    const ownCv = { id: "cv-1", user: { id: "user-1" } } as Cv
    expect(hoistPredicate!(ownCv)).toBe(true)

    // 2. Other user's CV
    const otherCv = { id: "cv-2", user: { id: "user-2" } } as Cv
    expect(hoistPredicate!(otherCv)).toBe(false)

    // 3. CV without user
    const nullUserCv = { id: "cv-3", user: null } as Cv
    expect(hoistPredicate!(nullUserCv)).toBe(false)
  })
})

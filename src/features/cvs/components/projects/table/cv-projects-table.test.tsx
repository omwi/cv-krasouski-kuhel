import { useSuspenseQuery } from "@apollo/client/react"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import CvProjectsTable from "./cv-projects-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(
    ({
      actions,
      totalText,
      searchValue,
      onSearchChangeAction,
      renderSubRow,
    }) => (
      <div data-testid="data-table">
        <span data-testid="total-text">{totalText}</span>
        <span data-testid="search-value">{searchValue}</span>
        <button
          data-testid="search-btn"
          onClick={() => onSearchChangeAction("new-search")}
        />
        <div data-testid="table-actions">{actions}</div>
        <div data-testid="subrow-rendered">
          {renderSubRow ? "has-subrow" : "no-subrow"}
        </div>
      </div>
    )
  ),
}))

vi.mock("@/features/cvs/components/projects/actions/add-cv-project", () => ({
  default: vi.fn(({ children, cvUserId }) => (
    <div data-testid="add-cv-project-trigger" data-user-id={cvUserId.user?.id}>
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

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(),
}))

vi.mock("./cv-projects-columns", () => ({
  getColumns: vi.fn(() => [{ id: "name", titleKey: "col" }]),
  renderResponsibilitiesRow: vi.fn(() => <div />),
}))

describe("CvProjectsTable", () => {
  const mockUpdateParams = vi.fn()
  const mockCanUpdateCv = vi.fn()

  const mockCvData = {
    id: "cv-123",
    user: { id: "user-456" },
    projects: [
      { id: "proj-1", name: "Project 1" },
      { id: "proj-2", name: "Project 2" },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: { cv: mockCvData },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

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
      paginatedData: mockCvData.projects,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      canUpdateCv: mockCanUpdateCv,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should render DataTable with project columns and add button if update permission is granted", () => {
    mockCanUpdateCv.mockReturnValue(true)

    render(<CvProjectsTable cvId="cv-123" />)

    expect(useSuspenseQuery).toHaveBeenCalledWith(GET_CV_PROJECTS, {
      variables: { cvId: "cv-123" },
    })

    expect(screen.getByTestId("data-table")).toBeInTheDocument()
    expect(screen.getByTestId("total-text")).toHaveTextContent("total")
    expect(screen.getByTestId("search-value")).toHaveTextContent("test-query")
    expect(screen.getByTestId("subrow-rendered")).toHaveTextContent(
      "has-subrow"
    )

    // Search callback
    screen.getByTestId("search-btn").click()
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    // Add projects action button rendering
    expect(screen.getByTestId("add-cv-project-trigger")).toBeInTheDocument()
    expect(screen.getByTestId("add-cv-project-trigger")).toHaveAttribute(
      "data-user-id",
      "user-456"
    )
    expect(screen.getByText("projects-table.create")).toBeInTheDocument()
  })

  it("should hide add button if update permission is denied", () => {
    mockCanUpdateCv.mockReturnValue(false)

    render(<CvProjectsTable cvId="cv-123" />)

    expect(
      screen.queryByTestId("add-cv-project-trigger")
    ).not.toBeInTheDocument()
  })

  it("should fallback to empty array if cv projects is null", () => {
    mockCanUpdateCv.mockReturnValue(true)

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        cv: {
          id: "cv-123",
          user: { id: "user-456" },
          projects: null,
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(<CvProjectsTable cvId="cv-123" />)

    expect(useProcessedData).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [],
      })
    )
  })
})

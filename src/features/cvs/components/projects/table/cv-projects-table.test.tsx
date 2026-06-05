import { useSuspenseQuery } from "@apollo/client/react"
import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTable } from "@/components/shared/data-table/data-table"
import AddCvProject from "@/features/cvs/components/projects/actions/add-cv-project"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

import { mockTableUrlStateReturn } from "../../cv-test-helpers"
import CvProjectsTable from "./cv-projects-table"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/components/shared/data-table/data-table", () => ({
  DataTable: vi.fn(({ actions }: { actions?: React.ReactNode }) => (
    <>{actions}</>
  )),
}))

vi.mock("@/features/cvs/components/projects/actions/add-cv-project", () => ({
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

    vi.mocked(useTableUrlState).mockReturnValue(
      mockTableUrlStateReturn(mockUpdateParams) as ReturnType<
        typeof useTableUrlState
      >
    )

    vi.mocked(useProcessedData).mockReturnValue({
      paginatedData: mockCvData.projects,
      totalCount: 2,
    })

    vi.mocked(usePermissions).mockReturnValue({
      canUpdateCv: mockCanUpdateCv,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should query GET_CV_PROJECTS and pass correct props to DataTable", () => {
    mockCanUpdateCv.mockReturnValue(true)

    render(<CvProjectsTable cvId="cv-123" />)

    expect(useSuspenseQuery).toHaveBeenCalledWith(GET_CV_PROJECTS, {
      variables: { cvId: "cv-123" },
    })

    const props = vi.mocked(DataTable).mock.calls[0][0]
    expect(props.totalText).toContain("total")
    expect(props.searchValue).toBe("test-query")
    expect(props.renderSubRow).toBeDefined()

    props.onSearchChangeAction?.("new-search")
    expect(mockUpdateParams).toHaveBeenCalledWith({ search: "new-search" })

    // Add button is rendered (actions slot)
    expect(vi.mocked(AddCvProject).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        cvUserId: expect.objectContaining({ user: { id: "user-456" } }),
      })
    )
  })

  it("should not render AddCvProject if update permission is denied", () => {
    mockCanUpdateCv.mockReturnValue(false)

    render(<CvProjectsTable cvId="cv-123" />)

    expect(AddCvProject).not.toHaveBeenCalled()
  })

  it("should fallback to empty array if cv projects is null", () => {
    mockCanUpdateCv.mockReturnValue(true)

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        cv: { id: "cv-123", user: { id: "user-456" }, projects: null },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(<CvProjectsTable cvId="cv-123" />)

    expect(useProcessedData).toHaveBeenCalledWith(
      expect.objectContaining({ data: [] })
    )
  })
})

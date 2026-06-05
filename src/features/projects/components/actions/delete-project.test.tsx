import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableProjects } from "@/features/projects/components/table/projects-table-columns"

import DeleteProject from "./delete-project"

const mockMutateDelete = vi.fn()
let capturedMutationOptions: { update?: (cache: object) => void } = {}

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn((_mutation, options) => {
    capturedMutationOptions = options
    return [mockMutateDelete]
  }),
}))

describe("DeleteProject Component", () => {
  const mockProject: TableProjects = {
    __typename: "Project",
    id: "project-42",
    name: "Apollo Migration",
  } as unknown as TableProjects

  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    capturedMutationOptions = {}
    mockMutateDelete.mockResolvedValue({})
  })

  it("should render DeleteDialog with the project name", () => {
    render(
      <DeleteProject
        project={mockProject}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("delete-entity")).toHaveTextContent(
      "Apollo Migration"
    )
  })

  it("should call mutateDelete with correct variables when confirmed", () => {
    render(
      <DeleteProject
        project={mockProject}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-confirm"))

    expect(mockMutateDelete).toHaveBeenCalledWith({
      variables: {
        project: { projectId: "project-42" },
      },
    })
  })

  it("should call onOpenChange(false) when close button is clicked", () => {
    render(
      <DeleteProject
        project={mockProject}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-close"))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("should evict the project from Apollo cache after deletion", () => {
    const mockEvict = vi.fn()
    const mockGc = vi.fn()
    const mockIdentify = vi.fn(() => "Project:project-42")
    const mockCache = {
      evict: mockEvict,
      gc: mockGc,
      identify: mockIdentify,
    }

    render(
      <DeleteProject
        project={mockProject}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    capturedMutationOptions.update!(mockCache)

    expect(mockIdentify).toHaveBeenCalledWith({
      __typename: "Project",
      id: "project-42",
    })
    expect(mockEvict).toHaveBeenCalledWith({ id: "Project:project-42" })
    expect(mockGc).toHaveBeenCalled()
  })

  it("should not render dialog content when open=false", () => {
    render(
      <DeleteProject
        project={mockProject}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.queryByTestId("delete-dialog")).toBeNull()
  })
})

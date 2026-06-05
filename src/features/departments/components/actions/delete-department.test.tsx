import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"

import DeleteDepartment from "./delete-department"

const mockMutateDelete = vi.fn()
let capturedMutationOptions: { update?: (cache: object) => void } = {}

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn((_mutation, options) => {
    capturedMutationOptions = options
    return [mockMutateDelete]
  }),
}))

describe("DeleteDepartment Component", () => {
  const mockDepartment: TableDepartment = {
    __typename: "Department",
    id: "dept-42",
    name: "Engineering",
  } as unknown as TableDepartment

  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    capturedMutationOptions = {}
    mockMutateDelete.mockResolvedValue({})
  })

  it("should render DeleteDialog with the department name", () => {
    render(
      <DeleteDepartment
        department={mockDepartment}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("delete-entity")).toHaveTextContent("Engineering")
  })

  it("should call mutateDelete with correct variables when confirmed", async () => {
    render(
      <DeleteDepartment
        department={mockDepartment}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-confirm"))

    expect(mockMutateDelete).toHaveBeenCalledWith({
      variables: {
        department: { departmentId: "dept-42" },
      },
    })
  })

  it("should call onOpenChange(false) when close button is clicked", () => {
    render(
      <DeleteDepartment
        department={mockDepartment}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-close"))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("should evict the department from Apollo cache after deletion", () => {
    const mockEvict = vi.fn()
    const mockGc = vi.fn()
    const mockIdentify = vi.fn(() => "Department:dept-42")
    const mockCache = {
      evict: mockEvict,
      gc: mockGc,
      identify: mockIdentify,
    }

    render(
      <DeleteDepartment
        department={mockDepartment}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    capturedMutationOptions.update!(mockCache)

    expect(mockIdentify).toHaveBeenCalledWith({
      __typename: "Department",
      id: "dept-42",
    })
    expect(mockEvict).toHaveBeenCalledWith({ id: "Department:dept-42" })
    expect(mockGc).toHaveBeenCalled()
  })

  it("should not render dialog content when open=false", () => {
    render(
      <DeleteDepartment
        department={mockDepartment}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.queryByTestId("delete-dialog")).toBeNull()
  })
})

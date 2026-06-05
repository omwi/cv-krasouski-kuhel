import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TablePosition } from "@/features/positions/components/table/positions-table-columns"

import DeletePosition from "./delete-position"

const mockMutateDelete = vi.fn()
let capturedMutationOptions: { update?: (cache: object) => void } = {}

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn((_mutation, options) => {
    capturedMutationOptions = options
    return [mockMutateDelete]
  }),
}))

describe("DeletePosition Component", () => {
  const mockPosition: TablePosition = {
    __typename: "Position",
    id: "pos-42",
    name: "Software Engineer",
  } as unknown as TablePosition

  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    capturedMutationOptions = {}
    mockMutateDelete.mockResolvedValue({})
  })

  it("should render DeleteDialog with the position name", () => {
    render(
      <DeletePosition
        position={mockPosition}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("delete-entity")).toHaveTextContent(
      "Software Engineer"
    )
  })

  it("should call mutateDelete with correct variables when confirmed", async () => {
    render(
      <DeletePosition
        position={mockPosition}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-confirm"))

    expect(mockMutateDelete).toHaveBeenCalledWith({
      variables: {
        position: { positionId: "pos-42" },
      },
    })
  })

  it("should call onOpenChange(false) when close button is clicked", () => {
    render(
      <DeletePosition
        position={mockPosition}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-close"))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("should evict the position from Apollo cache after deletion", () => {
    const mockEvict = vi.fn()
    const mockGc = vi.fn()
    const mockIdentify = vi.fn(() => "Position:pos-42")
    const mockCache = {
      evict: mockEvict,
      gc: mockGc,
      identify: mockIdentify,
    }

    render(
      <DeletePosition
        position={mockPosition}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    capturedMutationOptions.update!(mockCache)

    expect(mockIdentify).toHaveBeenCalledWith({
      __typename: "Position",
      id: "pos-42",
    })
    expect(mockEvict).toHaveBeenCalledWith({ id: "Position:pos-42" })
    expect(mockGc).toHaveBeenCalled()
  })

  it("should not render dialog content when open=false", () => {
    render(
      <DeletePosition
        position={mockPosition}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.queryByTestId("delete-dialog")).toBeNull()
  })
})

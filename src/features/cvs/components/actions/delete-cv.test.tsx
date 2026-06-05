import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useDeleteCv } from "@/features/cvs/hooks/use-delete-cv"
import { Cv } from "@/types/graphql-types"

import DeleteCv from "./delete-cv"

vi.mock("@/features/cvs/hooks/use-delete-cv", () => ({
  useDeleteCv: vi.fn(),
}))

vi.mock("@/components/shared/dialog/delete-dialog")

describe("DeleteCv Component", () => {
  const mockCv = {
    id: "cv-123",
    name: "My Awesome CV",
  } as Cv

  const mockHandleDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDeleteCv).mockReturnValue({
      handleDelete: mockHandleDelete,
      loading: false,
    } as unknown as ReturnType<typeof useDeleteCv>)
  })

  it("should render DeleteDialog with CV name and call handleDelete on confirm", () => {
    const mockOnOpenChange = vi.fn()

    render(<DeleteCv cv={mockCv} open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("delete-entity")).toHaveTextContent(
      "My Awesome CV"
    )

    // Click confirm
    fireEvent.click(screen.getByTestId("delete-confirm"))
    expect(mockHandleDelete).toHaveBeenCalled()

    // Click close
    fireEvent.click(screen.getByTestId("delete-close"))
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})

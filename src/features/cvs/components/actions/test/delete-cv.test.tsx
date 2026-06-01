import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Cv } from "@/types/graphql-types"

import { useDeleteCv } from "../../../hooks/use-delete-cv"
import DeleteCv from "../delete-cv"

// Mock useDeleteCv hook
vi.mock("../../../hooks/use-delete-cv", () => ({
  useDeleteCv: vi.fn(),
}))

// Mock DeleteDialog
vi.mock("@/components/shared/dialog/delete-dialog", () => ({
  DeleteDialog: ({
    open,
    entityName,
    onConfirm,
  }: {
    open: boolean
    entityName: string
    onConfirm: () => void
  }) =>
    open ? (
      <div data-testid="delete-dialog">
        <span data-testid="entity-name">{entityName}</span>
        <button data-testid="confirm-btn" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    ) : null,
}))

const mockCv: Cv = {
  __typename: "Cv",
  id: "cv-456",
  name: "MIT CV to delete",
  description: "Description",
  education: "Education",
  user: {
    __typename: "User",
    id: "user-123",
    email: "user@example.com",
  },
}

describe("DeleteCv Component", () => {
  it("should render DeleteDialog with the correct entity name and trigger handleDelete on confirm", () => {
    const mockHandleDelete = vi.fn()
    vi.mocked(useDeleteCv).mockReturnValue({
      handleDelete: mockHandleDelete,
    })

    const { rerender } = render(
      <DeleteCv cv={mockCv} open={false} onOpenChange={vi.fn()} />
    )
    expect(screen.queryByTestId("delete-dialog")).toBeNull()

    rerender(<DeleteCv cv={mockCv} open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("entity-name")).toHaveTextContent(
      "MIT CV to delete"
    )

    fireEvent.click(screen.getByTestId("confirm-btn"))
    expect(mockHandleDelete).toHaveBeenCalled()
  })
})

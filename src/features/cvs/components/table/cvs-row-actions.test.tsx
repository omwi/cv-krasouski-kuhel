import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteCv from "@/features/cvs/components/actions/delete-cv"
import UpdateCv from "@/features/cvs/components/actions/update-cv"
import { Cv } from "@/types/graphql-types"

import CvsRowActions from "./cvs-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <div data-testid="entity-row-actions">
      <div data-testid="edit-modal">
        {renderEditModal({ entity, open: true, onOpenChange: vi.fn() })}
      </div>
      <div data-testid="delete-modal">
        {renderDeleteModal({ entity, open: true, onOpenChange: vi.fn() })}
      </div>
    </div>
  )),
}))

vi.mock("@/features/cvs/components/actions/update-cv", () => ({
  default: vi.fn(() => <div data-testid="update-cv" />),
}))

vi.mock("@/features/cvs/components/actions/delete-cv", () => ({
  default: vi.fn(() => <div data-testid="delete-cv" />),
}))

describe("CvsRowActions Component", () => {
  it("should configure EntityRowActions correctly", () => {
    const mockCv = {
      __typename: "Cv",
      id: "cv-123",
      name: "John Doe CV",
      description: "My CV",
      education: "University",
      user: {
        __typename: "User",
        id: "user-456",
        email: "john@example.com",
      },
    } as unknown as Cv

    render(<CvsRowActions cv={mockCv} />)

    expect(EntityRowActions).toHaveBeenCalled()
    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockCv,
        entityType: "cvs",
        entityId: "cv-123",
        ownerId: "user-456",
        viewLink: "/cvs/cv-123",
      })
    )

    expect(screen.getByTestId("update-cv")).toBeInTheDocument()
    expect(UpdateCv).toHaveBeenCalled()
    expect(vi.mocked(UpdateCv).mock.calls[0][0]).toEqual(
      expect.objectContaining({ cv: mockCv })
    )

    expect(screen.getByTestId("delete-cv")).toBeInTheDocument()
    expect(DeleteCv).toHaveBeenCalled()
    expect(vi.mocked(DeleteCv).mock.calls[0][0]).toEqual(
      expect.objectContaining({ cv: mockCv })
    )
  })
})

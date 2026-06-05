import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteCv from "@/features/cvs/components/actions/delete-cv"
import UpdateCv from "@/features/cvs/components/actions/update-cv"
import { Cv } from "@/types/graphql-types"

import CvsRowActions from "./cvs-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/cvs/components/actions/update-cv", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/cvs/components/actions/delete-cv", () => ({
  default: vi.fn(() => <span />),
}))

describe("CvsRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props to Update/Delete dialogs", () => {
    const mockCv = {
      __typename: "Cv",
      id: "cv-123",
      name: "John Doe CV",
      description: "My CV",
      education: "University",
      user: { __typename: "User", id: "user-456", email: "john@example.com" },
    } as unknown as Cv

    render(<CvsRowActions cv={mockCv} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockCv,
        entityType: "cvs",
        entityId: "cv-123",
        ownerId: "user-456",
        viewLink: "/cvs/cv-123",
      })
    )

    expect(vi.mocked(UpdateCv).mock.calls[0][0]).toEqual(
      expect.objectContaining({ cv: mockCv })
    )

    expect(vi.mocked(DeleteCv).mock.calls[0][0]).toEqual(
      expect.objectContaining({ cv: mockCv })
    )
  })
})

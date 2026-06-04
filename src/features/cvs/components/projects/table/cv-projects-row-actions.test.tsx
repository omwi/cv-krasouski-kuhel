import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import RemoveCvProject from "@/features/cvs/components/projects/actions/remove-cv-project"
import UpdateCvProject from "@/features/cvs/components/projects/actions/update-cv-project"
import { CvProject, CvUserId } from "@/types/graphql-types"

import CvProjectsRowActions from "./cv-projects-row-actions"

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

vi.mock("@/features/cvs/components/projects/actions/update-cv-project", () => ({
  default: vi.fn(() => <div data-testid="update-cv-project" />),
}))

vi.mock("@/features/cvs/components/projects/actions/remove-cv-project", () => ({
  default: vi.fn(() => <div data-testid="remove-cv-project" />),
}))

describe("CvProjectsRowActions Component", () => {
  it("should configure EntityRowActions correctly", () => {
    const mockProject = {
      __typename: "CvProject",
      id: "proj-123",
      name: "Alpha Migration",
    } as unknown as CvProject

    const mockCvUserId = {
      id: "cv-456",
      user: { id: "user-789", email: "user@example.com" },
    } as unknown as CvUserId

    render(
      <CvProjectsRowActions project={mockProject} cvUserId={mockCvUserId} />
    )

    expect(EntityRowActions).toHaveBeenCalled()
    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockProject,
        entityType: "cv-projects",
        entityId: "proj-123",
        ownerId: "user-789",
      })
    )

    expect(screen.getByTestId("update-cv-project")).toBeInTheDocument()
    expect(UpdateCvProject).toHaveBeenCalled()
    expect(vi.mocked(UpdateCvProject).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        cvProject: mockProject,
        cvUserId: mockCvUserId,
      })
    )

    expect(screen.getByTestId("remove-cv-project")).toBeInTheDocument()
    expect(RemoveCvProject).toHaveBeenCalled()
    expect(vi.mocked(RemoveCvProject).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        cvProject: mockProject,
        cvUserId: mockCvUserId,
      })
    )
  })
})

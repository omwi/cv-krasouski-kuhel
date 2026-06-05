import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import RemoveCvProject from "@/features/cvs/components/projects/actions/remove-cv-project"
import UpdateCvProject from "@/features/cvs/components/projects/actions/update-cv-project"
import { CvProject, CvUserId } from "@/types/graphql-types"

import CvProjectsRowActions from "./cv-projects-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/cvs/components/projects/actions/update-cv-project", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/cvs/components/projects/actions/remove-cv-project", () => ({
  default: vi.fn(() => <span />),
}))

describe("CvProjectsRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props to Update/Remove dialogs", () => {
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

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockProject,
        entityType: "cv-projects",
        entityId: "proj-123",
        ownerId: "user-789",
      })
    )

    expect(vi.mocked(UpdateCvProject).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        cvProject: mockProject,
        cvUserId: mockCvUserId,
      })
    )

    expect(vi.mocked(RemoveCvProject).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        cvProject: mockProject,
        cvUserId: mockCvUserId,
      })
    )
  })
})

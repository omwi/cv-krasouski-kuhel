import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteProject from "@/features/projects/components/actions/delete-project"
import UpdateProject from "@/features/projects/components/actions/update-project"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"

import ProjectsRowActions from "./projects-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/projects/components/actions/update-project", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/projects/components/actions/delete-project", () => ({
  default: vi.fn(() => <span />),
}))

describe("ProjectsRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props to Update/Delete dialogs", () => {
    const mockProject = {
      __typename: "Project",
      id: "project-123",
      name: "Apollo Migration",
    } as unknown as TableProjects

    render(<ProjectsRowActions project={mockProject} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockProject,
        entityType: "projects",
        entityId: "project-123",
        viewLink: paths.projects.details.get("project-123"),
      })
    )

    expect(vi.mocked(UpdateProject).mock.calls[0][0]).toEqual(
      expect.objectContaining({ project: mockProject })
    )

    expect(vi.mocked(DeleteProject).mock.calls[0][0]).toEqual(
      expect.objectContaining({ project: mockProject })
    )
  })

  it("should coerce numeric project id to string for entityId", () => {
    const mockProject = {
      __typename: "Project",
      id: 99,
      name: "Internal Tool",
    } as unknown as TableProjects

    vi.mocked(EntityRowActions).mockClear()

    render(<ProjectsRowActions project={mockProject} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0].entityId).toBe("99")
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"

import { EntityRowActions } from "./entity-row-actions"

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(),
}))

const mockUsePermissions = vi.mocked(usePermissions)

type MockPermissionsReturn = ReturnType<typeof usePermissions>

type TestEntity = { id: string; name: string }

describe("EntityRowActions", () => {
  const defaultPermissions: MockPermissionsReturn = {
    currentUserId: "user-123",
    isAdmin: false,
    canCreateUser: () => false,
    canUpdateUser: () => false,
    canDeleteUser: () => false,
    canCreateCv: () => false,
    canUpdateCv: () => false,
    canDeleteCv: () => false,
  }

  const mockEntity: TestEntity = { id: "1", name: "Test Entity" }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render nothing when no user is logged in", () => {
    mockUsePermissions.mockReturnValue({
      ...defaultPermissions,
      currentUserId: null,
    })

    const { container } = render(
      <EntityRowActions
        entity={mockEntity}
        entityType="user"
        entityId="1"
        viewLink="/users/1"
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should render nothing when the user lacks all permissions for the entity", () => {
    mockUsePermissions.mockReturnValue({
      ...defaultPermissions,
      isAdmin: false,
    })

    const { container } = render(
      <EntityRowActions
        entity={mockEntity}
        entityType="departments"
        entityId="dept-1"
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should render a single view link button when only the view action is available", () => {
    mockUsePermissions.mockReturnValue(defaultPermissions)

    render(
      <EntityRowActions
        entity={mockEntity}
        entityType="user"
        entityId="2"
        viewLink="/users/2"
      />
    )

    const viewLink = screen.getByRole("link")
    expect(viewLink).toBeInTheDocument()
    expect(viewLink).toHaveAttribute("href", "/users/2")

    expect(
      screen.queryByLabelText(/control-actions.aria-label/)
    ).not.toBeInTheDocument()
  })

  it("should render an action popover and correctly toggle modals when multiple actions are available", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })

    mockUsePermissions.mockReturnValue({
      ...defaultPermissions,
      isAdmin: true,
    })

    const renderEditModal = vi.fn(({ open }) =>
      open ? <div data-testid="edit-modal">Edit Modal</div> : null
    )
    const renderDeleteModal = vi.fn(({ open }) =>
      open ? <div data-testid="delete-modal">Delete Modal</div> : null
    )

    render(
      <EntityRowActions
        entity={mockEntity}
        entityType="projects"
        entityId="proj-1"
        viewLink="/projects/1"
        renderEditModal={renderEditModal}
        renderDeleteModal={renderDeleteModal}
      />
    )

    const triggerBtn = screen.getByLabelText(
      "projects-table.control-actions.aria-label"
    )
    expect(triggerBtn).toBeInTheDocument()
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument()

    await user.click(triggerBtn)
    expect(
      screen.getByText("projects-table.control-actions.profile")
    ).toBeInTheDocument() // View action

    const editBtn = screen.getByText("projects-table.control-actions.update")
    await user.click(editBtn)
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument()
    expect(renderEditModal).toHaveBeenCalled()

    await user.click(triggerBtn)
    const deleteBtn = screen.getByText("projects-table.control-actions.delete")
    await user.click(deleteBtn)
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument()
    expect(renderDeleteModal).toHaveBeenCalled()
  })
})

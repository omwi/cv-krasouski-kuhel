import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteUser from "@/features/users/components/actions/delete-user"
import UpdateUser from "@/features/users/components/actions/update-user"
import { TableUser } from "@/features/users/components/user-table/users-table"

import { UserRowActions } from "./user-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/users/components/actions/update-user", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/users/components/actions/delete-user", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/config/paths", () => ({
  paths: {
    users: {
      details: {
        get: vi.fn((id: string) => `/users/${id}`),
      },
    },
  },
}))

describe("UserRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props", () => {
    const mockUser = {
      id: "user-1",
      name: "John Doe",
    } as unknown as TableUser

    render(<UserRowActions rowUser={mockUser} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockUser,
        entityType: "user",
        entityId: "user-1",
        viewLink: "/users/user-1",
      })
    )

    expect(vi.mocked(UpdateUser).mock.calls[0][0]).toEqual(
      expect.objectContaining({ user: mockUser })
    )

    expect(vi.mocked(DeleteUser).mock.calls[0][0]).toEqual(
      expect.objectContaining({ user: mockUser })
    )
  })
})

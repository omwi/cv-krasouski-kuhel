import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteDepartment from "@/features/departments/components/actions/delete-department"
import UpdateDepartment from "@/features/departments/components/actions/update-department"
import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"

import DepartmentsRowActions from "./departments-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/departments/components/actions/update-department", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/departments/components/actions/delete-department", () => ({
  default: vi.fn(() => <span />),
}))

describe("DepartmentsRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props to Update/Delete dialogs", () => {
    const mockDepartment = {
      __typename: "Department",
      id: "dept-123",
      name: "Engineering",
    } as unknown as TableDepartment

    render(<DepartmentsRowActions department={mockDepartment} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockDepartment,
        entityType: "departments",
        entityId: "dept-123",
      })
    )

    expect(vi.mocked(UpdateDepartment).mock.calls[0][0]).toEqual(
      expect.objectContaining({ department: mockDepartment })
    )

    expect(vi.mocked(DeleteDepartment).mock.calls[0][0]).toEqual(
      expect.objectContaining({ department: mockDepartment })
    )
  })

  it("should coerce numeric department id to string for entityId", () => {
    const mockDepartment = {
      __typename: "Department",
      id: 99,
      name: "Finance",
    } as unknown as TableDepartment

    vi.mocked(EntityRowActions).mockClear()

    render(<DepartmentsRowActions department={mockDepartment} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0].entityId).toBe("99")
  })
})

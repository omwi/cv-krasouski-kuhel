import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeletePosition from "@/features/positions/components/actions/delete-position"
import UpdatePosition from "@/features/positions/components/actions/update-position"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"

import PositionsRowActions from "./positions-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/positions/components/actions/update-position", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/positions/components/actions/delete-position", () => ({
  default: vi.fn(() => <span />),
}))

describe("PositionsRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props to Update/Delete dialogs", () => {
    const mockPosition = {
      __typename: "Position",
      id: "pos-123",
      name: "Software Engineer",
    } as unknown as TablePosition

    render(<PositionsRowActions position={mockPosition} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockPosition,
        entityType: "positions",
        entityId: "pos-123",
      })
    )

    expect(vi.mocked(UpdatePosition).mock.calls[0][0]).toEqual(
      expect.objectContaining({ position: mockPosition })
    )

    expect(vi.mocked(DeletePosition).mock.calls[0][0]).toEqual(
      expect.objectContaining({ position: mockPosition })
    )
  })

  it("should coerce numeric position id to string for entityId", () => {
    const mockPosition = {
      __typename: "Position",
      id: 99,
      name: "Designer",
    } as unknown as TablePosition

    vi.mocked(EntityRowActions).mockClear()

    render(<PositionsRowActions position={mockPosition} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0].entityId).toBe("99")
  })
})

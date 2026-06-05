import { vi } from "vitest"

/**
 * Standard DataTable mock — renders only the `actions` slot so Create/Add
 * buttons stay testable, while `totalText`, `searchValue` and callbacks are
 * verified via `mock.calls[0][0]`.
 */
export const createDataTableMock = () =>
  vi.fn(({ actions }: { actions?: React.ReactNode }) => <>{actions}</>)

/**
 * Standard EntityRowActions mock — immediately invokes `renderEditModal` and
 * `renderDeleteModal` so the rendered dialogs are available in the DOM.
 */
export const createEntityRowActionsMock = () =>
  vi.fn(
    ({
      renderEditModal,
      renderDeleteModal,
      entity,
    }: {
      renderEditModal?: (args: {
        entity: unknown
        open: boolean
        onOpenChange: (v: boolean) => void
      }) => React.ReactNode
      renderDeleteModal?: (args: {
        entity: unknown
        open: boolean
        onOpenChange: (v: boolean) => void
      }) => React.ReactNode
      entity: unknown
    }) => (
      <>
        {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
        {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      </>
    )
  )

/** Minimal stub for `useTableUrlState` */
export const mockTableUrlStateReturn = (updateParams = vi.fn()) => ({
  params: {
    search: "test-query",
    sortBy: "name",
    sortOrder: "asc" as const,
    page: 1,
    perPage: 10,
  },
  updateParams,
})

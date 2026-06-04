import React from "react"

export const DeleteDialog = ({
  open,
  entityName,
  onConfirm,
  onOpenChange,
}: {
  open?: boolean
  entityName?: string
  onConfirm?: () => void | Promise<void>
  onOpenChange?: (open: boolean) => void
}) => (
  <div>
    {open && (
      <div data-testid="delete-dialog">
        <span data-testid="delete-entity">{entityName}</span>
        <button data-testid="delete-confirm" onClick={onConfirm}>
          Confirm
        </button>
        <button
          data-testid="delete-close"
          onClick={() => onOpenChange?.(false)}
        >
          Close
        </button>
      </div>
    )}
  </div>
)

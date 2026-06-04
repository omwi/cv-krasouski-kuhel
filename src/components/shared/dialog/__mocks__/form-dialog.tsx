import React from "react"

export const FormDialog = ({
  children,
  title,
  submitLabel,
  onSubmit,
  trigger,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode
  title?: string
  submitLabel?: string
  onSubmit?: (e?: { preventDefault: () => void }) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => (
  <div>
    {trigger && (
      <div data-testid="dialog-trigger" onClick={() => onOpenChange?.(true)}>
        {trigger}
      </div>
    )}
    {open && (
      <form
        data-testid="form-dialog"
        onSubmit={(e) => {
          e?.preventDefault()
          onSubmit?.()
        }}
      >
        {title && <h2 data-testid="dialog-title">{title}</h2>}
        <button type="submit" data-testid="dialog-submit">
          {submitLabel}
        </button>
        {children}
      </form>
    )}
  </div>
)

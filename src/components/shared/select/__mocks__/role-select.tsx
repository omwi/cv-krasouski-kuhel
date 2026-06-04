import React from "react"

export const RoleSelect = ({
  value,
  onValueChangeAction,
  disabled,
}: {
  value?: string
  onValueChangeAction?: (val: string) => void
  disabled?: boolean
}) => (
  <select
    data-testid="role-select"
    value={value}
    onChange={(e) => onValueChangeAction?.(e.target.value)}
    disabled={disabled}
  >
    <option value="">Select role</option>
    <option value="Admin">Admin</option>
  </select>
)

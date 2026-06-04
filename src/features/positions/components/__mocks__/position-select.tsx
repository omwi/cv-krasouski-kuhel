import React from "react"

const PositionSelect = ({
  disabled,
  value,
  onValueChange,
}: {
  disabled?: boolean
  value?: string
  onValueChange?: (val: string) => void
}) => (
  <select
    data-testid="pos-select"
    disabled={disabled}
    value={value ?? "none"}
    onChange={(e) => onValueChange?.(e.target.value)}
  >
    <option value="">Select pos</option>
    <option value="none">None</option>
    <option value="pos-1">Pos 1</option>
  </select>
)

export default PositionSelect

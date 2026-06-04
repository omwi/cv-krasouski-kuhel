import React from "react"

const DepartmentSelect = ({
  disabled,
  value,
  onValueChange,
}: {
  disabled?: boolean
  value?: string
  onValueChange?: (val: string) => void
}) => (
  <select
    data-testid="dept-select"
    disabled={disabled}
    value={value ?? "none"}
    onChange={(e) => onValueChange?.(e.target.value)}
  >
    <option value="">Select dept</option>
    <option value="none">None</option>
    <option value="dept-1">Dept 1</option>
  </select>
)

export default DepartmentSelect

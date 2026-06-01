import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { useProfileUpdateForm } from "../../../hooks/profile/use-profile-update-form"
import ProfileUpdateForm from "../profile-update-form"

interface ProfileFormFields {
  firstName: string
  lastName: string
  departmentId: string
  positionId: string
}

// Mock custom hookuseProfileUpdateForm
vi.mock("../../../hooks/profile/use-profile-update-form", () => ({
  useProfileUpdateForm: vi.fn(),
}))

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

// Mock Subcomponents with correct props
vi.mock("@/features/departments/components/department-select", () => ({
  default: ({
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
      value={value || "none"}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      <option value="none">None</option>
      <option value="dept-1">Dept 1</option>
    </select>
  ),
}))

vi.mock("@/features/positions/components/position-select", () => ({
  default: ({
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
      value={value || "none"}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      <option value="none">None</option>
      <option value="pos-1">Pos 1</option>
    </select>
  ),
}))

// Helper Wrapper Component to instantiate real react-hook-form context
const TestWrapper = ({
  hasUpdatePermission,
  isDirty = false,
  onSubmitAction = vi.fn(),
}: {
  hasUpdatePermission: boolean
  isDirty?: boolean
  onSubmitAction?: () => void
}) => {
  const { register, control } = useForm<ProfileFormFields>({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      departmentId: "dept-1",
      positionId: "pos-1",
    },
  })

  vi.mocked(useProfileUpdateForm).mockReturnValue({
    onSubmit: (e) => {
      e?.preventDefault()
      onSubmitAction()
    },
    register,
    control,
    isDirty,
    isPending: false,
  })

  return (
    <ProfileUpdateForm userId="123" hasUpdatePermission={hasUpdatePermission} />
  )
}

describe("ProfileUpdateForm", () => {
  it("should render fields with readOnly and hide button if hasUpdatePermission is false", () => {
    render(<TestWrapper hasUpdatePermission={false} />)

    // Verify input fields are readOnly
    const firstNameInput = screen.getByLabelText("first-name")
    const lastNameInput = screen.getByLabelText("last-name")
    expect(firstNameInput).toHaveAttribute("readonly")
    expect(lastNameInput).toHaveAttribute("readonly")

    // Verify Select components are disabled
    expect(screen.getByTestId("dept-select")).toBeDisabled()
    expect(screen.getByTestId("pos-select")).toBeDisabled()

    // Verify submit button is hidden (has 'hidden' class)
    const button = screen.queryByRole("button", { name: "update" })
    expect(button).toHaveClass("hidden")
  })

  it("should render editable fields and show button if hasUpdatePermission is true", () => {
    const mockOnSubmit = vi.fn()

    render(
      <TestWrapper
        hasUpdatePermission={true}
        isDirty={true}
        onSubmitAction={mockOnSubmit}
      />
    )

    // Verify input fields are NOT readOnly
    const firstNameInput = screen.getByLabelText("first-name")
    const lastNameInput = screen.getByLabelText("last-name")
    expect(firstNameInput).not.toHaveAttribute("readonly")
    expect(lastNameInput).not.toHaveAttribute("readonly")

    // Verify Select components are active
    expect(screen.getByTestId("dept-select")).not.toBeDisabled()
    expect(screen.getByTestId("pos-select")).not.toBeDisabled()

    // Verify button is visible and active
    const button = screen.getByRole("button", { name: "update" })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()

    // Submit form
    fireEvent.submit(
      screen.getByRole("button", { name: "update" }).closest("form")!
    )
    expect(mockOnSubmit).toHaveBeenCalled()
  })
})

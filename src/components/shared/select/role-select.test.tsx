import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { RoleSelect } from "./role-select"

vi.unmock("./role-select")

const floatingSelectMock = vi.fn()

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({
    value,
    onValueChange,
    disabled,
    children,
  }: {
    value: string
    onValueChange: (value: string) => void
    disabled?: boolean
    children: React.ReactNode
  }) => {
    floatingSelectMock({
      value,
      onValueChange,
      disabled,
      children,
    })

    return (
      <div>
        <div data-testid="selected-value">{value}</div>
        <div data-testid="disabled-state">
          {disabled ? "disabled" : "enabled"}
        </div>
        <button
          type="button"
          onClick={() => onValueChange("Employee")}
          disabled={disabled}
        >
          change-role
        </button>
        {children}
      </div>
    )
  },
}))

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({
    value,
    children,
  }: {
    value: string
    children: React.ReactNode
  }) => <div data-value={value}>{children}</div>,
}))

describe("RoleSelect", () => {
  beforeEach(() => {
    floatingSelectMock.mockClear()
  })

  it("should render the available role options", () => {
    render(<RoleSelect value="Admin" onValueChangeAction={vi.fn()} />)

    expect(screen.getByText("Employee")).toBeInTheDocument()

    expect(
      screen.getByText("Admin", {
        selector: "[data-value='Admin']",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Employee", {
        selector: "[data-value='Employee']",
      })
    ).toBeInTheDocument()
  })

  it("should reflect the provided value", () => {
    render(<RoleSelect value="Employee" onValueChangeAction={vi.fn()} />)

    expect(screen.getByTestId("selected-value")).toHaveTextContent("Employee")
  })

  it("should call onValueChangeAction when a different role is selected", async () => {
    const user = userEvent.setup()
    const onValueChangeAction = vi.fn()

    render(
      <RoleSelect value="Admin" onValueChangeAction={onValueChangeAction} />
    )

    await user.click(screen.getByRole("button", { name: "change-role" }))

    expect(onValueChangeAction).toHaveBeenCalledTimes(1)
    expect(onValueChangeAction).toHaveBeenCalledWith("Employee")
  })

  it("should forward the disabled state to FloatingSelect", async () => {
    const user = userEvent.setup()
    const onValueChangeAction = vi.fn()

    render(
      <RoleSelect
        value="Admin"
        disabled
        onValueChangeAction={onValueChangeAction}
      />
    )

    expect(screen.getByTestId("disabled-state")).toHaveTextContent("disabled")

    const button = screen.getByRole("button", {
      name: "change-role",
    })

    expect(button).toBeDisabled()

    await user.click(button)

    expect(onValueChangeAction).not.toHaveBeenCalled()
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { FloatingPasswordInput } from "./floating-password-input"

vi.mock("@/components/ui/floating-label-input", () => ({
  FloatingInput: ({
    type,
    disabled,
    className,
    ...props
  }: {
    type?: string
    disabled?: boolean
    className?: string
  }) => (
    <input
      data-testid="password-input"
      type={type}
      disabled={disabled}
      className={className}
      {...props}
    />
  ),
}))

describe("FloatingPasswordInput", () => {
  it("should render a password input by default", () => {
    render(<FloatingPasswordInput label="label" />)

    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "type",
      "password"
    )

    expect(
      screen.getByRole("button", {
        name: "Show password",
      })
    ).toBeInTheDocument()
  })

  it("should toggle password visibility", async () => {
    const user = userEvent.setup()

    render(<FloatingPasswordInput label="label" />)

    const input = screen.getByTestId("password-input")

    expect(input).toHaveAttribute("type", "password")

    await user.click(
      screen.getByRole("button", {
        name: "Show password",
      })
    )

    expect(input).toHaveAttribute("type", "text")

    expect(
      screen.getByRole("button", {
        name: "Hide password",
      })
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", {
        name: "Hide password",
      })
    )

    expect(input).toHaveAttribute("type", "password")
  })

  it("should hide the toggle button when disabled", () => {
    render(<FloatingPasswordInput label="label" disabled />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()

    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "type",
      "password"
    )
  })

  it("should hide the toggle button when showToggle is false", () => {
    render(<FloatingPasswordInput label="label" showToggle={false} />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("should keep password type when disabled", () => {
    render(<FloatingPasswordInput label="label" disabled />)

    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "type",
      "password"
    )
  })
})

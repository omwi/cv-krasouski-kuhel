import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { UseFormRegister } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { ResetPasswordInput } from "@/features/auth/hooks/use-reset-password-form"

import ResetPasswordForm from "./reset-password-form"

const mockHandleSubmit = vi.fn(async () => {})

const mockRegister = vi.fn((name) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
})) as unknown as UseFormRegister<ResetPasswordInput>

vi.mock("@/features/auth/hooks/use-reset-password-form", () => ({
  useResetPasswordForm: vi.fn(),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/components/ui/field", () => ({
  Field: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  FieldGroup: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  FieldError: ({ errors }: { errors: Array<{ message?: string }> }) => (
    <div>{errors[0]?.message}</div>
  ),
}))

vi.mock("@/components/shared/input/floating-password-input", () => ({
  FloatingPasswordInput: ({
    label,
    disabled,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
  }) => <input aria-label={label} disabled={disabled} {...props} />,
}))

describe("ResetPasswordForm", () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const { useResetPasswordForm } =
      await import("@/features/auth/hooks/use-reset-password-form")

    vi.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: false,
      state: {
        error: null,
        success: false,
      },
    })
  })

  it("should render reset password form", () => {
    render(<ResetPasswordForm />)

    expect(screen.getByText("reset-password-form.title")).toBeInTheDocument()

    expect(screen.getByText("reset-password-form.text")).toBeInTheDocument()

    expect(screen.getByLabelText("password")).toBeInTheDocument()

    expect(screen.getByLabelText("confirm-password")).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "forgot-password-form.button",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("link", {
        name: "reset-password-form.button-secondary",
      })
    ).toBeInTheDocument()
  })

  it("should disable fields and submit button when pending", async () => {
    const { useResetPasswordForm } =
      await import("@/features/auth/hooks/use-reset-password-form")

    vi.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<ResetPasswordForm />)

    expect(screen.getByLabelText("password")).toBeDisabled()

    expect(screen.getByLabelText("confirm-password")).toBeDisabled()

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeDisabled()
  })

  it("should display field validation errors", async () => {
    const { useResetPasswordForm } =
      await import("@/features/auth/hooks/use-reset-password-form")

    vi.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      isPending: false,
      state: {
        error: null,
        success: false,
      },
      errors: {
        newPassword: {
          type: "manual",
          message: "Password is required",
        },
        "confirm-password": {
          type: "manual",
          message: "Passwords do not match",
        },
      },
    })

    render(<ResetPasswordForm />)

    expect(screen.getByText("Password is required")).toBeInTheDocument()

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument()
  })

  it("should display state error", async () => {
    const { useResetPasswordForm } =
      await import("@/features/auth/hooks/use-reset-password-form")

    vi.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: false,
      state: {
        error: "Reset failed",
        success: false,
      },
    })

    render(<ResetPasswordForm />)

    expect(screen.getByText("Reset failed")).toBeInTheDocument()
  })

  it("should call handleSubmit when submit button is clicked", async () => {
    const user = userEvent.setup()

    render(<ResetPasswordForm />)

    await user.click(
      screen.getByRole("button", {
        name: "forgot-password-form.button",
      })
    )

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it("should show loading text when pending", async () => {
    const { useResetPasswordForm } =
      await import("@/features/auth/hooks/use-reset-password-form")

    vi.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<ResetPasswordForm />)

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeInTheDocument()
  })
})

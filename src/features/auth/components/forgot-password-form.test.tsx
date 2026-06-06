import { render, screen } from "@testing-library/react"
import type { UseFormRegister } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { ForgotPasswordInput } from "@/features/auth/hooks/use-forgot-password-form"

import ForgotPasswordForm from "./forgot-password-form"

const mockRegister = vi.fn((name) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
})) as unknown as UseFormRegister<ForgotPasswordInput>

const mockHandleSubmit = vi.fn()

vi.mock("@/features/auth/hooks/use-forgot-password-form", () => ({
  useForgotPasswordForm: vi.fn(),
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

vi.mock("@/components/ui/floating-label-input", () => ({
  FloatingInput: ({
    label,
    disabled,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
  }) => <input aria-label={label} disabled={disabled} {...props} />,
}))

describe("ForgotPasswordForm", () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const { useForgotPasswordForm } =
      await import("@/features/auth/hooks/use-forgot-password-form")

    vi.mocked(useForgotPasswordForm).mockReturnValue({
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

  it("should render forgot password form", () => {
    render(<ForgotPasswordForm />)

    expect(screen.getByText("forgot-password-form.title")).toBeInTheDocument()

    expect(screen.getByText("forgot-password-form.text")).toBeInTheDocument()

    expect(screen.getByLabelText("email")).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "forgot-password-form.button",
      })
    ).toBeInTheDocument()
  })

  it("should disable email field and submit button when pending", async () => {
    const { useForgotPasswordForm } =
      await import("@/features/auth/hooks/use-forgot-password-form")

    vi.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<ForgotPasswordForm />)

    expect(screen.getByLabelText("email")).toBeDisabled()

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeDisabled()
  })

  it("should render validation error", async () => {
    const { useForgotPasswordForm } =
      await import("@/features/auth/hooks/use-forgot-password-form")

    vi.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      isPending: false,
      state: {
        error: null,
        success: false,
      },
      errors: {
        email: {
          type: "manual",
          message: "Invalid email",
        },
      },
    })

    render(<ForgotPasswordForm />)

    expect(screen.getByText("Invalid email")).toBeInTheDocument()
  })

  it("should show loading text when pending", async () => {
    const { useForgotPasswordForm } =
      await import("@/features/auth/hooks/use-forgot-password-form")

    vi.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<ForgotPasswordForm />)

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeInTheDocument()
  })

  it("should render login link", () => {
    render(<ForgotPasswordForm />)

    const link = screen.getByRole("link", {
      name: "forgot-password-form.button-secondary",
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href")
  })
})

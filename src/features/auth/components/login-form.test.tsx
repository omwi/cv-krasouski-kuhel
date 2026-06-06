import { render, screen } from "@testing-library/react"
import type { UseFormRegister } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { LoginInput } from "@/features/auth/hooks/use-login-form"

import LoginForm from "./login-form"

const mockRegister = vi.fn((name) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
})) as unknown as UseFormRegister<LoginInput>

const mockHandleSubmit = vi.fn()

vi.mock("@/features/auth/hooks/use-login-form", () => ({
  useLoginForm: vi.fn(),
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

vi.mock("@/components/shared/input/floating-password-input", () => ({
  FloatingPasswordInput: ({
    label,
    disabled,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
  }) => <input aria-label={label} disabled={disabled} {...props} />,
}))

describe("LoginForm", () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const { useLoginForm } =
      await import("@/features/auth/hooks/use-login-form")

    vi.mocked(useLoginForm).mockReturnValue({
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

  it("should render login form", () => {
    render(<LoginForm />)

    expect(screen.getByText("login-form.title")).toBeInTheDocument()

    expect(screen.getByText("login-form.text")).toBeInTheDocument()

    expect(screen.getByLabelText("email")).toBeInTheDocument()

    expect(screen.getByLabelText("password")).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "login-form.button",
      })
    ).toBeInTheDocument()
  })

  it("should disable inputs and submit button when pending", async () => {
    const { useLoginForm } =
      await import("@/features/auth/hooks/use-login-form")

    vi.mocked(useLoginForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<LoginForm />)

    expect(screen.getByLabelText("email")).toBeDisabled()

    expect(screen.getByLabelText("password")).toBeDisabled()

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeDisabled()
  })

  it("should render validation errors", async () => {
    const { useLoginForm } =
      await import("@/features/auth/hooks/use-login-form")

    vi.mocked(useLoginForm).mockReturnValue({
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
        password: {
          type: "manual",
          message: "Password is required",
        },
      },
    })

    render(<LoginForm />)

    expect(screen.getByText("Invalid email")).toBeInTheDocument()

    expect(screen.getByText("Password is required")).toBeInTheDocument()
  })

  it("should show loading text when pending", async () => {
    const { useLoginForm } =
      await import("@/features/auth/hooks/use-login-form")

    vi.mocked(useLoginForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<LoginForm />)

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeInTheDocument()
  })

  it("should render forgot password link", () => {
    render(<LoginForm />)

    const link = screen.getByRole("link", {
      name: "login-form.button-secondary",
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href")
  })
})

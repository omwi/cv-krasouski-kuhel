import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UseFormRegister } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SignupInput } from "@/features/auth/hooks/use-signup-form"

import SignupForm from "./signup-form"

const mockHandleSubmit = vi.fn(async () => {})

const mockRegister: UseFormRegister<SignupInput> = vi.fn((name) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
}))

vi.mock("@/features/auth/hooks/use-signup-form", () => ({
  useSignupForm: vi.fn(),
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

describe("SignupForm", () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const { useSignupForm } =
      await import("@/features/auth/hooks/use-signup-form")

    vi.mocked(useSignupForm).mockReturnValue({
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

  it("should render signup form fields and actions", () => {
    render(<SignupForm />)

    expect(screen.getByText("signup-form.title")).toBeInTheDocument()

    expect(screen.getByText("signup-form.text")).toBeInTheDocument()

    expect(
      screen.getByRole("textbox", {
        name: "email",
      })
    ).toBeInTheDocument()

    expect(screen.getByLabelText("password")).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "signup-form.button",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("link", {
        name: "signup-form.button-secondary",
      })
    ).toBeInTheDocument()
  })

  it("should disable fields and button when pending", async () => {
    const { useSignupForm } =
      await import("@/features/auth/hooks/use-signup-form")

    vi.mocked(useSignupForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<SignupForm />)

    expect(
      screen.getByRole("textbox", {
        name: "email",
      })
    ).toBeDisabled()

    expect(screen.getByLabelText("password")).toBeDisabled()

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeDisabled()
  })

  it("should display validation errors", async () => {
    const { useSignupForm } =
      await import("@/features/auth/hooks/use-signup-form")

    vi.mocked(useSignupForm).mockReturnValue({
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
          message: "Invalid password",
        },
      },
    })

    render(<SignupForm />)

    expect(screen.getByText("Invalid email")).toBeInTheDocument()

    expect(screen.getByText("Invalid password")).toBeInTheDocument()
  })

  it("should call handleSubmit when form is submitted", async () => {
    const user = userEvent.setup()

    render(<SignupForm />)

    await user.click(
      screen.getByRole("button", {
        name: "signup-form.button",
      })
    )

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it("should show loading button text when pending", async () => {
    const { useSignupForm } =
      await import("@/features/auth/hooks/use-signup-form")

    vi.mocked(useSignupForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: true,
      state: {
        error: null,
        success: false,
      },
    })

    render(<SignupForm />)

    expect(
      screen.getByRole("button", {
        name: "button-loading",
      })
    ).toBeInTheDocument()
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import VerificationForm from "./verification-form"

const mockSetValue = vi.fn()
const mockHandleSubmit = vi.fn(async () => {})
const mockWatch = vi.fn()

vi.mock("@/features/auth/hooks/use-get-me", () => ({
  useGetMeQuery: vi.fn(),
}))

vi.mock("@/features/auth/hooks/use-verification-form", () => ({
  useVerificationForm: vi.fn(),
}))

vi.mock("@/app/[lng]/verify-email/loading", () => ({
  default: () => <div>Loading...</div>,
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
  FieldLabel: ({
    children,
    ...props
  }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props}>{children}</label>
  ),
  FieldError: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

vi.mock("@/components/ui/input-otp", () => ({
  InputOTP: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
    children: React.ReactNode
  }) => (
    <input
      data-testid="otp-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  InputOTPGroup: ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  ),
  InputOTPSeparator: () => <span>-</span>,
  InputOTPSlot: () => <span />,
}))

describe("VerificationForm", () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const { useGetMeQuery } = await import("@/features/auth/hooks/use-get-me")

    const { useVerificationForm } =
      await import("@/features/auth/hooks/use-verification-form")

    vi.mocked(useGetMeQuery).mockReturnValue({
      user: null,
      role: null,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    })

    vi.mocked(useVerificationForm).mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isPending: false,
    })
  })

  it("should render loading state", async () => {
    const { useGetMeQuery } = await import("@/features/auth/hooks/use-get-me")

    vi.mocked(useGetMeQuery).mockReturnValue({
      user: null,
      role: null,
      loading: true,
      error: undefined,
      refetch: vi.fn(),
    })

    render(<VerificationForm />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("should render verification form", () => {
    mockWatch.mockReturnValue("")

    render(<VerificationForm />)

    expect(screen.getByText("verification-form.title")).toBeInTheDocument()

    expect(
      screen.getByText("verification-form.description")
    ).toBeInTheDocument()
  })

  it("should disable submit button when otp length is not 6", () => {
    mockWatch.mockReturnValue("123")

    render(<VerificationForm />)

    expect(
      screen.getByRole("button", {
        name: "verification-form.button",
      })
    ).toBeDisabled()
  })

  it("should enable submit button when otp length is 6", () => {
    mockWatch.mockReturnValue("123456")

    render(<VerificationForm />)

    expect(
      screen.getByRole("button", {
        name: "verification-form.button",
      })
    ).toBeEnabled()
  })

  it("should show validation error", async () => {
    const { useVerificationForm } =
      await import("@/features/auth/hooks/use-verification-form")

    vi.mocked(useVerificationForm).mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
      handleSubmit: mockHandleSubmit,
      isPending: false,
      errors: {
        otp: {
          type: "manual",
          message: "Invalid OTP",
        },
      },
    })

    mockWatch.mockReturnValue("")

    render(<VerificationForm />)

    expect(screen.getByText("Invalid OTP")).toBeInTheDocument()
  })

  it("should call setValue when otp changes", async () => {
    const user = userEvent.setup()

    mockWatch.mockReturnValue("")

    render(<VerificationForm />)

    await user.type(screen.getByTestId("otp-input"), "123456")

    expect(mockSetValue).toHaveBeenCalled()
    expect(mockSetValue).toHaveBeenLastCalledWith("otp", "6")
  })

  it("should call handleSubmit when submit button is clicked", async () => {
    const user = userEvent.setup()

    mockWatch.mockReturnValue("123456")

    render(<VerificationForm />)

    await user.click(
      screen.getByRole("button", {
        name: "verification-form.button",
      })
    )

    expect(mockHandleSubmit).toHaveBeenCalled()
  })
})

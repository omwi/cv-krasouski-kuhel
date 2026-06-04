import { PropsWithChildren, useEffect } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { LanguageFormDialog, LanguagesFormValues } from "./language-form-dialog"

vi.mock("@/components/shared/dialog/form-dialog")

vi.mock("@/components/shared/input/name-input", () => ({
  NameInput: () => <div data-testid="name-input" />,
}))

vi.mock("@/components/ui/field", () => ({
  Field: ({ children }: PropsWithChildren) => <div>{children}</div>,
  FieldGroup: ({ children }: PropsWithChildren) => <div>{children}</div>,
  FieldError: ({ children }: PropsWithChildren) => (
    <div role="alert">{children}</div>
  ),
}))

vi.mock("@/components/ui/floating-label-input", () => ({
  FloatingInput: ({
    id,
    label,
    disabled,
    className,
    ...props
  }: {
    id: string
    label: string
    disabled?: boolean
    className?: string
  }) => (
    <input
      data-testid={id}
      aria-label={label}
      disabled={disabled}
      className={className}
      {...props}
    />
  ),
}))

function TestHarness({
  isSubmitting = false,
  setErrors,
}: {
  isSubmitting?: boolean
  setErrors?: (form: UseFormReturn<LanguagesFormValues>) => void
}) {
  const form = useForm<LanguagesFormValues>({
    defaultValues: {
      name: "",
      native_name: "",
      iso2: "",
      languageId: "",
    },
  })

  useEffect(() => {
    setErrors?.(form)
  }, [form, setErrors])

  return (
    <LanguageFormDialog
      open
      onOpenChange={vi.fn()}
      title="Language Dialog"
      onSubmit={vi.fn()}
      form={form}
      isSubmitting={isSubmitting}
    />
  )
}

describe("LanguageFormDialog", () => {
  it("should render all form fields and dialog content", () => {
    render(<TestHarness />)

    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "Language Dialog"
    )

    expect(screen.getByTestId("name-input")).toBeInTheDocument()
    expect(screen.getByTestId("native-name")).toBeInTheDocument()
    expect(screen.getByTestId("iso2")).toBeInTheDocument()
  })

  it("should display validation errors", async () => {
    render(
      <TestHarness
        setErrors={(form) => {
          form.setError("native_name", {
            type: "manual",
            message: "Native name error",
          })

          form.setError("iso2", {
            type: "manual",
            message: "ISO2 error",
          })
        }}
      />
    )

    expect(await screen.findByText("Native name error")).toBeInTheDocument()

    expect(await screen.findByText("ISO2 error")).toBeInTheDocument()
  })

  it("should not render validation errors when none exist", () => {
    render(<TestHarness />)

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("should disable inputs while submitting", () => {
    render(<TestHarness isSubmitting />)

    expect(screen.getByTestId("native-name")).toBeDisabled()
    expect(screen.getByTestId("iso2")).toBeDisabled()
  })

  it("should allow typing into fields when not submitting", async () => {
    const user = userEvent.setup()

    render(<TestHarness />)

    const nativeNameInput = screen.getByTestId("native-name")
    const iso2Input = screen.getByTestId("iso2")

    await user.type(nativeNameInput, "Deutsch")
    await user.type(iso2Input, "DE")

    expect(nativeNameInput).toHaveValue("Deutsch")
    expect(iso2Input).toHaveValue("DE")
  })
})

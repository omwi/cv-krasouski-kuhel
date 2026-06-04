import { PropsWithChildren, useEffect } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { NameInput } from "./name-input"

type FormValues = {
  name: string
}

vi.mock("@/components/ui/field", () => ({
  Field: ({ children }: PropsWithChildren) => <div>{children}</div>,
  FieldError: ({ children }: PropsWithChildren) => (
    <div role="alert">{children}</div>
  ),
}))

vi.mock("@/components/ui/floating-label-input", () => ({
  FloatingInput: ({
    id,
    disabled,
    ...props
  }: {
    id: string
    disabled?: boolean
  }) => <input data-testid={id} disabled={disabled} {...props} />,
}))

function FormStateViewer({ form }: { form: UseFormReturn<FormValues> }) {
  const name = form.watch("name")

  return <div data-testid="name-value">{name}</div>
}

function TestHarness({
  isSubmitting = false,
  setErrors,
}: {
  isSubmitting?: boolean
  setErrors?: (form: UseFormReturn<FormValues>) => void
}) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    setErrors?.(form)
  }, [form, setErrors])

  return (
    <>
      <NameInput<FormValues>
        register={form.register}
        errors={form.formState.errors}
        isSubmitting={isSubmitting}
      />

      <FormStateViewer form={form} />
    </>
  )
}

describe("NameInput", () => {
  it("should render the name input", () => {
    render(<TestHarness />)

    expect(screen.getByTestId("name")).toBeInTheDocument()
  })

  it("should display validation errors", async () => {
    render(
      <TestHarness
        setErrors={(form) => {
          form.setError("name", {
            type: "manual",
            message: "Name is required",
          })
        }}
      />
    )

    expect(await screen.findByText("Name is required")).toBeInTheDocument()
  })

  it("should not render validation errors when none exist", () => {
    render(<TestHarness />)

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("should disable the input while submitting", () => {
    render(<TestHarness isSubmitting />)

    expect(screen.getByTestId("name")).toBeDisabled()
  })

  it("should update the form value when typing", async () => {
    const user = userEvent.setup()

    render(<TestHarness />)

    await user.type(screen.getByTestId("name"), "My Project")

    expect(screen.getByTestId("name-value")).toHaveTextContent("My Project")
  })
})

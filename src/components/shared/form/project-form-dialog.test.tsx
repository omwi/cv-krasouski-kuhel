import { PropsWithChildren, useEffect } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { ProjectFormValues } from "@/features/projects/schema"

import { ProjectFormDialog } from "./project-form-dialog"

const environmentSelectMock = vi.fn()

vi.mock("@/components/shared/dialog/form-dialog")

vi.mock("@/components/shared/input/name-input", () => ({
  NameInput: () => <div data-testid="name-input" />,
}))

vi.mock("@/components/shared/form/form-date-range-picker", () => ({
  FormDateRangePicker: () => <div data-testid="date-range-picker" />,
}))

vi.mock("@/components/shared/select/environment-select", () => ({
  EnvironmentSelect: ({
    value,
    onValueChange,
    disabled,
  }: {
    value: string[]
    onValueChange: (value: string[]) => void
    disabled?: boolean
  }) => {
    environmentSelectMock({
      value,
      disabled,
    })

    return (
      <button
        type="button"
        data-testid="environment-select"
        disabled={disabled}
        onClick={() => onValueChange(["production"])}
      >
        Environment
      </button>
    )
  },
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
    ...props
  }: {
    id: string
    label: string
    disabled?: boolean
  }) => (
    <input data-testid={id} aria-label={label} disabled={disabled} {...props} />
  ),
}))

vi.mock("@/components/ui/floating-label-textarea", () => ({
  FloatingTextarea: ({
    id,
    label,
    disabled,
    ...props
  }: {
    id: string
    label: string
    disabled?: boolean
  }) => (
    <textarea
      data-testid={id}
      aria-label={label}
      disabled={disabled}
      {...props}
    />
  ),
}))

function TestHarness({
  isSubmitting = false,
  setErrors,
}: {
  isSubmitting?: boolean
  setErrors?: (form: UseFormReturn<ProjectFormValues>) => void
}) {
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      domain: "",
      description: "",
      environment: [],
      start_date: "",
      end_date: null,
    },
  })

  useEffect(() => {
    setErrors?.(form)
  }, [form, setErrors])

  return (
    <ProjectFormDialog
      open
      onOpenChange={vi.fn()}
      title="Project Dialog"
      onSubmit={vi.fn()}
      form={form}
      isSubmitting={isSubmitting}
    />
  )
}

describe("ProjectFormDialog", () => {
  it("should render the form fields and dialog content", () => {
    render(<TestHarness />)

    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "Project Dialog"
    )

    expect(screen.getByTestId("name-input")).toBeInTheDocument()
    expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    expect(screen.getByTestId("domain")).toBeInTheDocument()
    expect(screen.getByTestId("description")).toBeInTheDocument()
    expect(screen.getByTestId("environment-select")).toBeInTheDocument()
  })

  it("should display validation errors", async () => {
    render(
      <TestHarness
        setErrors={(form) => {
          form.setError("domain", {
            type: "manual",
            message: "Domain error",
          })

          form.setError("description", {
            type: "manual",
            message: "Description error",
          })

          form.setError("environment", {
            type: "manual",
            message: "Environment error",
          })
        }}
      />
    )

    expect(await screen.findByText("Domain error")).toBeInTheDocument()

    expect(await screen.findByText("Description error")).toBeInTheDocument()

    expect(await screen.findByText("Environment error")).toBeInTheDocument()
  })

  it("should not render validation errors when none exist", () => {
    render(<TestHarness />)

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("should disable editable controls while submitting", () => {
    render(<TestHarness isSubmitting />)

    expect(screen.getByTestId("domain")).toBeDisabled()
    expect(screen.getByTestId("description")).toBeDisabled()
    expect(screen.getByTestId("environment-select")).toBeDisabled()

    expect(environmentSelectMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        disabled: true,
      })
    )
  })

  it("should provide controller value and update environment when changed", async () => {
    const user = userEvent.setup()

    render(<TestHarness />)

    expect(environmentSelectMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: [],
      })
    )

    await user.click(screen.getByTestId("environment-select"))

    expect(environmentSelectMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: ["production"],
      })
    )
  })
})

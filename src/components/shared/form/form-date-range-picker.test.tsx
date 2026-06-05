import { PropsWithChildren, useEffect } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FormDateRangePicker } from "./form-date-range-picker"

type FormValues = {
  start_date: string
  end_date: string | null
}

let startDisabledDate: ((date: Date) => boolean) | undefined
let endDisabledDate: ((date: Date) => boolean) | undefined

vi.mock("@/utils/date", () => ({
  parseUtcToLocal: vi.fn((value: string | null | undefined) =>
    value ? new Date(value) : null
  ),
  parseLocalToUtcString: vi.fn((value: string | null) => value),
}))

vi.mock("@/components/ui/field", () => ({
  Field: ({ children }: PropsWithChildren) => <div>{children}</div>,
  FieldError: ({ children }: PropsWithChildren) => (
    <div role="alert">{children}</div>
  ),
}))

vi.mock("@/components/ui/floating-date-picker", () => ({
  FloatingDatePicker: ({
    id,
    onChange,
    disabled,
    disabledDate,
  }: {
    id: string
    value: string | null
    onChange: (value: string) => void
    disabled?: boolean
    disabledDate: (date: Date) => boolean
  }) => {
    if (id === "start_date") {
      startDisabledDate = disabledDate
    }

    if (id === "end_date") {
      endDisabledDate = disabledDate
    }

    return (
      <button
        type="button"
        data-testid={id}
        disabled={disabled}
        onClick={() => onChange("2024-01-15")}
      >
        {id}
      </button>
    )
  },
}))

function FormStateViewer({ form }: { form: UseFormReturn<FormValues> }) {
  const startDate = form.watch("start_date")
  const endDate = form.watch("end_date")

  return (
    <>
      <div data-testid="start-value">{startDate}</div>
      <div data-testid="end-value">{endDate ?? ""}</div>
    </>
  )
}

function TestHarness({
  isSubmitting = false,
  defaultValues,
  setErrors,
}: {
  isSubmitting?: boolean
  defaultValues?: FormValues
  setErrors?: (form: UseFormReturn<FormValues>) => void
}) {
  const form = useForm<FormValues>({
    defaultValues: defaultValues ?? {
      start_date: "",
      end_date: null,
    },
  })

  useEffect(() => {
    setErrors?.(form)
  }, [form, setErrors])

  return (
    <>
      <FormDateRangePicker<FormValues>
        form={form}
        startName="start_date"
        endName="end_date"
        isSubmitting={isSubmitting}
      />

      <FormStateViewer form={form} />
    </>
  )
}

describe("FormDateRangePicker", () => {
  beforeEach(() => {
    startDisabledDate = undefined
    endDisabledDate = undefined
  })

  it("should render both date pickers", () => {
    render(<TestHarness />)

    expect(screen.getByTestId("start_date")).toBeInTheDocument()
    expect(screen.getByTestId("end_date")).toBeInTheDocument()
  })

  it("should display validation errors", async () => {
    render(
      <TestHarness
        setErrors={(form) => {
          form.setError("start_date", {
            type: "manual",
            message: "Start date error",
          })

          form.setError("end_date", {
            type: "manual",
            message: "End date error",
          })
        }}
      />
    )

    expect(await screen.findByText("Start date error")).toBeInTheDocument()

    expect(await screen.findByText("End date error")).toBeInTheDocument()
  })

  it("should not render validation errors when none exist", () => {
    render(<TestHarness />)

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("should disable both date pickers while submitting", () => {
    render(<TestHarness isSubmitting />)

    expect(screen.getByTestId("start_date")).toBeDisabled()
    expect(screen.getByTestId("end_date")).toBeDisabled()
  })

  it("should update the start date value when a date is selected", async () => {
    const user = userEvent.setup()

    render(<TestHarness />)

    await user.click(screen.getByTestId("start_date"))

    expect(screen.getByTestId("start-value")).toHaveTextContent("2024-01-15")
  })

  it("should disable future start dates", () => {
    render(<TestHarness />)

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    expect(startDisabledDate).toBeDefined()
    expect(startDisabledDate?.(futureDate)).toBe(true)
  })

  it("should disable start dates after the selected end date", () => {
    render(
      <TestHarness
        defaultValues={{
          start_date: "",
          end_date: "2024-01-10",
        }}
      />
    )

    expect(startDisabledDate?.(new Date("2024-01-11"))).toBe(true)
  })

  it("should disable end dates before the selected start date", () => {
    render(
      <TestHarness
        defaultValues={{
          start_date: "2024-01-10",
          end_date: null,
        }}
      />
    )

    expect(endDisabledDate?.(new Date("2024-01-09"))).toBe(true)
  })

  it("should allow selecting today as a valid start date", () => {
    render(<TestHarness />)

    expect(startDisabledDate).toBeDefined()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    expect(startDisabledDate?.(today)).toBe(false)
  })

  it("should not disable any end dates when start date is not selected", () => {
    render(
      <TestHarness
        defaultValues={{
          start_date: "",
          end_date: null,
        }}
      />
    )

    expect(endDisabledDate).toBeDefined()

    expect(endDisabledDate?.(new Date("1900-01-01"))).toBe(false)
    expect(endDisabledDate?.(new Date("2100-01-01"))).toBe(false)
  })
})

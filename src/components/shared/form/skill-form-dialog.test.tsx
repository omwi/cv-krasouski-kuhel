import React, { useEffect } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  SkillFormDialog,
  SkillFormDialogProps,
  SkillFormValues,
} from "./skill-form-dialog"

vi.mock("@/components/shared/dialog/form-dialog")

vi.mock("@/components/shared/input/name-input", () => ({
  NameInput: (props: {
    register: UseFormRegister<SkillFormValues>
    errors: FieldErrors<SkillFormValues>
    isSubmitting?: boolean
  }) => {
    const { ref, ...rest } = props.register("name")

    return (
      <input
        data-testid="mock-name-input"
        disabled={props.isSubmitting}
        ref={ref}
        {...rest}
      />
    )
  },
}))

vi.mock("@/components/shared/select/skill-category-select", () => ({
  SkillCategorySelect: (props: {
    value: string
    onValueChangeAction: (value: string) => void
    disabled?: boolean
  }) => (
    <select
      data-testid="mock-category-select"
      value={props.value}
      onChange={(e) => props.onValueChangeAction(e.target.value)}
      disabled={props.disabled}
    >
      <option value="">Select</option>
      <option value="cat-1">Category 1</option>
    </select>
  ),
}))

interface WrapperProps extends Partial<SkillFormDialogProps> {
  onValidSubmit?: (data: SkillFormValues) => void
  triggerError?: boolean
}

function FormWrapper({
  onValidSubmit,
  triggerError = false,
  ...dialogProps
}: WrapperProps) {
  const form = useForm<SkillFormValues>({
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (triggerError) {
      form.setError("categoryId", {
        type: "manual",
        message: "Category is strictly required",
      })
    }
  }, [form, triggerError])

  const handleSubmit = form.handleSubmit((data) => {
    onValidSubmit?.(data)
  })

  return (
    <SkillFormDialog
      open
      onOpenChange={vi.fn()}
      title="Test Skill Form"
      onSubmit={handleSubmit}
      form={form}
      {...dialogProps}
    />
  )
}

describe("SkillFormDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render correctly with all fields", () => {
    render(<FormWrapper submitLabel="Save Skill" submitDisabled />)

    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "Test Skill Form"
    )

    expect(screen.getByTestId("mock-name-input")).toBeInTheDocument()
    expect(screen.getByTestId("mock-category-select")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-submit")).toBeInTheDocument()
  })

  it("should capture input values and call submit handler successfully", async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()

    render(<FormWrapper onValidSubmit={mockSubmit} />)

    const nameInput = screen.getByTestId("mock-name-input")
    const categorySelect = screen.getByTestId("mock-category-select")
    const submitButton = screen.getByTestId("dialog-submit")

    await user.type(nameInput, "React JS")
    await user.selectOptions(categorySelect, "cat-1")
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: "React JS",
        categoryId: "cat-1",
      })
    })
  })

  it("should display field error messages when validation fails", async () => {
    render(<FormWrapper triggerError />)

    await waitFor(() => {
      expect(
        screen.getByText("Category is strictly required")
      ).toBeInTheDocument()
    })
  })

  it("should pass disabled state to inputs when form is submitting", () => {
    render(<FormWrapper isSubmitting />)

    expect(screen.getByTestId("mock-name-input")).toBeDisabled()
    expect(screen.getByTestId("mock-category-select")).toBeDisabled()
  })
})

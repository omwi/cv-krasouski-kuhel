import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateCvForm } from "@/features/cvs/hooks/use-create-cv-form"

import CreateCv from "./create-cv"

vi.mock("@/features/cvs/hooks/use-create-cv-form", () => ({
  useCreateCvForm: vi.fn(),
}))

vi.mock("@/components/shared/dialog/form-dialog")

describe("CreateCv Component", () => {
  const mockOnSubmit = vi.fn()
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateCvForm).mockReturnValue({
      onSubmit: mockOnSubmit,
      register: mockRegister,
      isSubmitting: false,
      isSubmitReady: true,
      errors: {},
      control: {} as unknown as ReturnType<typeof useCreateCvForm>["control"],
    } as unknown as ReturnType<typeof useCreateCvForm>)
  })

  it("should render trigger button and open dialog on click", () => {
    render(
      <CreateCv userId="user-123">
        <button data-testid="trigger">Open</button>
      </CreateCv>
    )

    // Trigger is visible
    const trigger = screen.getByTestId("trigger")
    expect(trigger).toBeInTheDocument()

    // Click trigger to open the mock form dialog
    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(useCreateCvForm).toHaveBeenCalledWith("user-123", expect.any(Object))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    // Check title and submit button
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("create.title")

    // Submit dialog
    fireEvent.submit(screen.getByTestId("form-dialog"))
    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should disable submit button when form is not submit ready", () => {
    vi.mocked(useCreateCvForm).mockReturnValue({
      onSubmit: mockOnSubmit,
      register: mockRegister,
      isSubmitting: false,
      isSubmitReady: false,
      errors: {},
      control: {} as unknown as ReturnType<typeof useCreateCvForm>["control"],
    } as unknown as ReturnType<typeof useCreateCvForm>)

    render(
      <CreateCv userId="user-123">
        <button data-testid="trigger">Open</button>
      </CreateCv>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    const submitBtn = screen.getByTestId("dialog-submit")
    expect(submitBtn).toBeDisabled()
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useUpdateCvForm } from "@/features/cvs/hooks/use-update-cv-form"
import { Cv } from "@/types/graphql-types"

import UpdateCv from "./update-cv"

vi.mock("@/features/cvs/hooks/use-update-cv-form", () => ({
  useUpdateCvForm: vi.fn(),
}))

vi.mock("@/components/shared/dialog/form-dialog")

describe("UpdateCv Component", () => {
  const mockCv = {
    id: "cv-123",
    name: "My Awesome CV",
  } as Cv

  const mockOnSubmit = vi.fn()
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateCvForm).mockReturnValue({
      onSubmit: mockOnSubmit,
      register: mockRegister,
      isSubmitting: false,
      isSubmitReady: true,
      errors: {},
      control: {} as unknown as ReturnType<typeof useUpdateCvForm>["control"],
    } as unknown as ReturnType<typeof useUpdateCvForm>)
  })

  it("should render trigger button and open dialog using internal state when open props are omitted", () => {
    render(
      <UpdateCv cv={mockCv}>
        <button data-testid="trigger">Edit CV</button>
      </UpdateCv>
    )

    // Trigger is visible
    const trigger = screen.getByTestId("trigger")
    expect(trigger).toBeInTheDocument()

    // Click trigger to open the mock form dialog
    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(useUpdateCvForm).toHaveBeenCalledWith(mockCv, expect.any(Object))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    // Check title and submit button
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("update.title")

    // Submit dialog
    fireEvent.submit(screen.getByTestId("form-dialog"))
    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should respect controlled open and onOpenChange props", () => {
    const mockOnOpenChange = vi.fn()

    const { rerender } = render(
      <UpdateCv cv={mockCv} open={true} onOpenChange={mockOnOpenChange}>
        <button data-testid="trigger">Edit CV</button>
      </UpdateCv>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    rerender(
      <UpdateCv cv={mockCv} open={false} onOpenChange={mockOnOpenChange}>
        <button data-testid="trigger">Edit CV</button>
      </UpdateCv>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is not submit ready", () => {
    vi.mocked(useUpdateCvForm).mockReturnValue({
      onSubmit: mockOnSubmit,
      register: mockRegister,
      isSubmitting: false,
      isSubmitReady: false,
      errors: {},
      control: {} as unknown as ReturnType<typeof useUpdateCvForm>["control"],
    } as unknown as ReturnType<typeof useUpdateCvForm>)

    render(
      <UpdateCv cv={mockCv} open={true}>
        <button data-testid="trigger">Edit CV</button>
      </UpdateCv>
    )

    const submitBtn = screen.getByTestId("dialog-submit")
    expect(submitBtn).toBeDisabled()
  })
})

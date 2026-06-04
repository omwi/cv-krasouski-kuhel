import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FormDialog, FormDialogProps } from "./form-dialog"

vi.unmock("./form-dialog")

describe("FormDialog", () => {
  const mockOnOpenChange = vi.fn()
  const mockOnSubmit = vi.fn((e?: React.BaseSyntheticEvent) => {
    e?.preventDefault()
    return Promise.resolve()
  })

  const defaultProps: FormDialogProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    title: "Test Form Title",
    onSubmit: mockOnSubmit,
    children: <div>Form Content</div>,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render dialog with provided title, children, and localized default labels when open", () => {
    render(<FormDialog {...defaultProps} />)

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Test Form Title" })
    ).toBeInTheDocument()
    expect(screen.getByText("Form Content")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "confirm" })).toBeInTheDocument()
  })

  it("should render optional trigger and apply custom submit and cancel labels when provided", () => {
    const propsWithCustoms: FormDialogProps = {
      ...defaultProps,
      open: false,
      trigger: <button data-testid="trigger-btn">Open Form</button>,
      submitLabel: "Save Changes",
      cancelLabel: "Dismiss",
    }

    const { rerender } = render(<FormDialog {...propsWithCustoms} />)

    expect(screen.getByTestId("trigger-btn")).toBeInTheDocument()

    rerender(<FormDialog {...propsWithCustoms} open={true} />)

    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument()
  })

  it("should invoke onSubmit when the form submit button is clicked", async () => {
    const user = userEvent.setup()
    render(<FormDialog {...defaultProps} />)

    const submitButton = screen.getByRole("button", { name: "confirm" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it("should disable form buttons and submit actions when isSubmitting or submitDisabled conditions match", () => {
    const { rerender } = render(
      <FormDialog {...defaultProps} isSubmitting={true} />
    )

    let submitButton = screen.getByRole("button", { name: "confirm" })
    let cancelButton = screen.getByRole("button", { name: "cancel" })

    expect(submitButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()

    rerender(<FormDialog {...defaultProps} submitDisabled={true} />)

    submitButton = screen.getByRole("button", { name: "confirm" })
    cancelButton = screen.getByRole("button", { name: "cancel" })

    expect(submitButton).toBeDisabled()
    expect(cancelButton).not.toBeDisabled()
  })
})

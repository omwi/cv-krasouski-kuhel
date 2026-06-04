import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DeleteDialog } from "./delete-dialog"

vi.unmock("./delete-dialog")

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe("DeleteDialog", () => {
  const mockOnOpenChange = vi.fn()
  const mockOnConfirm = vi.fn()

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onConfirm: mockOnConfirm,
    i18nKey: "test-namespace",
    entityName: "TestEntity",
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnConfirm.mockResolvedValue(undefined)
  })

  it("should render dialog content correctly when open", () => {
    render(<DeleteDialog {...defaultProps} />)

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("delete.title")).toBeInTheDocument()
    expect(screen.getByText("delete.description")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument()
  })

  it("should execute deletion successfully, show toast, and close dialog", async () => {
    const user = userEvent.setup()
    render(<DeleteDialog {...defaultProps} />)

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    await user.click(deleteButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("delete.success")
    })
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("should disable buttons while deletion is in progress", async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: void) => void = () => {}
    mockOnConfirm.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePromise = resolve
        })
    )
    render(<DeleteDialog {...defaultProps} />)
    const deleteButton = screen.getByRole("button", { name: /delete/i })
    const cancelButton = screen.getByRole("button", { name: /cancel/i })

    await user.click(deleteButton)

    expect(deleteButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()

    resolvePromise()

    await waitFor(() => {
      expect(deleteButton).not.toBeDisabled()
    })
  })

  it("should handle Error instances thrown during deletion and display error toast", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const user = userEvent.setup()
    const errorMessage = "Server connection failed"
    const expectedError = new Error(errorMessage)
    mockOnConfirm.mockRejectedValue(expectedError)

    render(<DeleteDialog {...defaultProps} />)
    const deleteButton = screen.getByRole("button", { name: /delete/i })

    await user.click(deleteButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
    expect(mockOnOpenChange).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(expectedError)

    consoleSpy.mockRestore()
  })

  it("should handle non-Error instances thrown during deletion with fallback message", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const user = userEvent.setup()
    const errorObject = { code: 500 }
    mockOnConfirm.mockRejectedValue(errorObject)

    render(<DeleteDialog {...defaultProps} />)
    const deleteButton = screen.getByRole("button", { name: /delete/i })

    await user.click(deleteButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("delete.error")
    })
    expect(mockOnOpenChange).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(errorObject)

    consoleSpy.mockRestore()
  })
})

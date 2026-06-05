import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreatePositionForm } from "@/features/positions/hooks/use-create-position-form"

import CreatePosition from "./create-position"

vi.mock("@/features/positions/hooks/use-create-position-form", () => ({
  useCreatePositionForm: vi.fn(),
}))

vi.mock("@/components/shared/form/entity-name-form-dialog", () => ({
  EntityNameFormDialog: vi.fn(
    ({
      trigger,
      open,
      onOpenChange,
      title,
      onSubmit,
      submitDisabled,
      isSubmitting,
    }: {
      trigger?: React.ReactNode
      open: boolean
      onOpenChange: (open: boolean) => void
      title: string
      onSubmit: React.SubmitEventHandler
      submitDisabled?: boolean
      isSubmitting?: boolean
    }) => (
      <>
        <span data-testid="dialog-trigger" onClick={() => onOpenChange(true)}>
          {trigger}
        </span>
        <span data-testid="dialog-close" onClick={() => onOpenChange(false)} />
        {open && (
          <form data-testid="form-dialog" onSubmit={onSubmit}>
            <span data-testid="dialog-title">{title}</span>
            <button
              type="submit"
              data-testid="dialog-submit"
              disabled={submitDisabled || isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </>
    )
  ),
}))

describe("CreatePosition Component", () => {
  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreatePositionForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreatePositionForm>)
  })

  it("should render trigger and open dialog with correct title on click", () => {
    render(
      <CreatePosition>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("create.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <CreatePosition>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should pass open state and setOpen to useCreatePositionForm", () => {
    render(
      <CreatePosition>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    expect(useCreatePositionForm).toHaveBeenCalledWith(
      false,
      expect.any(Function)
    )
  })

  it("should pass updated open state to useCreatePositionForm after opening", () => {
    render(
      <CreatePosition>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(useCreatePositionForm).toHaveBeenLastCalledWith(
      true,
      expect.any(Function)
    )
  })

  it("should close the dialog when setOpen(false) is called via the hook", () => {
    let capturedSetOpen: ((open: boolean) => void) | undefined

    vi.mocked(useCreatePositionForm).mockImplementation((_, setOpen) => {
      capturedSetOpen = setOpen
      return {
        form: mockForm,
        onSubmit: mockOnSubmit,
        loading: false,
      } as unknown as ReturnType<typeof useCreatePositionForm>
    })

    render(
      <CreatePosition>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedSetOpen!(false)
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useCreatePositionForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: false } },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreatePositionForm>)

    render(
      <CreatePosition>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useCreatePositionForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: true } },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useCreatePositionForm>)

    render(
      <CreatePosition>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should not render dialog when controlled open=false", () => {
    render(
      <CreatePosition open={false} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should render dialog immediately when controlled open=true", () => {
    render(
      <CreatePosition open={true} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreatePosition>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
  })
})

import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { useUpdatePositionForm } from "@/features/positions/hooks/use-update-position-form"

import UpdatePosition from "./update-position"

vi.mock("@/features/positions/hooks/use-update-position-form", () => ({
  useUpdatePositionForm: vi.fn(),
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

describe("UpdatePosition Component", () => {
  const mockPosition: TablePosition = {
    __typename: "Position",
    id: "pos-1",
    name: "Software Engineer",
  } as unknown as TablePosition

  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isDirty: true, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdatePositionForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdatePositionForm>)
  })

  it("should render trigger and open dialog using internal state when open props are omitted", () => {
    render(
      <UpdatePosition position={mockPosition}>
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()
    expect(screen.queryByTestId("form-dialog")).toBeNull()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("update.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <UpdatePosition position={mockPosition}>
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should pass position, open state and setOpen to useUpdatePositionForm", () => {
    render(
      <UpdatePosition position={mockPosition}>
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    expect(useUpdatePositionForm).toHaveBeenCalledWith(
      mockPosition,
      false,
      expect.any(Function)
    )
  })

  it("should close the dialog when setOpen(false) is called via the hook", () => {
    let capturedSetOpen: ((open: boolean) => void) | undefined

    vi.mocked(useUpdatePositionForm).mockImplementation(
      (_position, _open, setOpen) => {
        capturedSetOpen = setOpen
        return {
          form: mockForm,
          onSubmit: mockOnSubmit,
          loading: false,
        } as unknown as ReturnType<typeof useUpdatePositionForm>
      }
    )

    render(
      <UpdatePosition position={mockPosition}>
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedSetOpen!(false)
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should respect controlled open and onOpenChange props", () => {
    const mockOnOpenChange = vi.fn()

    const { rerender } = render(
      <UpdatePosition
        position={mockPosition}
        open={true}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    rerender(
      <UpdatePosition
        position={mockPosition}
        open={false}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useUpdatePositionForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: false },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdatePositionForm>)

    render(
      <UpdatePosition position={mockPosition} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when form is not dirty", () => {
    vi.mocked(useUpdatePositionForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: false, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdatePositionForm>)

    render(
      <UpdatePosition position={mockPosition} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useUpdatePositionForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useUpdatePositionForm>)

    render(
      <UpdatePosition position={mockPosition} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdatePosition>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })
})

import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateDepartmentForm } from "@/features/departments/hooks/use-create-department-form"

import CreateDepartment from "./create-department"

vi.mock("@/features/departments/hooks/use-create-department-form", () => ({
  useCreateDepartmentForm: vi.fn(),
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

describe("CreateDepartment Component", () => {
  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateDepartmentForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateDepartmentForm>)
  })

  it("should render trigger and open dialog with correct title on click", () => {
    render(
      <CreateDepartment>
        <button data-testid="trigger">Create</button>
      </CreateDepartment>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("create.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <CreateDepartment>
        <button data-testid="trigger">Create</button>
      </CreateDepartment>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should invoke the close callback passed to useCreateDepartmentForm to close the dialog", () => {
    let capturedOnSuccess: (() => void) | undefined

    vi.mocked(useCreateDepartmentForm).mockImplementation((_t, onSuccess) => {
      capturedOnSuccess = onSuccess
      return {
        form: mockForm,
        onSubmit: mockOnSubmit,
        loading: false,
      } as unknown as ReturnType<typeof useCreateDepartmentForm>
    })

    render(
      <CreateDepartment>
        <button data-testid="trigger">Create</button>
      </CreateDepartment>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedOnSuccess!()
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useCreateDepartmentForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: false } },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateDepartmentForm>)

    render(
      <CreateDepartment>
        <button data-testid="trigger">Create</button>
      </CreateDepartment>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useCreateDepartmentForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: true } },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useCreateDepartmentForm>)

    render(
      <CreateDepartment>
        <button data-testid="trigger">Create</button>
      </CreateDepartment>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should not render dialog when controlled open=false", () => {
    render(
      <CreateDepartment open={false} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateDepartment>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should render dialog immediately when controlled open=true", () => {
    render(
      <CreateDepartment open={true} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateDepartment>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
  })
})

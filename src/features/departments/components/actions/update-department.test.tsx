import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import { useUpdateDepartmentForm } from "@/features/departments/hooks/use-update-department-form"

import UpdateDepartment from "./update-department"

vi.mock("@/features/departments/hooks/use-update-department-form", () => ({
  useUpdateDepartmentForm: vi.fn(),
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

describe("UpdateDepartment Component", () => {
  const mockDepartment: TableDepartment = {
    __typename: "Department",
    id: "dept-1",
    name: "Engineering",
  } as unknown as TableDepartment

  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isDirty: true, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateDepartmentForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateDepartmentForm>)
  })

  it("should render trigger and open dialog using internal state when open props are omitted", () => {
    render(
      <UpdateDepartment department={mockDepartment}>
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()
    expect(screen.queryByTestId("form-dialog")).toBeNull()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("update.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <UpdateDepartment department={mockDepartment}>
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should invoke the close callback passed to useUpdateDepartmentForm to close the dialog", () => {
    let capturedOnSuccess: (() => void) | undefined

    vi.mocked(useUpdateDepartmentForm).mockImplementation(
      (_department, _open, _t, onSuccess) => {
        capturedOnSuccess = onSuccess
        return {
          form: mockForm,
          onSubmit: mockOnSubmit,
          loading: false,
        } as unknown as ReturnType<typeof useUpdateDepartmentForm>
      }
    )

    render(
      <UpdateDepartment department={mockDepartment}>
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedOnSuccess!()
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should pass department, open state, t and close callback to useUpdateDepartmentForm", () => {
    render(
      <UpdateDepartment department={mockDepartment}>
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    expect(useUpdateDepartmentForm).toHaveBeenCalledWith(
      mockDepartment,
      false,
      expect.any(Function),
      expect.any(Function)
    )
  })

  it("should respect controlled open and onOpenChange props", () => {
    const mockOnOpenChange = vi.fn()

    const { rerender } = render(
      <UpdateDepartment
        department={mockDepartment}
        open={true}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    rerender(
      <UpdateDepartment
        department={mockDepartment}
        open={false}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useUpdateDepartmentForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: false },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateDepartmentForm>)

    render(
      <UpdateDepartment department={mockDepartment} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when form is not dirty", () => {
    vi.mocked(useUpdateDepartmentForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: false, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateDepartmentForm>)

    render(
      <UpdateDepartment department={mockDepartment} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useUpdateDepartmentForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useUpdateDepartmentForm>)

    render(
      <UpdateDepartment department={mockDepartment} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateDepartment>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })
})

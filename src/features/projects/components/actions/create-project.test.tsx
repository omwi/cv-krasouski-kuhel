import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateProjectForm } from "@/features/projects/hooks/use-create-project-form"

import CreateProject from "./create-project"

vi.mock("@/features/projects/hooks/use-create-project-form", () => ({
  useCreateProjectForm: vi.fn(),
}))

vi.mock("@/components/shared/form/project-form-dialog", () => ({
  ProjectFormDialog: vi.fn(
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

describe("CreateProject Component", () => {
  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateProjectForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateProjectForm>)
  })

  it("should render trigger and open dialog with correct title on click", () => {
    render(
      <CreateProject>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("create.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <CreateProject>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should pass translation function and close callback to useCreateProjectForm", () => {
    render(
      <CreateProject>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    expect(useCreateProjectForm).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    )
  })

  it("should close the dialog when close callback passed to hook is called", () => {
    let capturedClose: (() => void) | undefined

    vi.mocked(useCreateProjectForm).mockImplementation((_t, onSuccess) => {
      capturedClose = onSuccess
      return {
        form: mockForm,
        onSubmit: mockOnSubmit,
        loading: false,
      } as unknown as ReturnType<typeof useCreateProjectForm>
    })

    render(
      <CreateProject>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedClose!()
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useCreateProjectForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: false } },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateProjectForm>)

    render(
      <CreateProject>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useCreateProjectForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: true } },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useCreateProjectForm>)

    render(
      <CreateProject>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should not render dialog when controlled open=false", () => {
    render(
      <CreateProject open={false} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should render dialog immediately when controlled open=true", () => {
    render(
      <CreateProject open={true} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateProject>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
  })
})

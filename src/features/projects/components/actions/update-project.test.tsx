import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import { useUpdateProjectForm } from "@/features/projects/hooks/use-update-project-form"

import UpdateProject from "./update-project"

vi.mock("@/features/projects/hooks/use-update-project-form", () => ({
  useUpdateProjectForm: vi.fn(),
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

describe("UpdateProject Component", () => {
  const mockProject: TableProjects = {
    __typename: "Project",
    id: "project-1",
    name: "Apollo Migration",
  } as unknown as TableProjects

  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isDirty: true, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateProjectForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateProjectForm>)
  })

  it("should render trigger and open dialog using internal state when open props are omitted", () => {
    render(
      <UpdateProject project={mockProject}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()
    expect(screen.queryByTestId("form-dialog")).toBeNull()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("update.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <UpdateProject project={mockProject}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should pass translation function, project and callback to useUpdateProjectForm", () => {
    render(
      <UpdateProject project={mockProject}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    expect(useUpdateProjectForm).toHaveBeenCalledWith(
      expect.any(Function),
      mockProject,
      expect.any(Function)
    )
  })

  it("should close the dialog when callback passed to hook is called", () => {
    let capturedSuccess: (() => void) | undefined

    vi.mocked(useUpdateProjectForm).mockImplementation(
      (_t, _project, onSuccess) => {
        capturedSuccess = onSuccess
        return {
          form: mockForm,
          onSubmit: mockOnSubmit,
          loading: false,
        } as unknown as ReturnType<typeof useUpdateProjectForm>
      }
    )

    render(
      <UpdateProject project={mockProject}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedSuccess!()
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should call controlled onSuccess when callback passed to hook is called", () => {
    let capturedSuccess: (() => void) | undefined

    vi.mocked(useUpdateProjectForm).mockImplementation(
      (_t, _project, onSuccess) => {
        capturedSuccess = onSuccess
        return {
          form: mockForm,
          onSubmit: mockOnSubmit,
          loading: false,
        } as unknown as ReturnType<typeof useUpdateProjectForm>
      }
    )

    const mockOnSuccess = vi.fn()

    render(
      <UpdateProject project={mockProject} onSuccess={mockOnSuccess}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    act(() => {
      capturedSuccess!()
    })

    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it("should respect controlled open and onOpenChange props", () => {
    const mockOnOpenChange = vi.fn()

    const { rerender } = render(
      <UpdateProject
        project={mockProject}
        open={true}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    rerender(
      <UpdateProject
        project={mockProject}
        open={false}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useUpdateProjectForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: false },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateProjectForm>)

    render(
      <UpdateProject project={mockProject} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when form is not dirty", () => {
    vi.mocked(useUpdateProjectForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: false, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateProjectForm>)

    render(
      <UpdateProject project={mockProject} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useUpdateProjectForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useUpdateProjectForm>)

    render(
      <UpdateProject project={mockProject} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateProject>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })
})

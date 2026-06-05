import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateSkillForm } from "@/features/skills/hooks/use-create-skill-form"

import CreateSkill from "./create-skill"

vi.mock("@/features/skills/hooks/use-create-skill-form", () => ({
  useCreateSkillForm: vi.fn(),
}))

vi.mock("@/components/shared/form/skill-form-dialog", () => ({
  SkillFormDialog: vi.fn(
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

describe("CreateSkill Component", () => {
  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateSkillForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateSkillForm>)
  })

  it("should render trigger and open dialog with correct title on click", () => {
    render(
      <CreateSkill>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("create.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <CreateSkill>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should pass open state and setOpen to useCreateSkillForm", () => {
    render(
      <CreateSkill>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    expect(useCreateSkillForm).toHaveBeenCalledWith(false, expect.any(Function))
  })

  it("should close dialog when setOpen(false) is called via hook", () => {
    let capturedSetOpen: ((open: boolean) => void) | undefined

    vi.mocked(useCreateSkillForm).mockImplementation((open, setOpen) => {
      capturedSetOpen = setOpen
      return {
        form: mockForm,
        onSubmit: mockOnSubmit,
        loading: false,
      } as unknown as ReturnType<typeof useCreateSkillForm>
    })

    render(
      <CreateSkill>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedSetOpen!(false)
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit when form is invalid", () => {
    vi.mocked(useCreateSkillForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: false } },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateSkillForm>)

    render(
      <CreateSkill>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit when mutation is loading", () => {
    vi.mocked(useCreateSkillForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: true } },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useCreateSkillForm>)

    render(
      <CreateSkill>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should render controlled open state true", () => {
    render(
      <CreateSkill open={true} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
  })

  it("should not render dialog when controlled open is false", () => {
    render(
      <CreateSkill open={false} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateSkill>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })
})

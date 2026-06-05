import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableSkill } from "@/features/skills/components/table/skills-table-columns"
import { useUpdateSkillForm } from "@/features/skills/hooks/use-update-skill-form"

import UpdateSkill from "./update-skill"

vi.mock("@/features/skills/hooks/use-update-skill-form", () => ({
  useUpdateSkillForm: vi.fn(),
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

describe("UpdateSkill Component", () => {
  const mockSkill: TableSkill = {
    __typename: "Skill",
    id: "skill-1",
    name: "TypeScript",
  } as unknown as TableSkill

  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isDirty: true, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateSkillForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateSkillForm>)
  })

  it("should render trigger and open dialog using internal state when open is not provided", () => {
    render(
      <UpdateSkill skill={mockSkill}>
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()
    expect(screen.queryByTestId("form-dialog")).toBeNull()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("update.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <UpdateSkill skill={mockSkill}>
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should pass skill, open state and setOpen to useUpdateSkillForm", () => {
    render(
      <UpdateSkill skill={mockSkill}>
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    expect(useUpdateSkillForm).toHaveBeenCalledWith(
      mockSkill,
      false,
      expect.any(Function)
    )
  })

  it("should close dialog when setOpen(false) is called via hook", () => {
    let capturedSetOpen: ((open: boolean) => void) | undefined

    vi.mocked(useUpdateSkillForm).mockImplementation(
      (_skill, _open, setOpen) => {
        capturedSetOpen = setOpen
        return {
          form: mockForm,
          onSubmit: mockOnSubmit,
          loading: false,
        } as unknown as ReturnType<typeof useUpdateSkillForm>
      }
    )

    render(
      <UpdateSkill skill={mockSkill}>
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedSetOpen!(false)
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit when form is invalid", () => {
    vi.mocked(useUpdateSkillForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: false },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateSkillForm>)

    render(
      <UpdateSkill skill={mockSkill} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit when form is not dirty", () => {
    vi.mocked(useUpdateSkillForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: false, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateSkillForm>)

    render(
      <UpdateSkill skill={mockSkill} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit when mutation is loading", () => {
    vi.mocked(useUpdateSkillForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useUpdateSkillForm>)

    render(
      <UpdateSkill skill={mockSkill} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should render controlled open state when provided", () => {
    const mockOnOpenChange = vi.fn()

    const { rerender } = render(
      <UpdateSkill
        skill={mockSkill}
        open={true}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    rerender(
      <UpdateSkill
        skill={mockSkill}
        open={false}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateSkill>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })
})

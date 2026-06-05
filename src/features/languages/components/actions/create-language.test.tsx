import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateLanguageForm } from "@/features/languages/hooks/use-create-language-form"

import CreateLanguage from "./create-language"

vi.mock("@/features/languages/hooks/use-create-language-form", () => ({
  useCreateLanguageForm: vi.fn(),
}))

vi.mock("@/components/shared/form/language-form-dialog", () => ({
  LanguageFormDialog: vi.fn(
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

describe("CreateLanguage Component", () => {
  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateLanguageForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateLanguageForm>)
  })

  it("should render trigger and open dialog with correct title on click", () => {
    render(
      <CreateLanguage>
        <button data-testid="trigger">Create</button>
      </CreateLanguage>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("create.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <CreateLanguage>
        <button data-testid="trigger">Create</button>
      </CreateLanguage>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should invoke the close callback passed to useCreateLanguageForm to close the dialog", () => {
    let capturedOnSuccess: (() => void) | undefined

    vi.mocked(useCreateLanguageForm).mockImplementation((_t, onSuccess) => {
      capturedOnSuccess = onSuccess
      return {
        form: mockForm,
        onSubmit: mockOnSubmit,
        loading: false,
      } as unknown as ReturnType<typeof useCreateLanguageForm>
    })

    render(
      <CreateLanguage>
        <button data-testid="trigger">Create</button>
      </CreateLanguage>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedOnSuccess!()
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useCreateLanguageForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: false } },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useCreateLanguageForm>)

    render(
      <CreateLanguage>
        <button data-testid="trigger">Create</button>
      </CreateLanguage>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useCreateLanguageForm).mockReturnValue({
      form: { formState: { isSubmitting: false, isValid: true } },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useCreateLanguageForm>)

    render(
      <CreateLanguage>
        <button data-testid="trigger">Create</button>
      </CreateLanguage>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should not render dialog when controlled open=false", () => {
    render(
      <CreateLanguage open={false} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateLanguage>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should render dialog immediately when controlled open=true", () => {
    render(
      <CreateLanguage open={true} onOpenChange={vi.fn()}>
        <button data-testid="trigger">Create</button>
      </CreateLanguage>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
  })
})

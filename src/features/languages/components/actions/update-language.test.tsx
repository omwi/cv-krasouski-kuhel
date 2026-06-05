import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"
import { useUpdateLanguageForm } from "@/features/languages/hooks/use-update-language-form"

import UpdateLanguage from "./update-language"

vi.mock("@/features/languages/hooks/use-update-language-form", () => ({
  useUpdateLanguageForm: vi.fn(),
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

describe("UpdateLanguage Component", () => {
  const mockLanguage: TableLanguages = {
    __typename: "Language",
    id: "lang-1",
    name: "English",
  } as unknown as TableLanguages

  const mockOnSubmit = vi.fn()

  const mockForm = {
    formState: { isSubmitting: false, isDirty: true, isValid: true },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateLanguageForm).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateLanguageForm>)
  })

  it("should render trigger and open dialog using internal state when open props are omitted", () => {
    render(
      <UpdateLanguage language={mockLanguage}>
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    expect(screen.getByTestId("trigger")).toBeInTheDocument()
    expect(screen.queryByTestId("form-dialog")).toBeNull()

    fireEvent.click(screen.getByTestId("dialog-trigger"))

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("update.title")
  })

  it("should call onSubmit when form is submitted", () => {
    render(
      <UpdateLanguage language={mockLanguage}>
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should invoke the close callback passed to useUpdateLanguageForm to close the dialog", () => {
    let capturedOnSuccess: (() => void) | undefined

    vi.mocked(useUpdateLanguageForm).mockImplementation(
      (_language, _open, _t, onSuccess) => {
        capturedOnSuccess = onSuccess
        return {
          form: mockForm,
          onSubmit: mockOnSubmit,
          loading: false,
        } as unknown as ReturnType<typeof useUpdateLanguageForm>
      }
    )

    render(
      <UpdateLanguage language={mockLanguage}>
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    fireEvent.click(screen.getByTestId("dialog-trigger"))
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    act(() => {
      capturedOnSuccess!()
    })

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should pass language, open state, t and close callback to useUpdateLanguageForm", () => {
    render(
      <UpdateLanguage language={mockLanguage}>
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    expect(useUpdateLanguageForm).toHaveBeenCalledWith(
      mockLanguage,
      false,
      expect.any(Function),
      expect.any(Function)
    )
  })

  it("should respect controlled open and onOpenChange props", () => {
    const mockOnOpenChange = vi.fn()

    const { rerender } = render(
      <UpdateLanguage
        language={mockLanguage}
        open={true}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    expect(screen.getByTestId("form-dialog")).toBeInTheDocument()

    rerender(
      <UpdateLanguage
        language={mockLanguage}
        open={false}
        onOpenChange={mockOnOpenChange}
      >
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    expect(screen.queryByTestId("form-dialog")).toBeNull()
  })

  it("should disable submit button when form is invalid", () => {
    vi.mocked(useUpdateLanguageForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: false },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateLanguageForm>)

    render(
      <UpdateLanguage language={mockLanguage} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when form is not dirty", () => {
    vi.mocked(useUpdateLanguageForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: false, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: false,
    } as unknown as ReturnType<typeof useUpdateLanguageForm>)

    render(
      <UpdateLanguage language={mockLanguage} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })

  it("should disable submit button when mutation is loading", () => {
    vi.mocked(useUpdateLanguageForm).mockReturnValue({
      form: {
        formState: { isSubmitting: false, isDirty: true, isValid: true },
      },
      onSubmit: mockOnSubmit,
      loading: true,
    } as unknown as ReturnType<typeof useUpdateLanguageForm>)

    render(
      <UpdateLanguage language={mockLanguage} open={true}>
        <button data-testid="trigger">Edit</button>
      </UpdateLanguage>
    )

    expect(screen.getByTestId("dialog-submit")).toBeDisabled()
  })
})

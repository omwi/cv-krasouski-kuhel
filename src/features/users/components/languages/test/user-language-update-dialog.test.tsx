import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { UserLanguage } from "@/types/graphql-types"

import { useUserLanguageUpdateForm } from "../../../hooks/languages/use-user-language-update-form"
import UserLanguageUpdateDialog from "../user-language-update-dialog"

interface LanguageFormFields {
  proficiency: string
}

// Mock custom hookuseUserLanguageUpdateForm
vi.mock("../../../hooks/languages/use-user-language-update-form", () => ({
  useUserLanguageUpdateForm: vi.fn(),
}))

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

// Mock FormDialog to keep test isolated
vi.mock("@/components/shared/dialog/form-dialog", () => ({
  FormDialog: ({
    children,
    title,
    submitLabel,
    onSubmit,
  }: {
    children: React.ReactNode
    title: string
    submitLabel: string
    onSubmit: () => void
  }) => (
    <form
      data-testid="form-dialog"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <h2 data-testid="dialog-title">{title}</h2>
      <button type="submit">{submitLabel}</button>
      {children}
    </form>
  ),
}))

// Mock LanguageProficiencySelect
vi.mock("@/features/languages/components/language-proficiency-select", () => ({
  default: ({
    value,
    onValueChange,
  }: {
    value?: string
    onValueChange?: (val: string) => void
  }) => (
    <select
      data-testid="proficiency-select"
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      <option value="A1">A1</option>
      <option value="B2">B2</option>
    </select>
  ),
}))

const mockUserLanguage: UserLanguage = {
  __typename: "LanguageProficiency",
  name: "English",
  proficiency: "B2",
}

const TestWrapper = ({
  onSubmitAction = vi.fn(),
}: {
  onSubmitAction?: () => void
}) => {
  const { control } = useForm<LanguageFormFields>({
    defaultValues: {
      proficiency: "B2",
    },
  })

  vi.mocked(useUserLanguageUpdateForm).mockReturnValue({
    control,
    reset: vi.fn(),
    isSubmitReady: true,
    onSubmit: (e) => {
      e?.preventDefault()
      onSubmitAction()
      return Promise.resolve()
    },
    loading: false,
    open: true,
    setOpen: vi.fn(),
  })

  return (
    <UserLanguageUpdateDialog userId="123" userLanguage={mockUserLanguage}>
      <button data-testid="trigger-btn">Edit Language</button>
    </UserLanguageUpdateDialog>
  )
}

describe("UserLanguageUpdateDialog", () => {
  it("should render dialog content with correct title and proficiency default values", () => {
    render(<TestWrapper />)

    // Verify title and static language name
    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "dialog.update"
    )
    expect(screen.getAllByText("English").length).toBeGreaterThan(0)

    // Verify select value is B2
    expect(screen.getByTestId("proficiency-select")).toHaveValue("B2")
  })

  it("should trigger submit handler on form submission", () => {
    const mockOnSubmit = vi.fn()
    render(<TestWrapper onSubmitAction={mockOnSubmit} />)

    // Submit mock FormDialog form
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })
})

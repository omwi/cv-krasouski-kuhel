import { Dispatch, SetStateAction } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useSelection } from "@/components/shared/selection/selection-provider"
import { useUserLanguageAddForm } from "@/features/users/hooks/languages/use-user-language-add-form"
import { useUserLanguageUpdateForm } from "@/features/users/hooks/languages/use-user-language-update-form"
import { useUserLanguagesDelete } from "@/features/users/hooks/languages/use-user-languages-delete"
import { usePermissions } from "@/hooks/use-permissions"
import { UserLanguage } from "@/types/graphql-types"

import UserLanguages from "../user-languages"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
  useQuery: vi.fn(() => ({
    data: {
      languages: [
        { id: "english-id", name: "English" },
        { id: "russian-id", name: "Russian" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/selection/selection-provider", () => ({
  useSelection: vi.fn(),
}))

vi.mock("@/features/users/hooks/languages/use-user-language-add-form", () => ({
  useUserLanguageAddForm: vi.fn(),
}))

vi.mock(
  "@/features/users/hooks/languages/use-user-language-update-form",
  () => ({
    useUserLanguageUpdateForm: vi.fn(),
  })
)

vi.mock("@/features/users/hooks/languages/use-user-languages-delete", () => ({
  useUserLanguagesDelete: vi.fn(),
}))

vi.mock("@/features/languages/components/language-select", () => ({
  default: ({
    value,
    onValueChange,
    userLanguages,
  }: {
    value: string
    onValueChange: (v: string) => void
    userLanguages?: UserLanguage[]
  }) => (
    <select
      data-testid="language-select"
      value={value || ""}
      onChange={(e) => onValueChange(e.target.value)}
      data-has-languages={userLanguages ? "true" : "false"}
    >
      <option value="">Select language</option>
      <option value="English">English</option>
      <option value="Russian">Russian</option>
    </select>
  ),
}))

vi.mock("@/features/languages/components/language-proficiency-select", () => ({
  default: ({
    value,
    onValueChange,
  }: {
    value: string
    onValueChange: (v: string) => void
  }) => (
    <select
      data-testid="proficiency-select"
      value={value || ""}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select proficiency</option>
      <option value="A1">A1</option>
      <option value="B2">B2</option>
      <option value="C2">C2</option>
    </select>
  ),
}))

const mockLanguages: UserLanguage[] = [
  {
    __typename: "LanguageProficiency",
    name: "English",
    proficiency: "B2",
  },
  {
    __typename: "LanguageProficiency",
    name: "Russian",
    proficiency: "C2",
  },
]

let mockAddForm: {
  isSubmitReady: boolean
  onSubmit: (e?: { preventDefault?: () => void }) => Promise<void>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  reset: () => void
  loading: boolean
}
let mockUpdateForm: {
  isSubmitReady: boolean
  onSubmit: (e?: { preventDefault?: () => void }) => Promise<void>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  reset: () => void
  loading: boolean
}
let mockDeleteActions: ReturnType<typeof useUserLanguagesDelete>
let mockSelectionState: ReturnType<typeof useSelection>
let activeUpdateLanguageName: string | null = null

const TestComponent = () => {
  const { control: addControl } = useForm({
    defaultValues: {
      languageName: "",
      proficiency: "A1",
    },
  })

  const { control: updateControl } = useForm({
    defaultValues: {
      proficiency: "B2",
    },
  })

  vi.mocked(useUserLanguageAddForm).mockReturnValue({
    control: addControl,
    ...mockAddForm,
  } as unknown as ReturnType<typeof useUserLanguageAddForm>)

  vi.mocked(useUserLanguageUpdateForm).mockImplementation(
    (userId, userLanguage) => {
      return {
        control: updateControl,
        ...mockUpdateForm,
        open:
          mockUpdateForm.open && activeUpdateLanguageName === userLanguage.name,
      } as unknown as ReturnType<typeof useUserLanguageUpdateForm>
    }
  )

  return <UserLanguages userId="123" />
}

describe("UserLanguages Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        profile: {
          languages: mockLanguages,
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => true,
    } as unknown as ReturnType<typeof usePermissions>)

    mockSelectionState = {
      isSelecting: false,
      isSelected: vi.fn(() => false),
      toggle: vi.fn(),
      selectedValues: new Set(),
      startSelection: vi.fn(),
      stopSelection: vi.fn(),
      hasSelection: false,
      selectedCount: 0,
    }
    vi.mocked(useSelection).mockReturnValue(mockSelectionState)

    mockDeleteActions = {
      handleStartDelete: vi.fn(),
      handleCancelDelete: vi.fn(),
      handleConfirmDelete: vi.fn(),
      loading: false,
    }
    vi.mocked(useUserLanguagesDelete).mockReturnValue(mockDeleteActions)

    mockAddForm = {
      isSubmitReady: true,
      onSubmit: vi.fn((e) => {
        e?.preventDefault()
        return Promise.resolve()
      }),
      open: false,
      setOpen: vi.fn(),
      reset: vi.fn(),
      loading: false,
    }

    mockUpdateForm = {
      isSubmitReady: true,
      onSubmit: vi.fn((e) => {
        e?.preventDefault()
        return Promise.resolve()
      }),
      open: false,
      setOpen: vi.fn(),
      reset: vi.fn(),
      loading: false,
    }

    activeUpdateLanguageName = null
  })

  it("should render languages list correctly", () => {
    render(<TestComponent />)

    // Check language names and proficiency are rendered
    expect(screen.getByText("English")).toBeInTheDocument()
    expect(screen.getByText("B2")).toBeInTheDocument()
    expect(screen.getByText("Russian")).toBeInTheDocument()
    expect(screen.getByText("C2")).toBeInTheDocument()
  })

  it("should render actions, trigger update dialog and submit when user has permissions", () => {
    mockUpdateForm.open = true
    activeUpdateLanguageName = "English"
    render(<TestComponent />)

    // Trigger update dialog by clicking language item
    const englishBtn = screen.getByRole("button", { name: /English/ })
    expect(englishBtn).not.toBeDisabled()

    // Dialog form should show because open is true
    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "dialog.update"
    )
    expect(screen.getByTestId("proficiency-select")).toHaveValue("B2")

    // Submit form
    fireEvent.submit(screen.getByTestId("form-dialog"))
    expect(mockUpdateForm.onSubmit).toHaveBeenCalled()
  })

  it("should disable language edit and hide actions when user lacks permissions", () => {
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => false,
    } as unknown as ReturnType<typeof usePermissions>)

    render(<TestComponent />)

    // Language item button should be disabled
    const englishBtn = screen.getByRole("button", { name: /English/ })
    expect(englishBtn).toBeDisabled()

    // Actions block should be hidden
    const actionsBlock = screen.getByTestId("user-languages-actions")
    expect(actionsBlock).toHaveClass("hidden")
  })

  it("should trigger add language dialog and submit successfully", () => {
    mockAddForm.open = true
    render(<TestComponent />)

    const addBtn = screen.getByRole("button", { name: "add-language" })
    expect(addBtn).toBeInTheDocument()

    // Verify dialog title
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("dialog.add")

    // Fill form and submit
    const langSelect = screen.getByTestId("language-select")
    const profSelect = screen.getByTestId("proficiency-select")

    fireEvent.change(langSelect, { target: { value: "Russian" } })
    fireEvent.change(profSelect, { target: { value: "C2" } })

    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockAddForm.onSubmit).toHaveBeenCalled()
    expect(langSelect.getAttribute("data-has-languages")).toBe("true")
  })

  it("should support selection mode for deletion", () => {
    mockSelectionState.isSelecting = true
    mockSelectionState.isSelected = vi.fn((name) => name === "English")
    mockSelectionState.hasSelection = true
    mockSelectionState.selectedCount = 1

    render(<TestComponent />)

    // Buttons should change to selection buttons
    expect(screen.getByText("cancel")).toBeInTheDocument()
    expect(screen.getByText("delete")).toBeInTheDocument()

    // Language item click should toggle selection instead of dialog
    const englishBtn = screen.getByRole("button", { name: /English/ })
    fireEvent.click(englishBtn)

    expect(mockSelectionState.toggle).toHaveBeenCalledWith("English")

    // Confirm/Cancel buttons call the right hook handlers
    fireEvent.click(screen.getByText("cancel"))
    expect(mockDeleteActions.handleCancelDelete).toHaveBeenCalled()

    fireEvent.click(screen.getByText("delete"))
    expect(mockDeleteActions.handleConfirmDelete).toHaveBeenCalled()
  })

  it("should hide select for deletion button when there are no languages", () => {
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        profile: {
          languages: [],
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(<TestComponent />)

    // "Remove language" button is hidden/disabled
    const deleteTrigger = screen.getByText("remove-language").closest("button")
    expect(deleteTrigger).toHaveClass("hidden")
    expect(deleteTrigger).toBeDisabled()
  })
})

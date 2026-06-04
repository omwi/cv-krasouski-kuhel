import { Dispatch, SetStateAction } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useSelection } from "@/components/shared/selection/selection-provider"
import { useUserSkillAddForm } from "@/features/users/hooks/skills/use-user-skill-add-form"
import { useUserSkillUpdateForm } from "@/features/users/hooks/skills/use-user-skill-update-form"
import { useUserSkillsDelete } from "@/features/users/hooks/skills/use-user-skills-delete"
import { usePermissions } from "@/hooks/use-permissions"
import { UserSkill } from "@/types/graphql-types"

import UserSKills from "./user-skills"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
  useQuery: vi.fn(() => ({
    data: {
      skills: [
        { id: "react-id", name: "React" },
        { id: "vue-id", name: "Vue" },
        { id: "node-id", name: "Node.js" },
      ],
    },
  })),
}))

vi.mock("@/components/shared/selection/selection-provider", () => ({
  useSelection: vi.fn(),
}))

vi.mock("@/features/users/hooks/skills/use-user-skill-add-form", () => ({
  useUserSkillAddForm: vi.fn(),
}))

vi.mock("@/features/users/hooks/skills/use-user-skill-update-form", () => ({
  useUserSkillUpdateForm: vi.fn(),
}))

vi.mock("@/features/users/hooks/skills/use-user-skills-delete", () => ({
  useUserSkillsDelete: vi.fn(),
}))

vi.mock("@/features/skills/components/skill-select", () => ({
  default: ({
    value,
    onValueChange,
    excludedNames,
  }: {
    value: string
    onValueChange: (v: string) => void
    excludedNames?: string[]
  }) => (
    <select
      data-testid="skill-select"
      value={value || ""}
      onChange={(e) => onValueChange(e.target.value)}
      data-excluded={excludedNames?.join(",")}
    >
      <option value="">Select skill</option>
      <option value="react-id">React</option>
      <option value="vue-id">Vue</option>
      <option value="node-id">Node.js</option>
    </select>
  ),
}))

vi.mock("@/features/skills/components/skill-mastery-select", () => ({
  default: ({
    value,
    onValueChange,
  }: {
    value: string
    onValueChange: (v: string) => void
  }) => (
    <select
      data-testid="mastery-select"
      value={value || ""}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select mastery</option>
      <option value="Novice">Novice</option>
      <option value="Advanced">Advanced</option>
    </select>
  ),
}))

const mockSkills: UserSkill[] = [
  {
    __typename: "SkillMastery",
    name: "React",
    categoryId: "frontend",
    mastery: "Advanced",
  },
  {
    __typename: "SkillMastery",
    name: "Node.js",
    categoryId: "backend",
    mastery: "Novice",
  },
  {
    __typename: "SkillMastery",
    name: "Git",
    categoryId: null,
    mastery: "Advanced",
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
let mockDeleteActions: ReturnType<typeof useUserSkillsDelete>
let mockSelectionState: ReturnType<typeof useSelection>
let activeUpdateSkillName: string | null = null

const createMockSkillForm = () => ({
  isSubmitReady: true,
  onSubmit: vi.fn((e?: { preventDefault?: (() => void) | undefined }) => {
    if (e?.preventDefault) e.preventDefault()
    return Promise.resolve()
  }),
  open: false,
  setOpen: vi.fn() as Dispatch<SetStateAction<boolean>>,
  reset: vi.fn(),
  loading: false,
})

const TestComponent = () => {
  const { control: addControl } = useForm({
    defaultValues: {
      skillId: "",
      mastery: "Novice",
    },
  })

  const { control: updateControl } = useForm({
    defaultValues: {
      mastery: "Advanced",
    },
  })

  vi.mocked(useUserSkillAddForm).mockReturnValue({
    control: addControl,
    ...mockAddForm,
  } as unknown as ReturnType<typeof useUserSkillAddForm>)

  vi.mocked(useUserSkillUpdateForm).mockImplementation((userId, userSkill) => {
    return {
      control: updateControl,
      ...mockUpdateForm,
      open: mockUpdateForm.open && activeUpdateSkillName === userSkill.name,
    } as unknown as ReturnType<typeof useUserSkillUpdateForm>
  })

  return <UserSKills userId="123" />
}

describe("UserSkills Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        profile: {
          skills: mockSkills,
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
    vi.mocked(useUserSkillsDelete).mockReturnValue(mockDeleteActions)

    mockAddForm = createMockSkillForm()

    mockUpdateForm = createMockSkillForm()

    activeUpdateSkillName = null
  })

  it("should render categories and skills grouped correctly", () => {
    render(<TestComponent />)

    // Check categories are translated and rendered
    expect(screen.getByText("category.frontend")).toBeInTheDocument()
    expect(screen.getByText("category.backend")).toBeInTheDocument()

    // Check skill names are rendered
    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("Node.js")).toBeInTheDocument()
  })

  it("should render actions, trigger update dialog and submit when user has permissions", () => {
    mockUpdateForm.open = true
    activeUpdateSkillName = "React"
    render(<TestComponent />)

    // Trigger update dialog by clicking skill
    const reactBtn = screen.getByRole("button", { name: "React" })
    expect(reactBtn).not.toBeDisabled()

    // Dialog form should show because open is true
    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "dialog.update"
    )
    expect(screen.getByTestId("mastery-select")).toHaveValue("Advanced")

    // Submit form
    fireEvent.submit(screen.getByTestId("form-dialog"))
    expect(mockUpdateForm.onSubmit).toHaveBeenCalled()
  })

  it("should disable skill edit and hide actions when user lacks permissions", () => {
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => false,
    } as unknown as ReturnType<typeof usePermissions>)

    render(<TestComponent />)

    // Skill should be disabled
    const reactBtn = screen.getByRole("button", { name: "React" })
    expect(reactBtn).toBeDisabled()

    // Actions block should be hidden
    const actionsBlock = screen.getByTestId("user-skills-actions")
    expect(actionsBlock).toHaveClass("hidden")
  })

  it("should trigger add skill dialog and submit successfully", () => {
    mockAddForm.open = true
    render(<TestComponent />)

    const addBtn = screen.getByRole("button", { name: "add-skill" })
    expect(addBtn).toBeInTheDocument()

    // Verify dialog title
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("dialog.add")

    // Fill form and submit
    const skillSelect = screen.getByTestId("skill-select")
    const masterySelect = screen.getByTestId("mastery-select")

    fireEvent.change(skillSelect, { target: { value: "vue-id" } })
    fireEvent.change(masterySelect, { target: { value: "Advanced" } })

    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockAddForm.onSubmit).toHaveBeenCalled()
    expect(skillSelect.getAttribute("data-excluded")).toBe("React,Node.js,Git")
  })

  it("should support selection mode for deletion", () => {
    mockSelectionState.isSelecting = true
    mockSelectionState.isSelected = vi.fn((name) => name === "React")
    mockSelectionState.hasSelection = true
    mockSelectionState.selectedCount = 1

    render(<TestComponent />)

    // Buttons should change to selection buttons
    expect(screen.getByText("cancel")).toBeInTheDocument()
    expect(screen.getByText("delete")).toBeInTheDocument()

    // Skill item click should toggle selection instead of dialog
    const reactBtn = screen.getByRole("button", { name: "React" })
    fireEvent.click(reactBtn)

    expect(mockSelectionState.toggle).toHaveBeenCalledWith("React")

    // Confirm/Cancel buttons call the right hook handlers
    fireEvent.click(screen.getByText("cancel"))
    expect(mockDeleteActions.handleCancelDelete).toHaveBeenCalled()

    fireEvent.click(screen.getByText("delete"))
    expect(mockDeleteActions.handleConfirmDelete).toHaveBeenCalled()
  })

  it("should hide select for deletion button when there are no skills", () => {
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        profile: {
          skills: [],
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(<TestComponent />)

    // "Remove skills" button is hidden/disabled
    const deleteTrigger = screen.getByText("remove-skills").closest("button")
    expect(deleteTrigger).toHaveClass("hidden")
    expect(deleteTrigger).toBeDisabled()
  })
})

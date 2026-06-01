import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { UserSkill } from "@/types/graphql-types"

import { useUserSkillUpdateForm } from "../../../hooks/skills/use-user-skill-update-form"
import UserSkillUpdateDialog from "../user-skill-update-dialog"

interface SkillFormFields {
  mastery: string
}

vi.mock("../../../hooks/skills/use-user-skill-update-form", () => ({
  useUserSkillUpdateForm: vi.fn(),
}))

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

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

vi.mock("@/features/skills/components/skill-mastery-select", () => ({
  default: ({
    value,
    onValueChange,
  }: {
    value?: string
    onValueChange?: (val: string) => void
  }) => (
    <select
      data-testid="mastery-select"
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      <option value="Novice">Beginner</option>
      <option value="Advanced">Advanced</option>
    </select>
  ),
}))

const mockUserSkill: UserSkill = {
  __typename: "SkillMastery",
  name: "React",
  categoryId: "frontend",
  mastery: "Advanced",
}

const TestWrapper = ({
  onSubmitAction = vi.fn(),
}: {
  onSubmitAction?: () => void
}) => {
  const { control } = useForm<SkillFormFields>({
    defaultValues: {
      mastery: "Advanced",
    },
  })

  vi.mocked(useUserSkillUpdateForm).mockReturnValue({
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
    <UserSkillUpdateDialog userId="123" userSkill={mockUserSkill}>
      <button data-testid="trigger-btn">Edit Skill</button>
    </UserSkillUpdateDialog>
  )
}

describe("UserSkillUpdateDialog", () => {
  it("should render dialog content with correct title and mastery default values", () => {
    render(<TestWrapper />)

    // Verify title and static skill name
    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "dialog.update"
    )
    expect(screen.getAllByText("React").length).toBeGreaterThan(0)

    // Verify select value is Advanced
    expect(screen.getByTestId("mastery-select")).toHaveValue("Advanced")
  })

  it("should trigger submit handler on form submission", () => {
    const mockOnSubmit = vi.fn()
    render(<TestWrapper onSubmitAction={mockOnSubmit} />)

    // Submit mock FormDialog form
    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })
})

import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SkillUpdateDialog } from "@/components/shared/skills/skill-update-dialog"
import { useCvSkillUpdateForm } from "@/features/cvs/hooks/skills/use-update-cv-skill-form"
import { CvSkill, CvUserId } from "@/types/graphql-types"

import CvSkillUpdateDialog from "./cv-skill-update-dialog"

vi.mock("@/features/cvs/hooks/skills/use-update-cv-skill-form", () => ({
  useCvSkillUpdateForm: vi.fn(),
}))

vi.mock("@/components/shared/skills/skill-update-dialog", () => ({
  SkillUpdateDialog: vi.fn(({ children, skill, open }) => (
    <div
      data-testid="skill-update-dialog"
      data-skill={skill?.name}
      data-open={open}
    >
      {children}
    </div>
  )),
}))

describe("CvSkillUpdateDialog", () => {
  const mockCvUserId = {
    id: "cv-123",
  } as unknown as CvUserId

  const mockCvSkill = {
    id: "cs-12",
    name: "React",
    mastery: "Expert",
  } as unknown as CvSkill

  const mockFormProps = {
    control: {} as unknown as ReturnType<
      typeof useCvSkillUpdateForm
    >["control"],
    reset: vi.fn(),
    isSubmitReady: true,
    onSubmit: vi.fn(),
    loading: false,
    open: true,
    setOpen: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCvSkillUpdateForm).mockReturnValue(
      mockFormProps as unknown as ReturnType<typeof useCvSkillUpdateForm>
    )
  })

  it("should render SkillUpdateDialog with correct props and children", () => {
    render(
      <CvSkillUpdateDialog cvUserId={mockCvUserId} cvSkill={mockCvSkill}>
        <button data-testid="trigger">Trigger Edit</button>
      </CvSkillUpdateDialog>
    )

    expect(useCvSkillUpdateForm).toHaveBeenCalledWith(mockCvUserId, mockCvSkill)
    expect(SkillUpdateDialog).toHaveBeenCalled()
    expect(vi.mocked(SkillUpdateDialog).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        open: true,
        skill: mockCvSkill,
      })
    )

    expect(screen.getByTestId("skill-update-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("skill-update-dialog")).toHaveAttribute(
      "data-skill",
      "React"
    )
    expect(screen.getByTestId("trigger")).toBeInTheDocument()
  })
})

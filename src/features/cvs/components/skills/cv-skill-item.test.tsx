import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import SharedSkillItem from "@/components/shared/skills/shared-skill-item"
import { usePermissions } from "@/hooks/use-permissions"
import { CvSkill, CvUserId } from "@/types/graphql-types"

import CvSKillItem from "./cv-skill-item"

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(),
}))

vi.mock("@/components/shared/skills/shared-skill-item", () => ({
  default: vi.fn(({ skill, disabled, renderDialog }) => (
    <div data-testid="shared-skill-item" data-disabled={disabled}>
      <span>{skill.name}</span>
      <div data-testid="dialog-container">
        {renderDialog
          ? renderDialog(<button data-testid="inner-trigger" />)
          : null}
      </div>
    </div>
  )),
}))

vi.mock("@/features/cvs/components/skills/cv-skill-update-dialog", () => ({
  default: vi.fn(({ children, cvUserId, cvSkill }) => (
    <div
      data-testid="cv-skill-update-dialog"
      data-cv-id={cvUserId.id}
      data-skill-name={cvSkill.name}
    >
      {children}
    </div>
  )),
}))

describe("CvSKillItem", () => {
  const mockSkill = {
    name: "TypeScript",
    categoryId: "frontend",
    mastery: "Expert",
  } as unknown as CvSkill

  const mockCvUserId = {
    id: "cv-123",
    user: { id: "user-456" },
  } as unknown as CvUserId

  const mockCanUpdateCv = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(usePermissions).mockReturnValue({
      canUpdateCv: mockCanUpdateCv,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should render SharedSkillItem with disabled=false if update permission is granted", () => {
    mockCanUpdateCv.mockReturnValue(true)

    render(<CvSKillItem skill={mockSkill} cvUserId={mockCvUserId} />)

    expect(mockCanUpdateCv).toHaveBeenCalledWith("user-456")
    expect(SharedSkillItem).toHaveBeenCalled()
    expect(vi.mocked(SharedSkillItem).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        skill: mockSkill,
        disabled: false,
      })
    )

    expect(screen.getByTestId("shared-skill-item")).toBeInTheDocument()
    expect(screen.getByTestId("shared-skill-item")).toHaveAttribute(
      "data-disabled",
      "false"
    )

    // Verify dialog rendering
    expect(screen.getByTestId("cv-skill-update-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("cv-skill-update-dialog")).toHaveAttribute(
      "data-cv-id",
      "cv-123"
    )
    expect(screen.getByTestId("cv-skill-update-dialog")).toHaveAttribute(
      "data-skill-name",
      "TypeScript"
    )
    expect(screen.getByTestId("inner-trigger")).toBeInTheDocument()
  })

  it("should render SharedSkillItem with disabled=true if update permission is denied", () => {
    mockCanUpdateCv.mockReturnValue(false)

    render(<CvSKillItem skill={mockSkill} cvUserId={mockCvUserId} />)

    expect(screen.getByTestId("shared-skill-item")).toHaveAttribute(
      "data-disabled",
      "true"
    )
  })
})

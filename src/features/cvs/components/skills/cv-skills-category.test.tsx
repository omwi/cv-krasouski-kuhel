import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import SharedSkillsCategory from "@/components/shared/skills/shared-skills-category"
import CvSKillItem from "@/features/cvs/components/skills/cv-skill-item"
import { CvSkill, CvUserId } from "@/types/graphql-types"

import CvSKillsCategory from "./cv-skills-category"

vi.mock("@/components/shared/skills/shared-skills-category", () => ({
  default: vi.fn(({ children, category }) => (
    <div data-testid="shared-skills-category" data-category={category}>
      {children}
    </div>
  )),
}))

vi.mock("@/features/cvs/components/skills/cv-skill-item", () => ({
  default: vi.fn(({ skill, cvUserId }) => (
    <div data-testid="cv-skill-item" data-cv={cvUserId.id}>
      {skill.name}
    </div>
  )),
}))

describe("CvSKillsCategory", () => {
  it("should render SharedSkillsCategory and map skills to CvSKillItem", () => {
    const mockSkills = [
      { name: "React" },
      { name: "Vue" },
    ] as unknown as CvSkill[]

    const mockCvUserId = { id: "cv-123" } as unknown as CvUserId

    render(
      <CvSKillsCategory
        category="frontend"
        skills={mockSkills}
        cvUserId={mockCvUserId}
      />
    )

    expect(SharedSkillsCategory).toHaveBeenCalled()
    expect(vi.mocked(SharedSkillsCategory).mock.calls[0][0]).toEqual(
      expect.objectContaining({ category: "frontend" })
    )

    expect(CvSKillItem).toHaveBeenCalledTimes(2)
    expect(vi.mocked(CvSKillItem).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        skill: expect.objectContaining({ name: "React" }),
        cvUserId: mockCvUserId,
      })
    )

    expect(screen.getByTestId("shared-skills-category")).toBeInTheDocument()
    expect(screen.getByTestId("shared-skills-category")).toHaveAttribute(
      "data-category",
      "frontend"
    )
    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("Vue")).toBeInTheDocument()
  })
})

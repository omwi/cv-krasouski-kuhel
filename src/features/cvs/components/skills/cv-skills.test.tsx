import { useSuspenseQuery } from "@apollo/client/react"
import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CvSkillsActions from "@/features/cvs/components/skills/cv-skills-actions"
import CvSKillsCategory from "@/features/cvs/components/skills/cv-skills-category"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"

import CvSKills from "./cv-skills"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/features/cvs/components/skills/cv-skills-category", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/cvs/components/skills/cv-skills-actions", () => ({
  default: vi.fn(() => <span />),
}))

describe("CvSKills", () => {
  const mockCv = {
    id: "cv-123",
    user: { id: "user-456" },
    skills: [
      { id: "s-1", name: "React", categoryId: "frontend" },
      { id: "s-2", name: "Webpack", categoryId: "frontend" },
      { id: "s-3", name: "Node.js", categoryId: "backend" },
      { id: "s-4", name: "Git", categoryId: null },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: { cv: mockCv },
    } as unknown as ReturnType<typeof useSuspenseQuery>)
  })

  it("should render CvSKillsCategories grouped by categoryId and CvSkillsActions with correct props", () => {
    render(<CvSKills cvId="cv-123" />)

    expect(useSuspenseQuery).toHaveBeenCalledWith(GET_CV_SKILLS, {
      variables: { cvId: "cv-123" },
    })

    // Grouping checks: should have frontend, backend, other categories
    expect(CvSKillsCategory).toHaveBeenCalledTimes(3)

    // Verify first call (frontend)
    expect(
      vi
        .mocked(CvSKillsCategory)
        .mock.calls.find((call) => call[0].category === "frontend")?.[0]
    ).toEqual(
      expect.objectContaining({
        category: "frontend",
        skills: expect.arrayContaining([
          expect.objectContaining({ name: "React" }),
          expect.objectContaining({ name: "Webpack" }),
        ]),
        cvUserId: mockCv,
      })
    )

    // Actions check
    expect(vi.mocked(CvSkillsActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        hasSkills: true,
        cvUserId: mockCv,
      })
    )
  })

  it("should render actions with hasSkills=false if CV has no skills", () => {
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        cv: {
          id: "cv-123",
          user: { id: "user-456" },
          skills: [],
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(<CvSKills cvId="cv-123" />)

    expect(vi.mocked(CvSkillsActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        hasSkills: false,
      })
    )
  })
})

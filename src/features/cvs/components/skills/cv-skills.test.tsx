import { useSuspenseQuery } from "@apollo/client/react"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CvSKillsCategory from "@/features/cvs/components/skills/cv-skills-category"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"

import CvSKills from "./cv-skills"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/features/cvs/components/skills/cv-skills-category", () => ({
  default: vi.fn(({ category }) => (
    <div data-testid="cv-skills-category">{category}</div>
  )),
}))

vi.mock("@/features/cvs/components/skills/cv-skills-actions", () => ({
  default: vi.fn(({ hasSkills, cvUserId }) => (
    <div
      data-testid="cv-skills-actions"
      data-has-skills={hasSkills}
      data-cv={cvUserId?.id}
    />
  )),
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
    expect(screen.getAllByTestId("cv-skills-category")).toHaveLength(3)
    expect(screen.getByText("frontend")).toBeInTheDocument()
    expect(screen.getByText("backend")).toBeInTheDocument()
    expect(screen.getByText("other")).toBeInTheDocument()

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
    expect(screen.getByTestId("cv-skills-actions")).toBeInTheDocument()
    expect(screen.getByTestId("cv-skills-actions")).toHaveAttribute(
      "data-has-skills",
      "true"
    )
    expect(screen.getByTestId("cv-skills-actions")).toHaveAttribute(
      "data-cv",
      "cv-123"
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

    expect(screen.getByTestId("cv-skills-actions")).toHaveAttribute(
      "data-has-skills",
      "false"
    )
  })
})

import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  getSkillExperienceYears,
  getSkillLastUsedYear,
} from "@/features/cvs/utils/skill-experience"
import { CvProject, CvSkill } from "@/types/graphql-types"

import SkillsPreviewTable from "./skills-preview-table"

vi.mock("next-i18next/server", () => ({
  getT: vi.fn().mockResolvedValue({
    t: (key: string) => key,
  }),
}))

vi.mock("@/features/cvs/utils/skill-experience", () => ({
  getSkillExperienceYears: vi.fn(),
  getSkillLastUsedYear: vi.fn(),
}))

describe("SkillsPreviewTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSkillExperienceYears).mockReturnValue(3)
    vi.mocked(getSkillLastUsedYear).mockReturnValue(2023)
  })

  it("should render table headers and skill rows correctly", async () => {
    const mockSkills: CvSkill[] = [
      {
        __typename: "SkillMastery",
        name: "React",
        categoryId: "cat-1",
        mastery: "Advanced",
      },
    ]

    const mockProjects: CvProject[] = []
    const skillsByCategory: [string | null, CvSkill[]][] = [
      ["cat-1", mockSkills],
    ]

    // Render the async Server Component by resolving it first
    const Jsx = await SkillsPreviewTable({
      skillsByCategory,
      projects: mockProjects,
    })

    render(Jsx)

    // Verify table headers
    expect(screen.getByText("table.skills")).toBeInTheDocument()
    expect(screen.getByText("table.exp-in-years")).toBeInTheDocument()
    expect(screen.getByText("table.last-used")).toBeInTheDocument()

    // Verify row contents
    expect(screen.getByText("category.cat-1")).toBeInTheDocument()
    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("2023")).toBeInTheDocument()
  })

  it("should render category.other if categoryId is null", async () => {
    const mockSkills: CvSkill[] = [
      {
        __typename: "SkillMastery",
        name: "Webpack",
        categoryId: null,
        mastery: "Advanced",
      },
    ]

    const skillsByCategory: [string | null, CvSkill[]][] = [[null, mockSkills]]

    const Jsx = await SkillsPreviewTable({
      skillsByCategory,
      projects: [],
    })

    render(Jsx)

    expect(screen.getByText("category.other")).toBeInTheDocument()
    expect(screen.getByText("Webpack")).toBeInTheDocument()
  })

  it("should render empty string if experience or last used years are empty/0", async () => {
    vi.mocked(getSkillExperienceYears).mockReturnValue(0)
    vi.mocked(getSkillLastUsedYear).mockReturnValue(0)

    const mockSkills: CvSkill[] = [
      {
        __typename: "SkillMastery",
        name: "React",
        categoryId: "cat-1",
        mastery: "Advanced",
      },
    ]

    const skillsByCategory: [string | null, CvSkill[]][] = [
      ["cat-1", mockSkills],
    ]

    const Jsx = await SkillsPreviewTable({
      skillsByCategory,
      projects: [],
    })

    render(Jsx)

    const cells = screen.getAllByRole("cell")
    expect(cells[2]).toHaveTextContent("")
    expect(cells[3]).toHaveTextContent("")
  })
})

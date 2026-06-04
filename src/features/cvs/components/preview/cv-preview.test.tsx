import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { CvPreviewData } from "@/types/graphql-types"

import CvPreview from "./cv-preview"

vi.mock("next-i18next/server", () => ({
  getT: vi.fn().mockResolvedValue({
    t: (key: string) => key,
    lng: "en",
  }),
}))

vi.mock("@/features/cvs/components/preview/export-button", () => ({
  default: () => <button data-testid="export-btn">Export</button>,
}))

vi.mock("@/features/cvs/components/preview/skills-preview-table", () => ({
  default: () => <div data-testid="skills-table">Skills Table</div>,
}))

describe("CvPreview Component", () => {
  it("should render full CV preview correctly", async () => {
    const mockPreviewData: CvPreviewData = {
      cv: {
        __typename: "Cv",
        id: "cv-1",
        name: "My CV Name",
        description: "CV Description details",
        education: "Stanford University",
        user: {
          __typename: "User",
          id: "user-1",
          email: "test@example.com",
          position_name: "Frontend Engineer",
          profile: {
            __typename: "Profile",
            full_name: "Alex Smith",
          },
        },
        languages: [
          {
            __typename: "LanguageProficiency",
            name: "English",
            proficiency: "C1",
          },
        ],
      },
      skills: [
        {
          __typename: "SkillMastery",
          name: "React",
          categoryId: "frontend",
          mastery: "Expert",
        },
      ],
      projects: [
        {
          __typename: "CvProject",
          id: "proj-1",
          name: "E-Commerce platform",
          internal_name: "E-Commerce",
          description: "Built online store",
          domain: "Retail",
          start_date: "2021-01-01",
          end_date: "2022-01-01",
          responsibilities: ["Lead development", "Wrote tests"],
          roles: ["Lead FE"],
          environment: ["React", "Apollo", "Tailwind"],
          project: {
            __typename: "Project",
            id: "p-1",
          },
        },
      ],
    }

    const Jsx = await CvPreview({
      previewData: mockPreviewData,
    })

    render(Jsx)

    // Verify general info
    expect(screen.getByText("Alex Smith")).toBeInTheDocument()
    expect(screen.getByText("FRONTEND ENGINEER")).toBeInTheDocument()
    expect(screen.getByTestId("export-btn")).toBeInTheDocument()

    // Verify left/right sections
    expect(screen.getByText("Stanford University")).toBeInTheDocument()
    expect(screen.getByText("English – C1")).toBeInTheDocument()
    expect(screen.getByText("Retail")).toBeInTheDocument()
    expect(screen.getByText("CV Description details")).toBeInTheDocument()

    // Verify skills sections
    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByTestId("skills-table")).toBeInTheDocument()

    // Verify projects
    expect(screen.getByText("E-Commerce platform")).toBeInTheDocument()
    expect(screen.getByText("Built online store")).toBeInTheDocument()
    expect(screen.getByText("Lead FE")).toBeInTheDocument()
    expect(screen.getByText("React, Apollo, Tailwind")).toBeInTheDocument()
  })

  it("should fallback to user email if full_name is missing", async () => {
    const mockPreviewData: CvPreviewData = {
      cv: {
        __typename: "Cv",
        id: "cv-1",
        name: "My CV Name",
        description: "CV Description",
        education: "",
        user: {
          __typename: "User",
          id: "user-1",
          email: "only-email@example.com",
          position_name: null,
          profile: {
            __typename: "Profile",
            full_name: null,
          },
        },
        languages: [],
      },
      skills: [],
      projects: [],
    }

    const Jsx = await CvPreview({
      previewData: mockPreviewData,
    })

    render(Jsx)

    expect(screen.getByText("only-email@example.com")).toBeInTheDocument()
  })

  it("should render correctly with minimal optional fields / null values", async () => {
    const mockPreviewData: CvPreviewData = {
      cv: {
        __typename: "Cv",
        id: "cv-1",
        name: "My CV Name",
        description: "CV Description",
        education: null,
        user: null,
        languages: null,
      },
      skills: [
        {
          __typename: "SkillMastery",
          name: "JS",
          categoryId: null,
          mastery: "Advanced",
        },
      ],
      projects: [
        {
          __typename: "CvProject",
          id: "proj-1",
          name: "Minimal Project",
          internal_name: "MinProj",
          description: "Desc",
          domain: "IT",
          start_date: "2021-01-01",
          end_date: null,
          responsibilities: [],
          roles: [],
          environment: [],
          project: {
            __typename: "Project",
            id: "p-1",
          },
        },
      ],
    }

    const Jsx = await CvPreview({
      previewData: mockPreviewData,
    })

    render(Jsx)

    // Verify empty name fallback (empty string)
    const headings = screen.getAllByRole("heading", { level: 2 })
    expect(headings[0]).toHaveTextContent("")
    // Verify empty position name fallback
    const h3s = screen.getAllByRole("heading", { level: 3 })
    expect(h3s[0]).toHaveTextContent("")

    // Verify fallback category
    expect(screen.getByText("category.other")).toBeInTheDocument()
    expect(screen.getByText("JS")).toBeInTheDocument()

    // Verify project roles empty fallback (falls back to user position which is empty)
    // The "project-roles" SectionGroup should show empty indicator "-" since content is empty
    expect(screen.getAllByText("–")).toHaveLength(5)
  })

  it("should fallback to user position_name if project roles are empty", async () => {
    const mockPreviewData: CvPreviewData = {
      cv: {
        __typename: "Cv",
        id: "cv-1",
        name: "My CV Name",
        description: "CV Description",
        education: "",
        user: {
          __typename: "User",
          id: "user-1",
          email: "test@example.com",
          position_name: "Staff Developer",
          profile: {
            __typename: "Profile",
            full_name: null,
          },
        },
        languages: [],
      },
      skills: [],
      projects: [
        {
          __typename: "CvProject",
          id: "proj-1",
          name: "Minimal Project",
          internal_name: "MinProj",
          description: "Desc",
          domain: "IT",
          start_date: "2021-01-01",
          end_date: null,
          responsibilities: [],
          roles: [],
          environment: [],
          project: {
            __typename: "Project",
            id: "p-1",
          },
        },
      ],
    }

    const Jsx = await CvPreview({
      previewData: mockPreviewData,
    })

    render(Jsx)

    expect(screen.getByText("Staff Developer")).toBeInTheDocument()
  })

  it("should handle undefined projects gracefully (and throw during rendering/mapping)", async () => {
    const mockPreviewData = {
      cv: {
        __typename: "Cv" as const,
        id: "cv-1",
        name: "My CV Name",
        description: "CV Description",
        education: "",
        user: null,
        languages: [],
      },
      skills: [],
      projects: undefined as unknown as CvProject[],
    }

    await expect(
      CvPreview({
        previewData: mockPreviewData,
      })
    ).rejects.toThrow()
  })
})

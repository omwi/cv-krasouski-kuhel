import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import ProjectDetails from "./project-details"

vi.mock("next-i18next/server", () => ({
  getT: vi.fn().mockResolvedValue({
    t: (key: string) => key,
    lng: "en",
  }),
}))

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}))

vi.mock(
  "@/features/projects/components/actions/update-project-wrapper",
  () => ({
    ProjectActionsWrapper: () => (
      <div data-testid="project-actions">Actions</div>
    ),
  })
)

vi.mock("@/utils/date", () => ({
  parseUtcToLocal: vi.fn((date) => (date ? new Date(date) : null)),
  toHumanDate: vi.fn(() => "Jan 2024"),
}))

describe("ProjectDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render project details correctly", async () => {
    const project = {
      id: "1",
      name: "E-Commerce Platform",
      internal_name: "ecommerce-platform",
      domain: "Retail",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      description: "Large online shopping platform",
      environment: ["React", "GraphQL", "Tailwind"],
    }

    const Jsx = await ProjectDetails({ project } as never)

    render(Jsx)

    expect(
      screen.getByRole("heading", {
        name: "E-Commerce Platform",
      })
    ).toBeInTheDocument()

    expect(screen.getByText("name: E-Commerce Platform")).toBeInTheDocument()

    expect(
      screen.getByText("internal-name: ecommerce-platform")
    ).toBeInTheDocument()

    expect(screen.getByText("domain: Retail")).toBeInTheDocument()

    expect(
      screen.getByText("Large online shopping platform")
    ).toBeInTheDocument()

    expect(screen.getAllByText(/Jan 2024/)).toHaveLength(2)

    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("GraphQL")).toBeInTheDocument()
    expect(screen.getByText("Tailwind")).toBeInTheDocument()

    expect(screen.getByTestId("project-actions")).toBeInTheDocument()
  })

  it("should render fallback values when project fields are empty", async () => {
    const project = {
      id: "1",
      name: null,
      internal_name: null,
      domain: null,
      start_date: null,
      end_date: null,
      description: null,
      environment: [],
    }

    const Jsx = await ProjectDetails({ project } as never)

    render(Jsx)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("-")

    expect(screen.getByText("name: -")).toBeInTheDocument()
    expect(screen.getByText("internal-name: -")).toBeInTheDocument()
    expect(screen.getByText("domain: -")).toBeInTheDocument()

    expect(screen.getByText("no-description")).toBeInTheDocument()

    expect(screen.getByText("no-environment")).toBeInTheDocument()
  })

  it("should render 'till-now' when end_date is missing", async () => {
    const project = {
      id: "1",
      name: "Active Project",
      internal_name: "active-project",
      domain: "Finance",
      start_date: "2024-01-01",
      end_date: null,
      description: "Description",
      environment: ["React"],
    }

    const Jsx = await ProjectDetails({ project } as never)

    render(Jsx)

    expect(screen.getByText("Jan 2024")).toBeInTheDocument()
    expect(screen.getByText("- till-now")).toBeInTheDocument()
  })

  it("should not render date section when start_date is missing", async () => {
    const project = {
      id: "1",
      name: "No Dates",
      internal_name: "no-dates",
      domain: "IT",
      start_date: null,
      end_date: "2024-12-31",
      description: "Description",
      environment: ["React"],
    }

    const Jsx = await ProjectDetails({ project } as never)

    render(Jsx)

    expect(screen.queryByText("date:")).not.toBeInTheDocument()
  })

  it("should render all environment badges", async () => {
    const project = {
      id: "1",
      name: "Project",
      internal_name: "project",
      domain: "IT",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      description: "Description",
      environment: ["React", "Next.js", "TypeScript"],
    }

    const Jsx = await ProjectDetails({ project } as never)

    render(Jsx)

    const badges = screen.getAllByTestId("badge")

    expect(badges).toHaveLength(3)

    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("Next.js")).toBeInTheDocument()
    expect(screen.getByText("TypeScript")).toBeInTheDocument()
  })
})

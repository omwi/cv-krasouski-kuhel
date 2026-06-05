import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { CvProject, CvUserId } from "@/types/graphql-types"

import { getColumns, renderResponsibilitiesRow } from "./cv-projects-columns"

vi.mock(
  "@/features/cvs/components/projects/table/cv-projects-row-actions",
  () => ({
    default: vi.fn(({ project, cvUserId }) => (
      <div data-testid="cv-projects-row-actions">
        {project.name}:{cvUserId.id}
      </div>
    )),
  })
)

describe("cv-projects-columns", () => {
  const mockCvUserId = { id: "cv-123" } as unknown as CvUserId

  it("should define columns with correct IDs and settings", () => {
    const columns = getColumns(mockCvUserId)
    expect(columns).toHaveLength(6)
    expect(columns.map((c) => c.id)).toEqual([
      "name",
      "internal_name",
      "domain",
      "start_date",
      "end_date",
      "actions",
    ])
    expect(columns.find((c) => c.id === "name")?.sortable).toBe(true)
    expect(columns.find((c) => c.id === "actions")?.isSrOnly).toBe(true)
  })

  it("should render actions cell with CvProjectsRowActions and correct props", () => {
    const actionsCol = getColumns(mockCvUserId).find((c) => c.id === "actions")!
    render(
      actionsCol.cell!({
        row: { id: "proj-1", name: "Billing Service" } as unknown as CvProject,
        value: "",
      })
    )
    expect(screen.getByTestId("cv-projects-row-actions")).toHaveTextContent(
      "Billing Service:cv-123"
    )
  })

  it("should render responsibilities sub-row mapping items to badges with truncation", () => {
    const mockProject = {
      responsibilities: [
        "Develop React frontend",
        "Setup Vitest tests",
        "Fix TypeScript errors",
      ],
    } as unknown as CvProject

    render(renderResponsibilitiesRow(mockProject))

    expect(screen.getByText("Develop React frontend")).toBeInTheDocument()
    expect(screen.getByText("Develop React frontend")).toHaveClass(
      "max-w-64",
      "truncate"
    )
    expect(screen.getByText("Setup Vitest tests")).toBeInTheDocument()
    expect(screen.getByText("Fix TypeScript errors")).toBeInTheDocument()
  })
})

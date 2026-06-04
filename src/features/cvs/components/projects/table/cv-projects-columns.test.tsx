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

    const nameCol = columns.find((c) => c.id === "name")
    expect(nameCol?.titleKey).toBe("projects-table.columns.name")
    expect(nameCol?.sortable).toBe(true)
    expect(nameCol?.searchable).toBe(true)

    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol?.isSrOnly).toBe(true)
  })

  it("should render actions cell with CvProjectsRowActions and correct props", () => {
    const columns = getColumns(mockCvUserId)
    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol).toBeDefined()
    expect(actionsCol?.cell).toBeDefined()

    const mockRow = {
      id: "proj-1",
      name: "Billing Service",
    } as unknown as CvProject
    if (actionsCol && actionsCol.cell) {
      const element = actionsCol.cell({
        row: mockRow,
        value: "",
      })
      render(element)
      expect(screen.getByTestId("cv-projects-row-actions")).toHaveTextContent(
        "Billing Service:cv-123"
      )
    }
  })

  it("should render responsibilities sub-row mapping items to badges", () => {
    const mockProject = {
      responsibilities: [
        "Develop React frontend",
        "Setup Vitest tests",
        "Fix TypeScript compiler errors",
      ],
    } as unknown as CvProject

    const element = renderResponsibilitiesRow(mockProject)
    render(element)

    expect(screen.getByText("Develop React frontend")).toBeInTheDocument()
    expect(screen.getByText("Setup Vitest tests")).toBeInTheDocument()
    expect(
      screen.getByText("Fix TypeScript compiler errors")
    ).toBeInTheDocument()

    // check that badge container has the correct truncation class
    const firstTextNode = screen.getByText("Develop React frontend")
    expect(firstTextNode).toHaveClass("max-w-64", "truncate")
  })
})

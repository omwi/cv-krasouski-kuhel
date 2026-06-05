import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import * as dateUtils from "@/utils/date"

import { getColumns } from "./projects-table-columns"

vi.mock("@/features/projects/components/table/projects-row-actions", () => ({
  default: vi.fn(({ project }) => (
    <div data-testid="projects-row-actions">{project.name}</div>
  )),
}))

describe("projects-table-columns", () => {
  it("should define columns with correct IDs and settings", () => {
    const columns = getColumns()

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

    const internalNameCol = columns.find((c) => c.id === "internal_name")
    expect(internalNameCol?.titleKey).toBe(
      "projects-table.columns.internal-name"
    )
    expect(internalNameCol?.sortable).toBe(true)
    expect(internalNameCol?.searchable).toBe(true)

    const domainCol = columns.find((c) => c.id === "domain")
    expect(domainCol?.titleKey).toBe("projects-table.columns.domain")
    expect(domainCol?.sortable).toBe(true)
    expect(domainCol?.searchable).toBe(true)

    const startDateCol = columns.find((c) => c.id === "start_date")
    expect(startDateCol?.sortable).toBe(true)
    expect(startDateCol?.searchable).toBe(false)

    const endDateCol = columns.find((c) => c.id === "end_date")
    expect(endDateCol?.sortable).toBe(true)
    expect(endDateCol?.searchable).toBe(false)

    const actionsCol = columns.find((c) => c.id === "actions")
    expect(actionsCol?.titleKey).toBe("projects-table.columns.actions")
    expect(actionsCol?.isSrOnly).toBe(true)
    expect(actionsCol?.sortable).toBe(false)
    expect(actionsCol?.searchable).toBe(false)
  })

  it("should render formatted start date", () => {
    vi.spyOn(dateUtils, "parseUtcToLocal").mockReturnValue(
      new Date("2024-01-01")
    )
    vi.spyOn(dateUtils, "toHumanDate").mockReturnValue("Jan 1, 2024")

    const startDateCol = getColumns().find((c) => c.id === "start_date")!

    render(
      startDateCol.cell!({
        row: {} as TableProjects,
        value: "2024-01-01T00:00:00Z",
      })
    )

    expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument()
  })

  it("should render formatted end date", () => {
    vi.spyOn(dateUtils, "parseUtcToLocal").mockReturnValue(
      new Date("2024-12-31")
    )
    vi.spyOn(dateUtils, "toHumanDate").mockReturnValue("Dec 31, 2024")

    const endDateCol = getColumns().find((c) => c.id === "end_date")!

    render(
      endDateCol.cell!({
        row: {} as TableProjects,
        value: "2024-12-31T00:00:00Z",
      })
    )

    expect(screen.getByText("Dec 31, 2024")).toBeInTheDocument()
  })

  it("should render till-now when end date is empty", () => {
    vi.spyOn(dateUtils, "parseUtcToLocal").mockReturnValue(undefined)

    const endDateCol = getColumns().find((c) => c.id === "end_date")!

    render(
      endDateCol.cell!({
        row: {} as TableProjects,
        value: null,
      })
    )

    expect(screen.getByText("till-now")).toBeInTheDocument()
  })

  it("should render nothing when start date is empty", () => {
    vi.spyOn(dateUtils, "parseUtcToLocal").mockReturnValue(undefined)

    const startDateCol = getColumns().find((c) => c.id === "start_date")!

    const { container } = render(
      startDateCol.cell!({
        row: {} as TableProjects,
        value: null,
      })
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should render actions column cell with ProjectsRowActions", () => {
    const actionsCol = getColumns().find((c) => c.id === "actions")!

    render(
      actionsCol.cell!({
        row: {
          id: "project-1",
          name: "Apollo Migration",
        } as TableProjects,
        value: "",
      })
    )

    expect(screen.getByTestId("projects-row-actions")).toHaveTextContent(
      "Apollo Migration"
    )
  })
})

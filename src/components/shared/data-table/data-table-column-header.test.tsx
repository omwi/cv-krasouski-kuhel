import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DataTableColumnHeader } from "./data-table-column-header"

const mockUpdateParams = vi.fn()

type TableParams = {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

let mockParams: TableParams = {}

vi.mock("@/hooks/use-table-url-state", () => ({
  useTableUrlState: () => ({
    params: mockParams,
    updateParams: mockUpdateParams,
  }),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

vi.mock("lucide-react", () => ({
  MoveUp: () => <svg data-testid="move-up-icon" />,
  MoveDown: () => <svg data-testid="move-down-icon" />,
}))

describe("DataTableColumnHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockParams = {}
  })

  it("should render a non-sortable header when sortKey is not provided", () => {
    render(<DataTableColumnHeader title="Name" />)

    expect(screen.getByText("Name")).toBeInTheDocument()

    expect(
      screen.queryByRole("button", { name: /name/i })
    ).not.toBeInTheDocument()
  })

  it("should render a sortable header as a button when sortKey is provided", () => {
    render(
      <DataTableColumnHeader title="Name" sortKey="name" defaultSortBy="id" />
    )

    expect(screen.getByRole("button", { name: /name/i })).toBeInTheDocument()
  })

  it("should start ascending sort when clicking an unsorted column", async () => {
    const user = userEvent.setup()

    mockParams = {
      sortBy: "email",
      sortOrder: "asc",
    }

    render(
      <DataTableColumnHeader title="Name" sortKey="name" defaultSortBy="id" />
    )

    await user.click(screen.getByRole("button", { name: /name/i }))

    expect(mockUpdateParams).toHaveBeenCalledTimes(1)

    expect(mockUpdateParams).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "name",
        sortOrder: "asc",
        page: 1,
      })
    )
  })

  it("should switch from ascending to descending when clicked", async () => {
    const user = userEvent.setup()

    mockParams = {
      sortBy: "name",
      sortOrder: "asc",
    }

    render(
      <DataTableColumnHeader title="Name" sortKey="name" defaultSortBy="id" />
    )

    expect(screen.getByTestId("move-up-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("move-down-icon")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /name/i }))

    expect(mockUpdateParams).toHaveBeenCalledTimes(1)

    expect(mockUpdateParams).toHaveBeenCalledWith(
      expect.objectContaining({
        sortOrder: "desc",
        page: 1,
      })
    )
  })

  it("should reset to the default sort column when clicking a descending non-default column", async () => {
    const user = userEvent.setup()

    mockParams = {
      sortBy: "name",
      sortOrder: "desc",
    }

    render(
      <DataTableColumnHeader
        title="Name"
        sortKey="name"
        defaultSortBy="createdAt"
      />
    )

    await user.click(screen.getByRole("button", { name: /name/i }))

    expect(mockUpdateParams).toHaveBeenCalledTimes(1)

    expect(mockUpdateParams).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "createdAt",
        sortOrder: "asc",
        page: 1,
      })
    )
  })

  it("should switch descending back to ascending when the column is the default sort column", async () => {
    const user = userEvent.setup()

    mockParams = {
      sortBy: "name",
      sortOrder: "desc",
    }

    render(
      <DataTableColumnHeader title="Name" sortKey="name" defaultSortBy="name" />
    )

    await user.click(screen.getByRole("button", { name: /name/i }))

    expect(mockUpdateParams).toHaveBeenCalledTimes(1)

    expect(mockUpdateParams).toHaveBeenCalledWith(
      expect.objectContaining({
        sortOrder: "asc",
        page: 1,
      })
    )
  })

  it("should render the correct sort indicators for sorted and unsorted states", () => {
    const { rerender } = render(
      <DataTableColumnHeader title="Name" sortKey="name" defaultSortBy="id" />
    )

    expect(screen.queryByTestId("move-up-icon")).not.toBeInTheDocument()
    expect(screen.queryByTestId("move-down-icon")).not.toBeInTheDocument()

    mockParams = {
      sortBy: "name",
      sortOrder: "asc",
    }

    rerender(
      <DataTableColumnHeader title="Name" sortKey="name" defaultSortBy="id" />
    )

    expect(screen.getByTestId("move-up-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("move-down-icon")).not.toBeInTheDocument()

    mockParams = {
      sortBy: "name",
      sortOrder: "desc",
    }

    rerender(
      <DataTableColumnHeader title="Name" sortKey="name" defaultSortBy="id" />
    )

    expect(screen.getByTestId("move-down-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("move-up-icon")).not.toBeInTheDocument()
  })
})

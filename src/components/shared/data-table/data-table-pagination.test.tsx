import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  useTableUrlState,
  type TableUrlParams,
} from "@/hooks/use-table-url-state"

import { DataTablePagination } from "./data-table-pagination"

vi.mock("@/hooks/use-table-url-state", () => ({
  useTableUrlState: vi.fn(),
}))

describe("DataTablePagination", () => {
  const mockUpdateParams = vi.fn()
  const mockedUseTableUrlState = vi.mocked(useTableUrlState)

  const createMockParams = (
    overrides: Partial<TableUrlParams>
  ): TableUrlParams => ({
    page: 1,
    perPage: 20,
    search: "",
    sortBy: "id",
    sortOrder: "asc",
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render total text and hide pagination controls when total pages is 1", () => {
    mockedUseTableUrlState.mockReturnValue({
      params: createMockParams({ page: 1, perPage: 20 }),
      updateParams: mockUpdateParams,
    })

    render(<DataTablePagination totalCount={10} totalText="10 total items" />)

    expect(screen.getByText("10 total items")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("should disable 'Previous' and 'First' buttons on the first page", () => {
    mockedUseTableUrlState.mockReturnValue({
      params: createMockParams({ page: 1, perPage: 10 }),
      updateParams: mockUpdateParams,
    })

    render(<DataTablePagination totalCount={50} totalText="50 total items" />)

    expect(
      screen.getByRole("button", { name: "pagination.first-page" })
    ).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "pagination.prev-page" })
    ).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "pagination.next-page" })
    ).not.toBeDisabled()
    expect(
      screen.getByRole("button", { name: "pagination.last-page" })
    ).not.toBeDisabled()
  })

  it("should disable 'Next' and 'Last' buttons on the last page", () => {
    mockedUseTableUrlState.mockReturnValue({
      params: createMockParams({ page: 5, perPage: 10 }),
      updateParams: mockUpdateParams,
    })

    render(<DataTablePagination totalCount={50} totalText="50 total items" />)

    expect(
      screen.getByRole("button", { name: "pagination.first-page" })
    ).not.toBeDisabled()
    expect(
      screen.getByRole("button", { name: "pagination.prev-page" })
    ).not.toBeDisabled()
    expect(
      screen.getByRole("button", { name: "pagination.next-page" })
    ).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "pagination.last-page" })
    ).toBeDisabled()
  })

  it("should call updateParams with the correct page number when navigation buttons are clicked", async () => {
    const user = userEvent.setup()

    mockedUseTableUrlState.mockReturnValue({
      params: createMockParams({ page: 3, perPage: 10 }),
      updateParams: mockUpdateParams,
    })

    render(<DataTablePagination totalCount={50} totalText="50 total items" />)

    const firstBtn = screen.getByRole("button", {
      name: "pagination.first-page",
    })
    const prevBtn = screen.getByRole("button", { name: "pagination.prev-page" })
    const nextBtn = screen.getByRole("button", { name: "pagination.next-page" })
    const lastBtn = screen.getByRole("button", { name: "pagination.last-page" })

    await user.click(nextBtn)
    expect(mockUpdateParams).toHaveBeenCalledWith({ page: 4 })

    await user.click(prevBtn)
    expect(mockUpdateParams).toHaveBeenCalledWith({ page: 2 })

    await user.click(firstBtn)
    expect(mockUpdateParams).toHaveBeenCalledWith({ page: 1 })

    await user.click(lastBtn)
    expect(mockUpdateParams).toHaveBeenCalledWith({ page: 5 })

    expect(mockedUseTableUrlState).toHaveBeenCalledWith({ defaultPerPage: 20 })
  })
})

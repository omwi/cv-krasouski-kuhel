import { useSuspenseQuery } from "@apollo/client/react"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { GET_CVS } from "@/graphql/cvs/queries"
import { Cv } from "@/types/graphql-types"

import CvsTableDataWrapper from "./cvs-table-data-wrapper"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/features/cvs/components/table/cvs-table", () => ({
  default: vi.fn(({ cvs }) => (
    <div data-testid="cvs-table">
      {cvs.map((cv: Cv) => (
        <span key={cv.id}>{cv.name}</span>
      ))}
    </div>
  )),
}))

describe("CvsTableDataWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should query GET_CVS and pass data.cvs to CvsTable", () => {
    const mockCvs = [
      { id: "cv-1", name: "Alpha CV" },
      { id: "cv-2", name: "Beta CV" },
    ]

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: { cvs: mockCvs },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(<CvsTableDataWrapper />)

    expect(useSuspenseQuery).toHaveBeenCalledWith(GET_CVS)
    expect(screen.getByTestId("cvs-table")).toBeInTheDocument()
    expect(screen.getByText("Alpha CV")).toBeInTheDocument()
    expect(screen.getByText("Beta CV")).toBeInTheDocument()
  })
})

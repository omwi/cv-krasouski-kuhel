import { useSuspenseQuery } from "@apollo/client/react"
import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CvsTable from "@/features/cvs/components/table/cvs-table"
import { GET_CVS } from "@/graphql/cvs/queries"

import CvsTableDataWrapper from "./cvs-table-data-wrapper"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/features/cvs/components/table/cvs-table", () => ({
  default: vi.fn(() => <span />),
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
    expect(vi.mocked(CvsTable).mock.calls[0][0]).toEqual(
      expect.objectContaining({ cvs: mockCvs })
    )
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePdfExport } from "@/features/cvs/hooks/preview/use-pdf-export"

import ExportButton from "./export-button"

vi.mock("@/features/cvs/hooks/preview/use-pdf-export", () => ({
  usePdfExport: vi.fn(),
}))

describe("ExportButton Component", () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePdfExport).mockReturnValue({
      onClick: mockOnClick,
      loading: false,
    })
  })

  it("should render button with export-pdf text and click triggers usePdfExport onClick", () => {
    render(<ExportButton exportFileName="my-cv" />)

    expect(usePdfExport).toHaveBeenCalledWith("my-cv")
    const btn = screen.getByRole("button", { name: "export-pdf" })
    expect(btn).toBeInTheDocument()
    expect(btn).not.toBeDisabled()

    fireEvent.click(btn)
    expect(mockOnClick).toHaveBeenCalled()
  })

  it("should render disabled spinner button when loading is true", () => {
    vi.mocked(usePdfExport).mockReturnValue({
      onClick: mockOnClick,
      loading: true,
    })

    render(<ExportButton exportFileName="my-cv" />)

    const btn = screen.getByRole("button", { name: "export-pdf" })
    expect(btn).toBeDisabled()
    // loader2 icon should be rendered
    expect(btn.querySelector(".animate-spin")).toBeInTheDocument()
  })
})

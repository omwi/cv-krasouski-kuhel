import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { buildPdfHtml, downloadPdf } from "@/features/cvs/utils/pdf-export"

import { usePdfExport } from "./use-pdf-export"

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

vi.mock("@/features/cvs/utils/pdf-export", () => ({
  buildPdfHtml: vi.fn(),
  downloadPdf: vi.fn(),
}))

describe("usePdfExport", () => {
  const mockExportMutation = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockExportMutation.mockReset().mockResolvedValue({
      data: {
        exportPdf: "mock-pdf-base64-string",
      },
    })
    vi.mocked(useMutation).mockImplementation(
      () =>
        [mockExportMutation, { loading: false }] as unknown as ReturnType<
          typeof useMutation
        >
    )
  })

  it("should return early if cv-preview element is not found", async () => {
    const getElementSpy = vi
      .spyOn(document, "getElementById")
      .mockReturnValue(null)

    const { result } = renderHook(() => usePdfExport("my-file"))
    await act(async () => {
      await result.current.onClick()
    })

    expect(getElementSpy).toHaveBeenCalledWith("cv-preview")
    expect(buildPdfHtml).not.toHaveBeenCalled()
    expect(mockExportMutation).not.toHaveBeenCalled()

    getElementSpy.mockRestore()
  })

  it("should build pdf HTML, run mutation, and download PDF on success", async () => {
    const mockElement = document.createElement("div")
    const getElementSpy = vi
      .spyOn(document, "getElementById")
      .mockReturnValue(mockElement)
    vi.mocked(buildPdfHtml).mockReturnValue("<html>mock</html>")

    const { result } = renderHook(() => usePdfExport("my-file"))
    await act(async () => {
      await result.current.onClick()
    })

    expect(getElementSpy).toHaveBeenCalledWith("cv-preview")
    expect(buildPdfHtml).toHaveBeenCalledWith(mockElement)
    expect(mockExportMutation).toHaveBeenCalledWith({
      variables: {
        pdf: {
          html: "<html>mock</html>",
          margin: {
            bottom: "15mm",
            left: "12mm",
            right: "12mm",
            top: "15mm",
          },
        },
      },
    })
    expect(downloadPdf).toHaveBeenCalledWith(
      "my-file",
      "mock-pdf-base64-string"
    )

    getElementSpy.mockRestore()
  })

  it("should show error toast if mutation resolves with empty exportPdf data", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const mockElement = document.createElement("div")
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement)
    mockExportMutation.mockResolvedValue({ data: null })

    const { result } = renderHook(() => usePdfExport("my-file"))
    await act(async () => {
      await result.current.onClick()
    })

    expect(toast.error).toHaveBeenCalledWith("export.error")
    consoleSpy.mockRestore()
  })

  it("should show error toast if mutation fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const mockElement = document.createElement("div")
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement)
    mockExportMutation.mockRejectedValue(new Error("Network Error"))

    const { result } = renderHook(() => usePdfExport("my-file"))
    await act(async () => {
      await result.current.onClick()
    })

    expect(toast.error).toHaveBeenCalledWith("export.error")
    consoleSpy.mockRestore()
  })
})

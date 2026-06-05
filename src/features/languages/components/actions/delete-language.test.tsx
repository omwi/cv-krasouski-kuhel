import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"

import DeleteLanguage from "./delete-language"

const mockMutateDelete = vi.fn()
let capturedMutationOptions: { update?: (cache: object) => void } = {}

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn((_mutation, options) => {
    capturedMutationOptions = options
    return [mockMutateDelete]
  }),
}))

describe("DeleteLanguage Component", () => {
  const mockLanguage: TableLanguages = {
    __typename: "Language",
    id: "lang-42",
    name: "English",
  } as unknown as TableLanguages

  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    capturedMutationOptions = {}
    mockMutateDelete.mockResolvedValue({})
  })

  it("should render DeleteDialog with the language name", () => {
    render(
      <DeleteLanguage
        language={mockLanguage}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("delete-entity")).toHaveTextContent("English")
  })

  it("should call mutateDelete with correct variables when confirmed", async () => {
    render(
      <DeleteLanguage
        language={mockLanguage}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-confirm"))

    expect(mockMutateDelete).toHaveBeenCalledWith({
      variables: {
        language: { languageId: "lang-42" },
      },
    })
  })

  it("should call onOpenChange(false) when close button is clicked", () => {
    render(
      <DeleteLanguage
        language={mockLanguage}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-close"))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("should evict the language from Apollo cache after deletion", () => {
    const mockEvict = vi.fn()
    const mockGc = vi.fn()
    const mockIdentify = vi.fn(() => "Language:lang-42")
    const mockCache = {
      evict: mockEvict,
      gc: mockGc,
      identify: mockIdentify,
    }

    render(
      <DeleteLanguage
        language={mockLanguage}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    capturedMutationOptions.update!(mockCache)

    expect(mockIdentify).toHaveBeenCalledWith({
      __typename: "Language",
      id: "lang-42",
    })
    expect(mockEvict).toHaveBeenCalledWith({ id: "Language:lang-42" })
    expect(mockGc).toHaveBeenCalled()
  })

  it("should not evict from cache when language is nullish", () => {
    const mockEvict = vi.fn()
    const mockGc = vi.fn()
    const mockCache = { evict: mockEvict, gc: mockGc, identify: vi.fn() }

    render(
      <DeleteLanguage
        language={null as unknown as TableLanguages}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    capturedMutationOptions.update!(mockCache)

    expect(mockEvict).not.toHaveBeenCalled()
    expect(mockGc).not.toHaveBeenCalled()
  })

  it("should not render dialog content when open=false", () => {
    render(
      <DeleteLanguage
        language={mockLanguage}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.queryByTestId("delete-dialog")).toBeNull()
  })
})

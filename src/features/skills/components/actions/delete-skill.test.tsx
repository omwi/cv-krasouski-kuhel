import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableSkill } from "@/features/skills/components/table/skills-table-columns"

import DeleteSkill from "./delete-skill"

const mockMutateDelete = vi.fn()
let capturedMutationOptions: { update?: (cache: object) => void } = {}

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn((_mutation, options) => {
    capturedMutationOptions = options
    return [mockMutateDelete]
  }),
}))

describe("DeleteSkill Component", () => {
  const mockSkill: TableSkill = {
    __typename: "Skill",
    id: "skill-1",
    name: "TypeScript",
  } as unknown as TableSkill

  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    capturedMutationOptions = {}
    mockMutateDelete.mockResolvedValue({})
  })

  it("should render DeleteDialog with skill name", () => {
    render(
      <DeleteSkill
        skill={mockSkill}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("delete-entity")).toHaveTextContent("TypeScript")
  })

  it("should call mutateDelete with correct variables when confirmed", () => {
    render(
      <DeleteSkill
        skill={mockSkill}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-confirm"))

    expect(mockMutateDelete).toHaveBeenCalledWith({
      variables: {
        skill: { skillId: "skill-1" },
      },
    })
  })

  it("should call onOpenChange(false) when close is triggered", () => {
    render(
      <DeleteSkill
        skill={mockSkill}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    fireEvent.click(screen.getByTestId("delete-close"))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("should evict skill from Apollo cache after deletion", () => {
    const mockEvict = vi.fn()
    const mockGc = vi.fn()
    const mockIdentify = vi.fn(() => "Skill:skill-1")

    const mockCache = {
      evict: mockEvict,
      gc: mockGc,
      identify: mockIdentify,
    }

    render(
      <DeleteSkill
        skill={mockSkill}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    capturedMutationOptions.update!(mockCache)

    expect(mockIdentify).toHaveBeenCalledWith({
      __typename: "Skill",
      id: "skill-1",
    })
    expect(mockEvict).toHaveBeenCalledWith({ id: "Skill:skill-1" })
    expect(mockGc).toHaveBeenCalled()
  })

  it("should not render dialog when open=false", () => {
    render(
      <DeleteSkill
        skill={mockSkill}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.queryByTestId("delete-dialog")).toBeNull()
  })
})

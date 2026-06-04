import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useUserSkillsDelete } from "../use-user-skills-delete"

// Mock dependencies safely without 'any'
const mockStartSelection = vi.fn()
const mockStopSelection = vi.fn()
const mockSelectedValues = new Set<string>(["React"])

vi.mock("@/components/shared/selection/selection-provider", () => ({
  useSelection: () => ({
    selectedValues: mockSelectedValues,
    startSelection: mockStartSelection,
    stopSelection: mockStopSelection,
  }),
}))

const mockDeleteMutation = vi.fn().mockResolvedValue({})
vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockDeleteMutation, { loading: false }]),
}))

describe("useUserSkillsDelete", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDeleteMutation.mockResolvedValue({})
    mockSelectedValues.clear()
    mockSelectedValues.add("React")
  })

  it("should start selection and handle confirm delete with correct variables", async () => {
    const { result } = renderHook(() => useUserSkillsDelete("123"))

    // Verify handleStartDelete triggers startSelection
    act(() => {
      result.current.handleStartDelete()
    })
    expect(mockStartSelection).toHaveBeenCalled()

    // Trigger delete confirmation
    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    // Verify GraphQL mutation is called with selected values
    expect(mockDeleteMutation).toHaveBeenCalledWith({
      variables: {
        skills: {
          name: ["React"],
          userId: "123",
        },
      },
    })

    // Verify stopSelection is called and toast is triggered
    expect(mockStopSelection).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("toast.deleted")
  })

  it("should handle plural delete confirmation", async () => {
    // Add another item to selection
    mockSelectedValues.add("Angular")

    const { result } = renderHook(() => useUserSkillsDelete("123"))

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(toast.success).toHaveBeenCalledWith("toast.deleted-plural")
  })

  it("should handle error during deletion", async () => {
    const error = new Error("Failed to delete")
    mockDeleteMutation.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useUserSkillsDelete("123"))

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(mockStopSelection).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})

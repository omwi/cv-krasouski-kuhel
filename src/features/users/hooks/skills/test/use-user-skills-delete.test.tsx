import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"

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

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockDeleteMutation = vi.fn().mockResolvedValue({})
vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockDeleteMutation, { loading: false }]),
}))

describe("useUserSkillsDelete", () => {
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
})

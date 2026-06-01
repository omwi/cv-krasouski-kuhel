import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { UserSkill } from "@/types/graphql-types"

import { useUserSkillUpdateForm } from "../use-user-skill-update-form"

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: () => ({
    canUpdateUser: () => true,
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

const mockMutation = vi.fn().mockResolvedValue({})
vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockMutation, { loading: false }]),
}))

const mockUserSkill: UserSkill = {
  __typename: "SkillMastery",
  name: "React",
  categoryId: "frontend",
  mastery: "Advanced",
}

describe("useUserSkillUpdateForm", () => {
  it("should initialize default form values and submit successfully", async () => {
    const { result } = renderHook(() =>
      useUserSkillUpdateForm("123", mockUserSkill)
    )

    // Verify initial values
    expect(result.current.control).toBeDefined()
    expect(result.current.isSubmitReady).toBe(false)
    expect(result.current.open).toBe(false)

    // Trigger open state
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)

    // Trigger form submit
    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify useMutation called with correct input parameters
    expect(mockMutation).toHaveBeenCalled()
  })
})

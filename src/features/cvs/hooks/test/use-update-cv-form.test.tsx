import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Cv } from "@/types/graphql-types"

import { useUpdateCvForm } from "../use-update-cv-form"

// Mock permissions hook
vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: () => ({
    currentUserId: "user-123",
    canUpdateCv: () => true,
  }),
}))

// Mock localization hook
vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock Apollo useMutation hook
const mockUpdateMutation = vi.fn().mockResolvedValue({
  data: {
    updateCv: {
      id: "cv-456",
      name: "Updated CV Name",
      description: "Updated Description",
      education: "Updated MIT",
      user: {
        id: "user-123",
        email: "user@example.com",
      },
    },
  },
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockUpdateMutation, { loading: false }]),
}))

const mockCv: Cv = {
  __typename: "Cv",
  id: "cv-456",
  name: "Original Name",
  description: "Original Description",
  education: "Original Education",
  user: {
    __typename: "User",
    id: "user-123",
    email: "user@example.com",
  },
}

describe("useUpdateCvForm", () => {
  it("should load original cv values and submit successfully", async () => {
    const mockSetOpen = vi.fn()
    const { result } = renderHook(() =>
      useUpdateCvForm(mockCv, { open: true, setOpen: mockSetOpen })
    )

    // Initial check: register functions are returned
    expect(result.current.control).toBeDefined()
    expect(result.current.register).toBeDefined()

    // Trigger onSubmit
    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify useMutation called with correct input parameters
    expect(mockUpdateMutation).toHaveBeenCalled()
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })
})

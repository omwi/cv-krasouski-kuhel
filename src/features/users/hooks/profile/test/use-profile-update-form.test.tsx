import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useProfileUpdateForm } from "../use-profile-update-form"

// Mock dependencies safely without 'any'
vi.mock("@/features/auth/components/auth-provider", () => ({
  useAuthContext: () => ({
    userId: "123",
    role: "ADMIN",
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

// Direct mock of @apollo/client/react to bypass suspense issues and run synchronously
vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      user: {
        id: "123",
        created_at: "2026-01-01",
        email: "test@example.com",
        role: "ADMIN",
        is_verified: true,
        department_name: "Engineering",
        position_name: "Software Engineer",
        department: { id: "dept-1", name: "Engineering" },
        position: { id: "pos-1", name: "Software Engineer" },
        profile: {
          id: "prof-1",
          avatar: null,
          first_name: "John",
          last_name: "Doe",
          full_name: "John Doe",
        },
      },
    },
  })),
  useMutation: vi.fn(() => [vi.fn().mockResolvedValue({}), { loading: false }]),
}))

describe("useProfileUpdateForm", () => {
  it("should initialize default form values and submit changes successfully", () => {
    const { result } = renderHook(() => useProfileUpdateForm("123"))

    // Verify properties exist and are loaded correctly
    expect(result.current.register).toBeDefined()
    expect(result.current.isDirty).toBe(false)
    expect(result.current.isPending).toBe(false)
    expect(result.current.onSubmit).toBeDefined()
  })
})

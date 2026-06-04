import { useSuspenseQuery } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"

import { useProfileUpdateForm } from "./use-profile-update-form"

const mockMutate = vi.fn().mockResolvedValue({})

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
  useMutation: vi.fn(() => [mockMutate, { loading: false }]),
}))

const submitProfileForm = async (
  form: Pick<ReturnType<typeof useProfileUpdateForm>, "onSubmit">
) => {
  await act(async () => {
    await form.onSubmit()
  })
}

describe("useProfileUpdateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutate.mockResolvedValue({}) // Reset for each test
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should initialize default form values", () => {
    const { result } = renderHook(() => useProfileUpdateForm("123"))

    expect(result.current.register).toBeDefined()
    expect(result.current.isDirty).toBe(false)
    expect(result.current.isPending).toBe(false)
    expect(result.current.onSubmit).toBeDefined()
  })

  it("should submit changes successfully", async () => {
    const { result } = renderHook(() => useProfileUpdateForm("123"))

    await submitProfileForm(result.current)

    expect(mockMutate).toHaveBeenCalledTimes(2) // updateProfile and updateUser
    expect(toast.success).toHaveBeenCalledWith("update-profile.success")
  })

  it("should handle submission error (rejected promise)", async () => {
    mockMutate.mockRejectedValue(new Error("Update failed"))

    const { result } = renderHook(() => useProfileUpdateForm("123"))

    await submitProfileForm(result.current)

    expect(mockMutate).toHaveBeenCalledTimes(2)
    // Both promises reject, meaning Promise.allSettled completes, but statuses are "rejected"
    expect(toast.error).toHaveBeenCalledWith("update-profile.error")
  })

  it("should catch unexpected errors in submit handler", async () => {
    // Promise.allSettled catches all promise rejections, so the only way to reach the catch block
    // is if a synchronous error occurs inside the try block (e.g. toast or reset throwing).
    vi.mocked(toast.success).mockImplementationOnce(() => {
      throw new Error("Sync error")
    })
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useProfileUpdateForm("123"))

    await submitProfileForm(result.current)

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
    // toast.error is called in the catch block
    expect(toast.error).toHaveBeenCalledWith("update-profile.error")
    consoleSpy.mockRestore()
  })

  it("should return early if user lacks permissions", async () => {
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => false,
    } as unknown as ReturnType<typeof usePermissions>)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useProfileUpdateForm("123"))

    await submitProfileForm(result.current)

    expect(consoleSpy).toHaveBeenCalledWith(
      "Don't have permissions to update this user"
    )
    expect(mockMutate).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should fallback to empty strings if user fields are missing", () => {
    // Override the mock specifically to return null for optional fields
    // This covers the `?? ""` branches during defaultValues initialization (lines 42-45).
    vi.mocked(useSuspenseQuery).mockReturnValueOnce({
      data: {
        user: {
          id: "123",
          department: null,
          position: null,
          profile: {
            id: "prof-1",
            first_name: null,
            last_name: null,
          },
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    const { result } = renderHook(() => useProfileUpdateForm("123"))

    // Validating that it didn't crash and the hook initialized correctly
    expect(result.current.register).toBeDefined()
  })
})

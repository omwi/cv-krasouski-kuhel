import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableUser } from "@/features/users/components/user-table/users-table"
import { UserRole } from "@/types/__generated__/graphql"

import { useUpdateUserForm } from "../use-update-user-form"

const mockMutateUser = vi.fn().mockResolvedValue({})
const mockMutateProfile = vi.fn().mockResolvedValue({})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn((mutation) => {
    // Determine which mutation is being mocked based on some internal or calling logic,
    // or just return unique handlers for profile vs user mutation.
    // In our hook:
    // const [mutateUser] = useMutation(UPDATE_USER) -> first call
    // const [mutateProfile] = useMutation(UPDATE_PROFILE) -> second call
    // So we can check what mutation query is passed or just match calls sequentially.
    // Let's implement a robust conditional query matcher.
    if (mutation && mutation.definitions?.[0]?.name?.value === "UpdateUser") {
      return [mockMutateUser, { loading: false }]
    }
    return [mockMutateProfile, { loading: false }]
  }),
}))

const mockUser: TableUser = {
  __typename: "User",
  id: "user-123",
  email: "jane@example.com",
  role: "User" as UserRole,
  is_verified: true,
  created_at: "2024-06-04",
  department_name: "Engineering",
  position_name: "Developer",
  department: { __typename: "Department", id: "dept-1", name: "Engineering" },
  position: { __typename: "Position", id: "pos-1", name: "Developer" },
  profile: {
    __typename: "Profile",
    id: "profile-123",
    avatar: null,
    first_name: "Jane",
    last_name: "Doe",
    full_name: "Jane Doe",
  },
}

const expectedDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  departmentId: "",
  positionId: "",
  role: "",
}

const makeFormDirtyAndSubmit = async (
  form: Pick<ReturnType<typeof useUpdateUserForm>, "setValue" | "onSubmit">
) => {
  act(() => {
    form.setValue("firstName", "Janet", { shouldDirty: true })
  })
  await act(async () => {
    await form.onSubmit()
  })
}

describe("useUpdateUserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutateUser.mockReset().mockResolvedValue({})
    mockMutateProfile.mockReset().mockResolvedValue({})
  })

  it("should initialize default form values correctly", () => {
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, false, vi.fn())
    )

    expect(result.current.getValues()).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      departmentId: "dept-1",
      positionId: "pos-1",
      role: "User",
    })
  })

  it("should fallback to empty strings if user fields are missing", () => {
    const incompleteUser = {
      id: "user-123",
    } as unknown as TableUser

    const { result } = renderHook(() =>
      useUpdateUserForm(incompleteUser, false, vi.fn())
    )

    expect(result.current.getValues()).toEqual(expectedDefaultValues)
  })

  it("should reset form values when open state becomes true", () => {
    const { result, rerender } = renderHook(
      ({ open }) => useUpdateUserForm(mockUser, open, vi.fn()),
      { initialProps: { open: false } }
    )

    act(() => {
      result.current.setValue("firstName", "ModifiedName")
    })
    expect(result.current.getValues().firstName).toBe("ModifiedName")

    // Rerender with open: true
    rerender({ open: true })

    expect(result.current.getValues().firstName).toBe("Jane")
  })

  it("should trigger info toast and not run mutations if form is submitted with no changes", async () => {
    const mockSetOpen = vi.fn()
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, mockSetOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUser).not.toHaveBeenCalled()
    expect(mockMutateProfile).not.toHaveBeenCalled()
    expect(toast.info).toHaveBeenCalledWith("update.no-changes")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should trigger mutateProfile only when only profile fields are modified", async () => {
    const mockSetOpen = vi.fn()
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, mockSetOpen)
    )

    // Modify firstName (profile field)
    act(() => {
      result.current.setValue("firstName", "Janet", { shouldDirty: true })
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateProfile).toHaveBeenCalledWith({
      variables: {
        profile: {
          userId: "user-123",
          first_name: "Janet",
          last_name: "Doe",
        },
      },
    })
    expect(mockMutateUser).not.toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should trigger mutateUser only when only user fields are modified", async () => {
    const mockSetOpen = vi.fn()
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, mockSetOpen)
    )

    // Modify role (user field)
    act(() => {
      result.current.setValue("role", "Admin", { shouldDirty: true })
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUser).toHaveBeenCalledWith({
      variables: {
        user: {
          userId: "user-123",
          departmentId: "dept-1",
          positionId: "pos-1",
          role: "Admin",
        },
      },
    })
    expect(mockMutateProfile).not.toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should trigger both mutations when both profile and user fields are modified", async () => {
    const mockSetOpen = vi.fn()
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, mockSetOpen)
    )

    act(() => {
      result.current.setValue("firstName", "Janet", { shouldDirty: true })
      result.current.setValue("role", "Admin", { shouldDirty: true })
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateProfile).toHaveBeenCalled()
    expect(mockMutateUser).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should keep departmentId and positionId as empty string if empty string is supplied", async () => {
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, vi.fn())
    )

    act(() => {
      result.current.setValue("departmentId", "", { shouldDirty: true })
      result.current.setValue("positionId", "", { shouldDirty: true })
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUser).toHaveBeenCalledWith({
      variables: {
        user: {
          userId: "user-123",
          departmentId: "",
          positionId: "",
          role: "User",
        },
      },
    })
  })

  it("should reset form values with fallback empty strings when open state becomes true and user fields are missing", () => {
    const incompleteUser = {
      id: "user-123",
    } as unknown as TableUser

    const { result } = renderHook(() =>
      useUpdateUserForm(incompleteUser, true, vi.fn())
    )

    expect(result.current.getValues()).toEqual(expectedDefaultValues)
  })

  it("should fallback departmentId and positionId to null if they are undefined on submit", async () => {
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, vi.fn())
    )

    act(() => {
      // Modify role to make the form dirty
      result.current.setValue("role", "Admin", { shouldDirty: true })
      // Set selects to undefined
      result.current.setValue("departmentId", undefined, { shouldDirty: true })
      result.current.setValue("positionId", undefined, { shouldDirty: true })
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUser).toHaveBeenCalledWith({
      variables: {
        user: {
          userId: "user-123",
          departmentId: null,
          positionId: null,
          role: "Admin",
        },
      },
    })
  })

  it("should show error toast if profile mutation fails", async () => {
    mockMutateProfile.mockRejectedValue(new Error("Profile update failed"))
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, vi.fn())
    )

    await makeFormDirtyAndSubmit(result.current)

    expect(toast.error).toHaveBeenCalledWith("Profile update failed")
  })

  it("should show default error toast on rejection if error is not an Error instance", async () => {
    mockMutateProfile.mockRejectedValue("string error")
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { result } = renderHook(() =>
      useUpdateUserForm(mockUser, true, vi.fn())
    )

    await makeFormDirtyAndSubmit(result.current)

    expect(toast.error).toHaveBeenCalledWith("update.error")
    consoleSpy.mockRestore()
  })
})

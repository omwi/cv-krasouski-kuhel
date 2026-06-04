import { ApolloCache } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { USER_FIELDS_FRAGMENT } from "@/graphql/users/fragments"
import { CREATE_USER } from "@/graphql/users/mutations"
import { UserRole } from "@/types/__generated__/graphql"

import { useCreateUserForm } from "../use-create-user-form"

const mockMutateUser = vi.fn().mockResolvedValue({})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockMutateUser, { loading: false }]),
}))

const fillUserForm = async (
  form: Pick<ReturnType<typeof useCreateUserForm>, "setValue">,
  optionalValues?: { departmentId?: string; positionId?: string }
) => {
  await act(async () => {
    form.setValue("firstName", "Jane")
    form.setValue("lastName", "Doe")
    form.setValue("email", "jane@example.com")
    form.setValue("password", "secure123")
    form.setValue("role", "User")
    if (optionalValues) {
      if ("departmentId" in optionalValues) {
        form.setValue("departmentId", optionalValues.departmentId)
      }
      if ("positionId" in optionalValues) {
        form.setValue("positionId", optionalValues.positionId)
      }
    }
  })
}

const submitCreateUserForm = async (
  form: Pick<ReturnType<typeof useCreateUserForm>, "onSubmit">
) => {
  await act(async () => {
    await form.onSubmit()
  })
}

const getExpectedMutationVariables = (overrides?: {
  departmentId?: string | null
  positionId?: string | null
}) => ({
  variables: {
    user: {
      auth: {
        email: "jane@example.com",
        password: "secure123",
      },
      cvsIds: [] as string[],
      departmentId:
        overrides && "departmentId" in overrides ? overrides.departmentId : "",
      positionId:
        overrides && "positionId" in overrides ? overrides.positionId : "",
      profile: {
        first_name: "Jane",
        last_name: "Doe",
      },
      role: "User",
    },
  },
})

describe("useCreateUserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutateUser.mockReset()
    mockMutateUser.mockResolvedValue({
      data: {
        createUser: {
          id: "new-user-123",
          email: "new@example.com",
        },
      },
    })
  })

  it("should initialize default form values correctly", () => {
    const { result } = renderHook(() => useCreateUserForm(false, vi.fn()))

    expect(result.current.getValues()).toEqual({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      departmentId: "",
      positionId: "",
      role: "",
    })
  })

  it("should reset form values when open state becomes true", () => {
    const { result, rerender } = renderHook(
      ({ open }) => useCreateUserForm(open, vi.fn()),
      { initialProps: { open: false } }
    )

    act(() => {
      result.current.setValue("firstName", "Jane")
      result.current.setValue("lastName", "Doe")
    })
    expect(result.current.getValues().firstName).toBe("Jane")

    // Rerender with open: true
    rerender({ open: true })

    expect(result.current.getValues().firstName).toBe("")
    expect(result.current.getValues().lastName).toBe("")
  })

  it("should successfully submit form and trigger mutation", async () => {
    const mockSetOpen = vi.fn()
    const { result } = renderHook(() => useCreateUserForm(true, mockSetOpen))

    await fillUserForm(result.current, {
      departmentId: "dept-1",
      positionId: "pos-1",
    })

    await submitCreateUserForm(result.current)

    expect(mockMutateUser).toHaveBeenCalledWith(
      getExpectedMutationVariables({
        departmentId: "dept-1",
        positionId: "pos-1",
      })
    )
    expect(toast.success).toHaveBeenCalledWith("create.success")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should keep departmentId and positionId as empty string if not provided", async () => {
    const { result } = renderHook(() => useCreateUserForm(true, vi.fn()))

    await fillUserForm(result.current)

    await submitCreateUserForm(result.current)

    expect(mockMutateUser).toHaveBeenCalledWith(getExpectedMutationVariables())
  })

  it("should fallback departmentId and positionId to null if they are undefined on submit", async () => {
    const { result } = renderHook(() => useCreateUserForm(true, vi.fn()))

    await fillUserForm(result.current, {
      departmentId: undefined,
      positionId: undefined,
    })

    await submitCreateUserForm(result.current)

    expect(mockMutateUser).toHaveBeenCalledWith(
      getExpectedMutationVariables({
        departmentId: null,
        positionId: null,
      })
    )
  })

  it("should show error toast if mutation fails", async () => {
    mockMutateUser.mockRejectedValue(new Error("Mutation failed"))
    const { result } = renderHook(() => useCreateUserForm(true, vi.fn()))

    await fillUserForm(result.current)

    await submitCreateUserForm(result.current)

    expect(toast.error).toHaveBeenCalledWith("Mutation failed")
  })

  it("should show default error message on mutation catch if error is not an Error instance", async () => {
    mockMutateUser.mockRejectedValue("string error")
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { result } = renderHook(() => useCreateUserForm(true, vi.fn()))

    await fillUserForm(result.current)

    await submitCreateUserForm(result.current)

    expect(toast.error).toHaveBeenCalledWith("create.error")
    consoleSpy.mockRestore()
  })

  it("should test cache modify in useMutation update callback", () => {
    renderHook(() => useCreateUserForm(true, vi.fn()))

    const useMutationCalls = vi.mocked(useMutation).mock.calls
    const updateCallback = useMutationCalls.find(
      (call) => call[0] === CREATE_USER
    )?.[1]?.update
    expect(updateCallback).toBeDefined()

    const mockCache = {
      writeFragment: vi.fn().mockReturnValue("UserRef:new-user-123"),
      modify: vi.fn(),
    }
    const typedCache = mockCache as unknown as ApolloCache

    const mockVariables = {
      variables: {
        user: {
          auth: { email: "", password: "" },
          cvsIds: [] as string[],
          departmentId: null as string | null,
          positionId: null as string | null,
          profile: { first_name: "", last_name: "" },
          role: "User" as UserRole,
        },
      },
    }

    // Call update callback when data is null/undefined
    updateCallback!(typedCache, { data: null }, mockVariables)
    expect(mockCache.writeFragment).not.toHaveBeenCalled()

    // Call update callback when writeFragment returns null/undefined (line 34 coverage)
    mockCache.writeFragment.mockReturnValueOnce(null)
    const newUser = { id: "new-user-123", email: "new@example.com" }
    updateCallback!(
      typedCache,
      { data: { createUser: newUser } },
      mockVariables
    )
    expect(mockCache.modify).not.toHaveBeenCalled()

    // Call update callback when data contains createUser and writeFragment succeeds
    mockCache.writeFragment.mockReturnValue("UserRef:new-user-123")
    updateCallback!(
      typedCache,
      { data: { createUser: newUser } },
      mockVariables
    )

    expect(mockCache.writeFragment).toHaveBeenCalledWith({
      data: newUser,
      fragment: USER_FIELDS_FRAGMENT,
    })

    expect(mockCache.modify).toHaveBeenCalledWith({
      fields: {
        users: expect.any(Function),
      },
    })

    // Validate the list modifier logic
    const modifier = mockCache.modify.mock.calls[0][0].fields.users
    const mockReadField = vi.fn().mockImplementation((field, ref) => ref[field])

    // Existing list of users
    const existingRefs = [{ id: "existing-1" }]
    const resultRefs = modifier(existingRefs, { readField: mockReadField })
    expect(resultRefs).toEqual([{ id: "existing-1" }, "UserRef:new-user-123"])

    // Duplicate check
    const resultDuplicateRefs = modifier([{ id: "new-user-123" }], {
      readField: mockReadField,
    })
    expect(resultDuplicateRefs).toEqual([{ id: "new-user-123" }])
  })
})

import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"
import { Cv } from "@/types/graphql-types"

import { useUpdateCvForm } from "./use-update-cv-form"

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } = await import("./cv-hooks-test-helper")
  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, null, {
      name: "Updated CV",
      education: "Uni New",
      description: "Cooler CV",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockPermissions = {
  canUpdateCv: vi.fn(),
}
vi.mocked(usePermissions).mockReturnValue(
  mockPermissions as unknown as ReturnType<typeof usePermissions>
)

describe("useUpdateCvForm", () => {
  const mockCv: Cv = {
    __typename: "Cv",
    id: "cv-1",
    name: "My CV",
    description: "desc",
    education: null,
    user: { __typename: "User", id: "user-1", email: "user@example.com" },
  }

  const mockUpdateCvMutation = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateCvMutation.mockReset().mockResolvedValue({})
    vi.mocked(useMutation).mockImplementation(
      () =>
        [mockUpdateCvMutation, { loading: false }] as unknown as ReturnType<
          typeof useMutation
        >
    )
    mockPermissions.canUpdateCv.mockReturnValue(true)
  })

  it("should initialize default values and react to dialog open", () => {
    const dialogMock = { open: false, setOpen: vi.fn() }
    const { rerender } = renderHook(
      ({ dialog }) => useUpdateCvForm(mockCv, dialog),
      { initialProps: { dialog: dialogMock } }
    )

    rerender({ dialog: { open: true, setOpen: dialogMock.setOpen } })
  })

  it("should submit successfully, run mutation, show success toast, and close dialog if present", async () => {
    const mockSetOpen = vi.fn()
    const dialogMock = { open: true, setOpen: mockSetOpen }
    const { result } = renderHook(() => useUpdateCvForm(mockCv, dialogMock))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith("user-1")
    expect(mockUpdateCvMutation).toHaveBeenCalledWith({
      variables: {
        cv: {
          cvId: "cv-1",
          name: "Updated CV",
          education: "Uni New",
          description: "Cooler CV",
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should submit successfully and reset form if dialog is not present", async () => {
    const { result } = renderHook(() => useUpdateCvForm(mockCv))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockUpdateCvMutation).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("update.success")
  })

  it("should not execute mutation on submit if canUpdateCv is false", async () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)
    const { result } = renderHook(() => useUpdateCvForm(mockCv))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockUpdateCvMutation).not.toHaveBeenCalled()
  })

  it("should show error toast if mutation fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockUpdateCvMutation.mockRejectedValue(new Error("Mutation error"))

    const { result } = renderHook(() => useUpdateCvForm(mockCv))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("update.error")
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should handle cv without a user user id safely", async () => {
    const cvNoUser = { ...mockCv, user: null }
    const { result } = renderHook(() => useUpdateCvForm(cvNoUser))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith(undefined)
    expect(mockUpdateCvMutation).toHaveBeenCalled()
  })
})

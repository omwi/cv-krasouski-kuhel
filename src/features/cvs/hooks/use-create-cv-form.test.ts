import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"

import { useCreateCvForm } from "./use-create-cv-form"

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } = await import("./cv-hooks-test-helper")
  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, null, {
      name: "New CV",
      education: "Uni",
      description: "Cool CV",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockPermissions = {
  currentUserId: "current-user-123",
  canCreateCv: true,
}
vi.mocked(usePermissions).mockReturnValue(
  mockPermissions as unknown as ReturnType<typeof usePermissions>
)

describe("useCreateCvForm", () => {
  const mockCreateCvMutation = vi.fn()
  let updateCallback: NonNullable<Parameters<typeof useMutation>[1]>["update"]

  beforeEach(() => {
    vi.clearAllMocks()
    updateCallback = undefined
    mockCreateCvMutation.mockReset().mockResolvedValue({
      data: {
        createCv: {
          id: "cv-new",
          name: "New CV",
          description: "Desc",
          user: { id: "user-123" },
        },
      },
    })
    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }
      return [
        mockCreateCvMutation,
        { loading: false },
      ] as unknown as ReturnType<typeof useMutation>
    })
    mockPermissions.canCreateCv = true
  })

  it("should initialize default values and react to dialog open", () => {
    const dialogMock = { open: false, setOpen: vi.fn() }
    const { rerender } = renderHook(
      ({ dialog }) => useCreateCvForm(undefined, dialog),
      { initialProps: { dialog: dialogMock } }
    )

    rerender({ dialog: { open: true, setOpen: dialogMock.setOpen } })
  })

  it("should submit successfully, run mutation, show success toast and close dialog", async () => {
    const mockSetOpen = vi.fn()
    const dialogMock = { open: true, setOpen: mockSetOpen }
    const { result } = renderHook(() =>
      useCreateCvForm("user-custom", dialogMock)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockCreateCvMutation).toHaveBeenCalledWith({
      variables: {
        cv: {
          name: "New CV",
          education: "Uni",
          description: "Cool CV",
          userId: "user-custom",
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("create.success")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should fallback to currentUserId if userId is not supplied", async () => {
    const { result } = renderHook(() => useCreateCvForm(undefined, undefined))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockCreateCvMutation).toHaveBeenCalledWith({
      variables: {
        cv: {
          name: "New CV",
          education: "Uni",
          description: "Cool CV",
          userId: "current-user-123",
        },
      },
    })
  })

  it("should not execute mutation on submit if canCreateCv is false", async () => {
    mockPermissions.canCreateCv = false
    const { result } = renderHook(() => useCreateCvForm())

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockCreateCvMutation).not.toHaveBeenCalled()
  })

  it("should show error toast if mutation fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockCreateCvMutation.mockRejectedValue(new Error("Mutation error"))

    const { result } = renderHook(() => useCreateCvForm())

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("create.error")
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  describe("update cache callback", () => {
    const invokeUpdate = (...args: unknown[]) => {
      const fn = updateCallback as (...args: unknown[]) => void
      fn(...args)
    }

    it("should return early if no data or no newCvRef", () => {
      renderHook(() => useCreateCvForm())
      expect(updateCallback).toBeDefined()

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue(null),
        modify: vi.fn(),
      }

      // No data
      invokeUpdate(mockCache, { data: null })
      expect(mockCache.writeFragment).not.toHaveBeenCalled()

      // writeFragment returns null
      invokeUpdate(mockCache, { data: { createCv: { id: "1" } } })
      expect(mockCache.modify).not.toHaveBeenCalled()
    })

    it("should write fragment and modify cvs root query and user cvs field", () => {
      renderHook(() => useCreateCvForm())

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue({ __ref: "Cv:cv-new" }),
        modify: vi.fn(),
        identify: vi.fn(
          (obj: { __typename: string; id: string }) =>
            `${obj.__typename}:${obj.id}`
        ),
      }

      invokeUpdate(mockCache, {
        data: {
          createCv: {
            id: "cv-new",
            name: "New CV",
            user: { id: "user-123" },
          },
        },
      })

      expect(mockCache.writeFragment).toHaveBeenCalled()
      expect(mockCache.modify).toHaveBeenCalledWith({
        fields: {
          cvs: expect.any(Function),
        },
      })
      expect(mockCache.identify).toHaveBeenCalledWith({
        __typename: "User",
        id: "user-123",
      })
      expect(mockCache.modify).toHaveBeenCalledWith({
        id: "User:user-123",
        fields: {
          cvs: expect.any(Function),
        },
      })
    })

    it("should modify only cvs root query if newCv has no user", () => {
      renderHook(() => useCreateCvForm())

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue({ __ref: "Cv:cv-new" }),
        modify: vi.fn(),
        identify: vi.fn(),
      }

      invokeUpdate(mockCache, {
        data: {
          createCv: {
            id: "cv-new",
            name: "New CV",
            user: null,
          },
        },
      })

      expect(mockCache.writeFragment).toHaveBeenCalled()
      expect(mockCache.modify).toHaveBeenCalledTimes(1)
      expect(mockCache.identify).not.toHaveBeenCalled()
    })
  })
})

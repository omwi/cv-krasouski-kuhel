import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { TFunction } from "i18next"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateDepartmentForm } from "./use-create-department-form"

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, null, {
      name: "Engineering",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockT = vi.fn((key: string) => key) as unknown as TFunction

describe("useCreateDepartmentForm", () => {
  const mockCreateDepartmentMutation = vi.fn()

  let updateCallback:
    | NonNullable<Parameters<typeof useMutation>[1]>["update"]
    | undefined

  beforeEach(() => {
    vi.clearAllMocks()

    updateCallback = undefined

    mockCreateDepartmentMutation.mockReset().mockResolvedValue({
      data: {
        createDepartment: {
          id: "department-1",
          name: "Engineering",
        },
      },
    })

    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }

      return [
        mockCreateDepartmentMutation,
        { loading: false },
      ] as unknown as ReturnType<typeof useMutation>
    })
  })

  it("should initialize successfully", () => {
    const { result } = renderHook(() => useCreateDepartmentForm(mockT))

    expect(result.current.form).toBeDefined()
    expect(result.current.loading).toBe(false)
  })

  it("should submit successfully, run mutation, show success toast and call onSuccess", async () => {
    const onSuccess = vi.fn()

    const { result } = renderHook(() =>
      useCreateDepartmentForm(mockT, onSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockCreateDepartmentMutation).toHaveBeenCalledWith({
      variables: {
        department: {
          name: "Engineering",
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith("create.success")
    expect(onSuccess).toHaveBeenCalled()
  })

  it("should show error toast when mutation throws Error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockCreateDepartmentMutation.mockRejectedValue(
      new Error("Department creation failed")
    )

    const { result } = renderHook(() => useCreateDepartmentForm(mockT))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Department creation failed")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws non-Error value", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockCreateDepartmentMutation.mockRejectedValue("unexpected failure")

    const { result } = renderHook(() => useCreateDepartmentForm(mockT))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("create.error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should not call onSuccess when mutation fails", async () => {
    const onSuccess = vi.fn()

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockCreateDepartmentMutation.mockRejectedValue(new Error("Mutation failed"))

    const { result } = renderHook(() =>
      useCreateDepartmentForm(mockT, onSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(onSuccess).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should expose loading state from mutation", () => {
    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }

      return [
        mockCreateDepartmentMutation,
        { loading: true },
      ] as unknown as ReturnType<typeof useMutation>
    })

    const { result } = renderHook(() => useCreateDepartmentForm(mockT))

    expect(result.current.loading).toBe(true)
  })

  describe("update cache callback", () => {
    const invokeUpdate = (...args: unknown[]) => {
      const fn = updateCallback as (...args: unknown[]) => void
      fn(...args)
    }

    it("should return early if no data or no newRef", () => {
      renderHook(() => useCreateDepartmentForm(mockT))

      expect(updateCallback).toBeDefined()

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue(null),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, { data: null })

      expect(mockCache.writeFragment).not.toHaveBeenCalled()

      invokeUpdate(mockCache, {
        data: {
          createDepartment: {
            id: "department-1",
            name: "Engineering",
          },
        },
      })

      expect(mockCache.modify).not.toHaveBeenCalled()
    })

    it("should write fragment and modify departments cache", () => {
      renderHook(() => useCreateDepartmentForm(mockT))

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue({
          __ref: "Department:department-1",
        }),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, {
        data: {
          createDepartment: {
            id: "department-1",
            name: "Engineering",
          },
        },
      })

      expect(mockCache.writeFragment).toHaveBeenCalled()

      expect(mockCache.modify).toHaveBeenCalledWith({
        fields: {
          departments: expect.any(Function),
        },
      })
    })
  })
})

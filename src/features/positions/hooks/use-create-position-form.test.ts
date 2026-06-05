import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreatePositionForm } from "./use-create-position-form"

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, null, {
      name: "Senior Developer",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

describe("useCreatePositionForm", () => {
  const mockCreatePositionMutation = vi.fn()

  let updateCallback:
    | NonNullable<Parameters<typeof useMutation>[1]>["update"]
    | undefined

  beforeEach(() => {
    vi.clearAllMocks()

    updateCallback = undefined

    mockCreatePositionMutation.mockReset().mockResolvedValue({
      data: {
        createPosition: {
          id: "position-1",
          name: "Senior Developer",
        },
      },
    })

    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }

      return [
        mockCreatePositionMutation,
        { loading: false },
      ] as unknown as ReturnType<typeof useMutation>
    })
  })

  it("should initialize successfully", () => {
    const { result } = renderHook(() => useCreatePositionForm(false, vi.fn()))

    expect(result.current.form).toBeDefined()
    expect(result.current.loading).toBe(false)
  })

  it("should react to open state changes", () => {
    const setOpen = vi.fn()

    const { rerender } = renderHook(
      ({ open }) => useCreatePositionForm(open, setOpen),
      {
        initialProps: {
          open: false,
        },
      }
    )

    rerender({
      open: true,
    })
  })

  it("should submit successfully, run mutation, show success toast and close dialog", async () => {
    const setOpen = vi.fn()

    const { result } = renderHook(() => useCreatePositionForm(true, setOpen))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockCreatePositionMutation).toHaveBeenCalledWith({
      variables: {
        position: {
          name: "Senior Developer",
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith("create.success")
    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it("should show error toast when mutation throws Error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockCreatePositionMutation.mockRejectedValue(
      new Error("Position creation failed")
    )

    const { result } = renderHook(() => useCreatePositionForm(true, vi.fn()))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Position creation failed")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws non-Error value", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockCreatePositionMutation.mockRejectedValue("unexpected failure")

    const { result } = renderHook(() => useCreatePositionForm(true, vi.fn()))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("create.error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should expose loading state from mutation", () => {
    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }

      return [
        mockCreatePositionMutation,
        { loading: true },
      ] as unknown as ReturnType<typeof useMutation>
    })

    const { result } = renderHook(() => useCreatePositionForm(false, vi.fn()))

    expect(result.current.loading).toBe(true)
  })

  describe("update cache callback", () => {
    const invokeUpdate = (...args: unknown[]) => {
      const fn = updateCallback as (...args: unknown[]) => void
      fn(...args)
    }

    it("should return early if no data or no newRef", () => {
      renderHook(() => useCreatePositionForm(false, vi.fn()))

      expect(updateCallback).toBeDefined()

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue(null),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, { data: null })

      expect(mockCache.writeFragment).not.toHaveBeenCalled()

      invokeUpdate(mockCache, {
        data: {
          createPosition: {
            id: "position-1",
            name: "Senior Developer",
          },
        },
      })

      expect(mockCache.modify).not.toHaveBeenCalled()
    })

    it("should write fragment and modify positions cache", () => {
      renderHook(() => useCreatePositionForm(false, vi.fn()))

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue({
          __ref: "Position:position-1",
        }),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, {
        data: {
          createPosition: {
            id: "position-1",
            name: "Senior Developer",
          },
        },
      })

      expect(mockCache.writeFragment).toHaveBeenCalled()

      expect(mockCache.modify).toHaveBeenCalledWith({
        fields: {
          positions: expect.any(Function),
        },
      })
    })
  })
})

import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import type { TFunction } from "i18next"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateLanguageForm } from "./use-create-language-form"

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, null, {
      name: "English",
      native_name: "English",
      iso2: "en",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockT = vi.fn((key: string) => key) as unknown as TFunction

describe("useCreateLanguageForm", () => {
  const mockCreateLanguageMutation = vi.fn()

  let updateCallback: NonNullable<Parameters<typeof useMutation>[1]>["update"]

  beforeEach(() => {
    vi.clearAllMocks()
    updateCallback = undefined

    mockCreateLanguageMutation.mockReset().mockResolvedValue({
      data: {
        createLanguage: {
          id: "lang-1",
          name: "English",
          native_name: "English",
          iso2: "EN",
        },
      },
    })

    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }

      return [
        mockCreateLanguageMutation,
        { loading: false },
      ] as unknown as ReturnType<typeof useMutation>
    })
  })

  it("should initialize successfully", () => {
    const { result } = renderHook(() => useCreateLanguageForm(mockT))
    expect(result.current.form).toBeDefined()
    expect(result.current.loading).toBe(false)
  })

  it("should submit successfully, run mutation, uppercase iso2, show success toast and call onSuccess", async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useCreateLanguageForm(mockT, onSuccess))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockCreateLanguageMutation).toHaveBeenCalledWith({
      variables: {
        language: {
          name: "English",
          native_name: "English",
          iso2: "EN",
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith("create.success")
    expect(onSuccess).toHaveBeenCalled()
  })

  it("should show error toast when mutation throws Error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockCreateLanguageMutation.mockRejectedValue(new Error("Server error"))

    const { result } = renderHook(() => useCreateLanguageForm(mockT))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Server error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws non-Error value", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockCreateLanguageMutation.mockRejectedValue("failure")

    const { result } = renderHook(() => useCreateLanguageForm(mockT))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("create.error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should expose loading state from mutation", () => {
    vi.mocked(useMutation).mockReturnValue([
      mockCreateLanguageMutation,
      { loading: true },
    ] as unknown as ReturnType<typeof useMutation>)
    const { result } = renderHook(() => useCreateLanguageForm(mockT))

    expect(result.current.loading).toBe(true)
  })

  describe("update cache callback", () => {
    const invokeUpdate = (...args: unknown[]) => {
      const fn = updateCallback as (...args: unknown[]) => void
      fn(...args)
    }

    it("should return early if no data or no newRef", () => {
      renderHook(() => useCreateLanguageForm(mockT))

      expect(updateCallback).toBeDefined()

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue(null),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, { data: null })

      expect(mockCache.writeFragment).not.toHaveBeenCalled()

      invokeUpdate(mockCache, {
        data: {
          createLanguage: {
            id: "lang-1",
          },
        },
      })

      expect(mockCache.modify).not.toHaveBeenCalled()
    })

    it("should write fragment and modify languages cache", () => {
      renderHook(() => useCreateLanguageForm(mockT))

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue({
          __ref: "Language:lang-1",
        }),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, {
        data: {
          createLanguage: {
            id: "lang-1",
            name: "English",
            native_name: "English",
            iso2: "EN",
          },
        },
      })

      expect(mockCache.writeFragment).toHaveBeenCalled()

      expect(mockCache.modify).toHaveBeenCalledWith({
        fields: {
          languages: expect.any(Function),
        },
      })
    })
  })
})

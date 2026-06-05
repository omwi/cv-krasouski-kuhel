import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { TFunction } from "i18next"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateProjectForm } from "./use-create-project-form"

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, null, {
      name: "Project Alpha",
      description: "Project description",
      domain: "Finance",
      environment: ["React", "Node.js"],
      start_date: "2024-01-01",
      end_date: "2024-12-31",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

describe("useCreateProjectForm", () => {
  const mockCreateProjectMutation = vi.fn()

  const t = vi.fn((key: string) => key) as unknown as TFunction

  let updateCallback:
    | NonNullable<Parameters<typeof useMutation>[1]>["update"]
    | undefined

  beforeEach(() => {
    vi.clearAllMocks()

    updateCallback = undefined

    mockCreateProjectMutation.mockReset().mockResolvedValue({
      data: {
        createProject: {
          id: "project-1",
          name: "Project Alpha",
        },
      },
    })

    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }

      return [
        mockCreateProjectMutation,
        { loading: false },
      ] as unknown as ReturnType<typeof useMutation>
    })
  })

  it("should initialize successfully", () => {
    const { result } = renderHook(() => useCreateProjectForm(t))

    expect(result.current.form).toBeDefined()
    expect(result.current.loading).toBe(false)
  })

  it("should submit successfully, run mutation, show success toast, reset form and call onSuccess", async () => {
    const onSuccess = vi.fn()

    const { result } = renderHook(() => useCreateProjectForm(t, onSuccess))

    const resetSpy = vi.spyOn(result.current.form, "reset")

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockCreateProjectMutation).toHaveBeenCalledWith({
      variables: {
        project: {
          name: "Project Alpha",
          description: "Project description",
          domain: "Finance",
          environment: ["React", "Node.js"],
          start_date: "2024-01-01",
          end_date: "2024-12-31",
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith("create.success")
    expect(resetSpy).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
  })

  it("should show error toast when mutation throws Error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockCreateProjectMutation.mockRejectedValue(
      new Error("Project creation failed")
    )

    const { result } = renderHook(() => useCreateProjectForm(t))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Project creation failed")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws non-Error value", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockCreateProjectMutation.mockRejectedValue("unexpected failure")

    const { result } = renderHook(() => useCreateProjectForm(t))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("create.error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should not call onSuccess when mutation fails", async () => {
    mockCreateProjectMutation.mockRejectedValue(
      new Error("Project creation failed")
    )

    const onSuccess = vi.fn()

    const { result } = renderHook(() => useCreateProjectForm(t, onSuccess))

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(onSuccess).not.toHaveBeenCalled()
  })

  it("should expose loading state from mutation", () => {
    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }

      return [
        mockCreateProjectMutation,
        { loading: true },
      ] as unknown as ReturnType<typeof useMutation>
    })

    const { result } = renderHook(() => useCreateProjectForm(t))

    expect(result.current.loading).toBe(true)
  })

  describe("update cache callback", () => {
    const invokeUpdate = (...args: unknown[]) => {
      const fn = updateCallback as (...args: unknown[]) => void
      fn(...args)
    }

    it("should return early if no data or no newRef", () => {
      renderHook(() => useCreateProjectForm(t))

      expect(updateCallback).toBeDefined()

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue(null),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, { data: null })

      expect(mockCache.writeFragment).not.toHaveBeenCalled()

      invokeUpdate(mockCache, {
        data: {
          createProject: {
            id: "project-1",
            name: "Project Alpha",
          },
        },
      })

      expect(mockCache.modify).not.toHaveBeenCalled()
    })

    it("should write fragment and modify projects cache", () => {
      renderHook(() => useCreateProjectForm(t))

      const mockCache = {
        writeFragment: vi.fn().mockReturnValue({
          __ref: "Project:project-1",
        }),
        modify: vi.fn(),
      }

      invokeUpdate(mockCache, {
        data: {
          createProject: {
            id: "project-1",
            name: "Project Alpha",
          },
        },
      })

      expect(mockCache.writeFragment).toHaveBeenCalled()

      expect(mockCache.modify).toHaveBeenCalledWith({
        fields: {
          projects: expect.any(Function),
        },
      })
    })
  })
})

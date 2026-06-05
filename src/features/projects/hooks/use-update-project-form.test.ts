import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import type { TFunction } from "i18next"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useUpdateProjectForm } from "./use-update-project-form"

const mockFormState = {
  isDirty: true,
  isValid: true,
}

let submitData = {
  name: "Updated Project",
  description: "Updated Description",
  domain: "Healthcare",
  environment: ["Production"],
  start_date: "2024-01-01",
  end_date: "2024-12-31",
}

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(
      actual.useForm,
      () => mockFormState,
      () => submitData
    ),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockT = vi.fn((key: string) => key) as unknown as TFunction

const mockMutateUpdate = vi.fn()

const mockProject = {
  id: "project-1",
  name: "Project Alpha",
  description: "Original Description",
  domain: "Finance",
  environment: ["Development"],
  start_date: "2023-01-01",
  end_date: "2023-12-31",
}

describe("useUpdateProjectForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockFormState.isDirty = true
    mockFormState.isValid = true

    submitData = {
      name: "Updated Project",
      description: "Updated Description",
      domain: "Healthcare",
      environment: ["Production"],
      start_date: "2024-01-01",
      end_date: "2024-12-31",
    }

    mockMutateUpdate.mockReset().mockResolvedValue({})

    vi.mocked(useMutation).mockImplementation(
      () =>
        [mockMutateUpdate, { loading: false }] as unknown as ReturnType<
          typeof useMutation
        >
    )
  })

  it("should initialize successfully", () => {
    renderHook(() => useUpdateProjectForm(mockT, mockProject))
  })

  it("should call onSuccess and skip mutation when form is not dirty", async () => {
    mockFormState.isDirty = false

    const onSuccess = vi.fn()

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject, onSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).not.toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
  })

  it("should submit successfully, run mutation, show success toast and call onSuccess", async () => {
    const onSuccess = vi.fn()

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject, onSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        project: {
          projectId: "project-1",
          name: "Updated Project",
          description: "Updated Description",
          domain: "Healthcare",
          environment: ["Production"],
          start_date: "2024-01-01",
          end_date: "2024-12-31",
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(onSuccess).toHaveBeenCalled()
  })

  it("should send undefined end_date when empty", async () => {
    submitData.end_date = ""

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        project: {
          projectId: "project-1",
          name: "Updated Project",
          description: "Updated Description",
          domain: "Healthcare",
          environment: ["Production"],
          start_date: "2024-01-01",
          end_date: undefined,
        },
      },
    })
  })

  it("should show success toast and call onSuccess after successful mutation", async () => {
    const onSuccess = vi.fn()

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject, onSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(onSuccess).toHaveBeenCalled()
  })

  it("should show error toast when mutation throws Error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue(new Error("Server error"))

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Server error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws non-Error value", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue("unexpected failure")

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("update.error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should not call onSuccess when mutation fails", async () => {
    const onSuccess = vi.fn()

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue(new Error("Mutation failed"))

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject, onSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(onSuccess).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should expose loading state from mutation", () => {
    vi.mocked(useMutation).mockImplementation(
      () =>
        [mockMutateUpdate, { loading: true }] as unknown as ReturnType<
          typeof useMutation
        >
    )

    const { result } = renderHook(() =>
      useUpdateProjectForm(mockT, mockProject)
    )

    expect(result.current.loading).toBe(true)
  })
})

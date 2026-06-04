import { useMutation, useQuery } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"

import { verifyIsSubmitReadyCombinations } from "../cv-hooks-test-helper"
import { useAddCvProject } from "./use-add-cv-project"

const mockWatchValue = { value: "" }
const mockSetValue = vi.fn()
const mockFormState = { isDirty: false, isValid: false }

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } = await import("../cv-hooks-test-helper")
  return {
    ...actual,
    useForm: createMockUseForm(
      actual.useForm,
      () => mockFormState,
      () => ({
        projectId: "proj-1",
        responsibilities: ["Code stuff"],
        startDate: "2020-01-01",
        endDate: "2022-01-01",
      }),
      () => ({ setValue: mockSetValue })
    ),
    useWatch: () => mockWatchValue.value,
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
  useQuery: vi.fn(),
}))

const mockPermissions = {
  canUpdateCv: vi.fn(),
}
vi.mocked(usePermissions).mockReturnValue(
  mockPermissions as unknown as ReturnType<typeof usePermissions>
)

describe("useAddCvProject", () => {
  const mockAddCvProjectMutation = vi.fn()
  const mockProjectsList = [
    { id: "proj-1", start_date: "2020-01-01", end_date: "2022-01-01" },
    { id: "proj-2", start_date: "2022-01-01", end_date: null },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockWatchValue.value = ""
    mockAddCvProjectMutation.mockReset().mockResolvedValue({})
    vi.mocked(useMutation).mockImplementation(
      () =>
        [mockAddCvProjectMutation, { loading: false }] as unknown as ReturnType<
          typeof useMutation
        >
    )
    vi.mocked(useQuery).mockReturnValue({
      data: { projects: mockProjectsList },
    } as unknown as ReturnType<typeof useQuery>)
    mockPermissions.canUpdateCv.mockReturnValue(true)
  })

  it("should initialize form and handle dialog open reset", () => {
    const { result } = renderHook(
      ({ cvId }) => useAddCvProject({ id: cvId, user: { id: "user-123" } }),
      { initialProps: { cvId: "cv-1" } }
    )

    // Verify initial state
    expect(result.current.open).toBe(false)
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)
  })

  it("should auto-fill startDate and endDate when project is selected", () => {
    mockWatchValue.value = "proj-1"

    renderHook(() => useAddCvProject({ id: "cv-1", user: { id: "user-1" } }))

    expect(mockSetValue).toHaveBeenCalledWith("startDate", "2020-01-01", {
      shouldValidate: true,
      shouldDirty: true,
    })
    expect(mockSetValue).toHaveBeenCalledWith("endDate", "2022-01-01", {
      shouldValidate: true,
      shouldDirty: true,
    })
  })

  it("should submit successfully, call mutation, show toast, and close dialog", async () => {
    const { result } = renderHook(() =>
      useAddCvProject({ id: "cv-1", user: { id: "user-1" } })
    )

    act(() => {
      result.current.setOpen(true)
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith("user-1")
    expect(mockAddCvProjectMutation).toHaveBeenCalledWith({
      variables: {
        project: {
          cvId: "cv-1",
          projectId: "proj-1",
          responsibilities: ["Code stuff"],
          start_date: "2020-01-01",
          end_date: "2022-01-01",
          roles: [],
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("create.success")
    expect(result.current.open).toBe(false)
  })

  it("should not call mutation on submit if canUpdateCv is false", async () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)
    const { result } = renderHook(() =>
      useAddCvProject({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockAddCvProjectMutation).not.toHaveBeenCalled()
  })

  it("should show error toast if mutation fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockAddCvProjectMutation.mockRejectedValue(new Error("Mutation error"))
    const { result } = renderHook(() =>
      useAddCvProject({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("create.error")
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should handle undefined query data gracefully", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useQuery>)
    const { result } = renderHook(() =>
      useAddCvProject({ id: "cv-1", user: { id: "user-1" } })
    )
    expect(result.current.selectedProject).toBeUndefined()
  })

  it("should determine isSubmitReady correctly based on formState combinations", () => {
    const { result, rerender } = renderHook(() =>
      useAddCvProject({ id: "cv-1", user: { id: "user-1" } })
    )
    verifyIsSubmitReadyCombinations(result, rerender, mockFormState)
  })
})

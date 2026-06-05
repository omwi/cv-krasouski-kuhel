import { useMutation, useQuery } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"
import { CvProject, CvUserId } from "@/types/graphql-types"

import { verifyIsSubmitReadyCombinations } from "../cv-hooks-test-helper"
import { useUpdateCvProject } from "./use-update-cv-project"

const mockSubmitValues = {
  projectId: "proj-1",
  responsibilities: ["Code stuff", "Design stuff"],
  startDate: "2020-01-01",
  endDate: "2022-01-01" as string | null | undefined,
}
const mockFormState = { isDirty: false, isValid: false }

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } = await import("../cv-hooks-test-helper")
  return {
    ...actual,
    useForm: createMockUseForm(
      actual.useForm,
      () => mockFormState,
      () => mockSubmitValues
    ),
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

describe("useUpdateCvProject", () => {
  const mockUpdateCvProjectMutation = vi.fn()
  const mockProjectsList = [
    { id: "proj-1", start_date: "2020-01-01", end_date: "2022-01-01" },
  ]
  const mockCvProject = {
    project: { id: "proj-1" },
    responsibilities: ["Code stuff"],
    start_date: "2020-01-01",
    end_date: "2022-01-01",
    roles: ["Dev"],
  } as unknown as CvProject
  const mockCvUserId = {
    id: "cv-1",
    user: { id: "user-1" },
  } as unknown as CvUserId

  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateCvProjectMutation.mockReset().mockResolvedValue({})
    vi.mocked(useMutation).mockImplementation(
      () =>
        [
          mockUpdateCvProjectMutation,
          { loading: false },
        ] as unknown as ReturnType<typeof useMutation>
    )
    vi.mocked(useQuery).mockReturnValue({
      data: { projects: mockProjectsList },
    } as unknown as ReturnType<typeof useQuery>)
    mockPermissions.canUpdateCv.mockReturnValue(true)
    mockSubmitValues.endDate = "2022-01-01"
  })

  it("should initialize default values and react to dialog open", () => {
    const dialogMock = { open: false, setOpen: vi.fn() }
    const { rerender } = renderHook(
      ({ dialog }) => useUpdateCvProject(mockCvProject, mockCvUserId, dialog),
      { initialProps: { dialog: dialogMock } }
    )

    rerender({ dialog: { open: true, setOpen: dialogMock.setOpen } })
  })

  it("should submit successfully, call mutation, show toast, and close dialog if present", async () => {
    const mockSetOpen = vi.fn()
    const dialogMock = { open: true, setOpen: mockSetOpen }
    const { result } = renderHook(() =>
      useUpdateCvProject(mockCvProject, mockCvUserId, dialogMock)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith("user-1")
    expect(mockUpdateCvProjectMutation).toHaveBeenCalledWith({
      variables: {
        project: {
          cvId: "cv-1",
          projectId: "proj-1",
          responsibilities: ["Code stuff", "Design stuff"],
          start_date: "2020-01-01",
          end_date: "2022-01-01",
          roles: ["Dev"],
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("should submit successfully and not close dialog if no dialog is present", async () => {
    const { result } = renderHook(() =>
      useUpdateCvProject(mockCvProject, mockCvUserId)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockUpdateCvProjectMutation).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("update.success")
  })

  it("should not call mutation on submit if canUpdateCv is false", async () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)
    const { result } = renderHook(() =>
      useUpdateCvProject(mockCvProject, mockCvUserId)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockUpdateCvProjectMutation).not.toHaveBeenCalled()
  })

  it("should show error toast if mutation fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockUpdateCvProjectMutation.mockRejectedValue(new Error("Mutation error"))
    const { result } = renderHook(() =>
      useUpdateCvProject(mockCvProject, mockCvUserId)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("update.error")
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should handle undefined endDate on submit correctly", async () => {
    mockSubmitValues.endDate = undefined
    const { result } = renderHook(() =>
      useUpdateCvProject(mockCvProject, mockCvUserId)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockUpdateCvProjectMutation).toHaveBeenCalledWith({
      variables: {
        project: {
          cvId: "cv-1",
          projectId: "proj-1",
          responsibilities: ["Code stuff", "Design stuff"],
          start_date: "2020-01-01",
          end_date: undefined,
          roles: ["Dev"],
        },
      },
    })
  })

  it("should handle undefined/empty projects list gracefully", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useQuery>)
    const { result } = renderHook(() =>
      useUpdateCvProject(mockCvProject, mockCvUserId)
    )
    expect(result.current.selectedProject).toBeUndefined()
  })

  it("should determine isSubmitReady correctly based on formState combinations", () => {
    const { result, rerender } = renderHook(() =>
      useUpdateCvProject(mockCvProject, mockCvUserId)
    )
    verifyIsSubmitReadyCombinations(result, rerender, mockFormState)
  })
})

import { useMutation, useQuery } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"

import { verifyIsSubmitReadyCombinations } from "../cv-hooks-test-helper"
import { useCvSkillAddForm } from "./use-add-cv-skill-form"

const mockFormState = { isDirty: false, isValid: false }

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } = await import("../cv-hooks-test-helper")
  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, () => mockFormState, {
      mastery: "Advanced",
      skillId: "skill-1",
    }),
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

describe("useCvSkillAddForm", () => {
  const mockAddCvSkillMutation = vi.fn()
  const mockSkillsList = [
    { id: "skill-1", name: "React", category: { id: "cat-1" } },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockAddCvSkillMutation.mockReset().mockResolvedValue({})
    vi.mocked(useMutation).mockImplementation(
      () =>
        [mockAddCvSkillMutation, { loading: false }] as unknown as ReturnType<
          typeof useMutation
        >
    )
    vi.mocked(useQuery).mockReturnValue({
      data: { skills: mockSkillsList },
    } as unknown as ReturnType<typeof useQuery>)
    mockPermissions.canUpdateCv.mockReturnValue(true)
  })

  it("should initialize form and handle dialog open reset", () => {
    const { result } = renderHook(
      ({ cvId }) => useCvSkillAddForm({ id: cvId, user: { id: "user-123" } }),
      { initialProps: { cvId: "cv-1" } }
    )

    expect(result.current.open).toBe(false)
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)
  })

  it("should submit successfully, call mutation, show toast, and close dialog", async () => {
    const { result } = renderHook(() =>
      useCvSkillAddForm({ id: "cv-1", user: { id: "user-1" } })
    )

    act(() => {
      result.current.setOpen(true)
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith("user-1")
    expect(mockAddCvSkillMutation).toHaveBeenCalledWith({
      variables: {
        skill: {
          cvId: "cv-1",
          mastery: "Advanced",
          name: "React",
          categoryId: "cat-1",
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("toast.added")
    expect(result.current.open).toBe(false)
  })

  it("should not call mutation on submit if canUpdateCv is false", async () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)
    const { result } = renderHook(() =>
      useCvSkillAddForm({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockAddCvSkillMutation).not.toHaveBeenCalled()
  })

  it("should log error if selected skill is not found in skills list", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    // Return empty skills list
    vi.mocked(useQuery).mockReturnValue({
      data: { skills: [] },
    } as unknown as ReturnType<typeof useQuery>)
    const { result } = renderHook(() =>
      useCvSkillAddForm({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockAddCvSkillMutation).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith("No skill found with id skill-1")
    consoleSpy.mockRestore()
  })

  it("should catch mutation failure safely", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockAddCvSkillMutation.mockRejectedValue(new Error("Mutation error"))
    const { result } = renderHook(() =>
      useCvSkillAddForm({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should handle undefined query data gracefully", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useQuery>)
    const { result } = renderHook(() =>
      useCvSkillAddForm({ id: "cv-1", user: { id: "user-1" } })
    )
    // Just verify it doesn't crash on render
    expect(result.current.loading).toBe(false)
  })

  it("should determine isSubmitReady correctly based on formState combinations", () => {
    const { result, rerender } = renderHook(() =>
      useCvSkillAddForm({ id: "cv-1", user: { id: "user-1" } })
    )
    verifyIsSubmitReadyCombinations(result, rerender, mockFormState)
  })
})

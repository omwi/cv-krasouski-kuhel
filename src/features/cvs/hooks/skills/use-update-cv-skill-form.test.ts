import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"
import { CvSkill } from "@/types/graphql-types"

import { verifyIsSubmitReadyCombinations } from "../cv-hooks-test-helper"
import { useCvSkillUpdateForm } from "./use-update-cv-skill-form"

const mockFormState = { isDirty: false, isValid: false }

// Mock react-hook-form to auto-fill values on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } = await import("../cv-hooks-test-helper")
  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, () => mockFormState, {
      mastery: "Advanced",
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

describe("useCvSkillUpdateForm", () => {
  const mockUpdateCvSkillMutation = vi.fn()
  const mockCvSkill: CvSkill = {
    __typename: "SkillMastery",
    name: "React",
    categoryId: "cat-1",
    mastery: "Expert",
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateCvSkillMutation.mockReset().mockResolvedValue({})
    vi.mocked(useMutation).mockImplementation(
      () =>
        [
          mockUpdateCvSkillMutation,
          { loading: false },
        ] as unknown as ReturnType<typeof useMutation>
    )
    mockPermissions.canUpdateCv.mockReturnValue(true)
  })

  it("should initialize form and handle dialog open reset", () => {
    const { result } = renderHook(
      ({ cvId }) =>
        useCvSkillUpdateForm(
          { id: cvId, user: { id: "user-123" } },
          mockCvSkill
        ),
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
      useCvSkillUpdateForm({ id: "cv-1", user: { id: "user-1" } }, mockCvSkill)
    )

    act(() => {
      result.current.setOpen(true)
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith("user-1")
    expect(mockUpdateCvSkillMutation).toHaveBeenCalledWith({
      variables: {
        skill: {
          cvId: "cv-1",
          mastery: "Advanced",
          name: "React",
          categoryId: "cat-1",
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("toast.updated")
    expect(result.current.open).toBe(false)
  })

  it("should not call mutation on submit if canUpdateCv is false", async () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)
    const { result } = renderHook(() =>
      useCvSkillUpdateForm({ id: "cv-1", user: { id: "user-1" } }, mockCvSkill)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockUpdateCvSkillMutation).not.toHaveBeenCalled()
  })

  it("should catch mutation failure safely", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockUpdateCvSkillMutation.mockRejectedValue(new Error("Mutation error"))
    const { result } = renderHook(() =>
      useCvSkillUpdateForm({ id: "cv-1", user: { id: "user-1" } }, mockCvSkill)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should determine isSubmitReady correctly based on formState combinations", () => {
    const { result, rerender } = renderHook(() =>
      useCvSkillUpdateForm({ id: "cv-1", user: { id: "user-1" } }, mockCvSkill)
    )
    verifyIsSubmitReadyCombinations(result, rerender, mockFormState)
  })
})

import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useUpdateSkillForm } from "./use-update-skill-form"

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, null, () => submitData),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockMutateUpdate = vi.fn()

const mockSkill = {
  __typename: "Skill" as const,
  id: "skill-1",
  name: "React",
  category_name: "Frontend",
  category_parent_name: null,
  created_at: "2024-01-01T00:00:00Z",
  category: {
    __typename: "SkillCategory" as const,
    id: "category-1",
    name: "Frontend",
    order: 1,
  },
}

const submitData = {
  name: "Updated Skill",
  categoryId: "category-2",
}

describe("useUpdateSkillForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockMutateUpdate.mockReset().mockResolvedValue({})

    vi.mocked(useMutation).mockReturnValue([
      mockMutateUpdate,
      { loading: false },
    ] as unknown as ReturnType<typeof useMutation>)
  })

  it("should initialize successfully", () => {
    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(mockSkill, false, setOpen)
    )

    expect(result.current.form).toBeDefined()
  })

  it("should react to open state changes", () => {
    const setOpen = vi.fn()

    const { rerender } = renderHook(
      ({ open }) => useUpdateSkillForm(mockSkill, open, setOpen),
      {
        initialProps: {
          open: false,
        },
      }
    )

    rerender({ open: true })
  })

  it("should submit successfully, run mutation, show success toast and close dialog", async () => {
    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(mockSkill, true, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        skill: {
          skillId: "skill-1",
          name: "Updated Skill",
          categoryId: "category-2",
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it("should send null categoryId when categoryId is none", async () => {
    submitData.categoryId = "none"

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(mockSkill, true, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        skill: {
          skillId: "skill-1",
          name: "Updated Skill",
          categoryId: null,
        },
      },
    })
  })

  it("should send null categoryId when categoryId is empty", async () => {
    submitData.categoryId = ""

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(mockSkill, true, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        skill: {
          skillId: "skill-1",
          name: "Updated Skill",
          categoryId: null,
        },
      },
    })
  })

  it("should show error toast when mutation throws Error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue(new Error("Server error"))

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(mockSkill, true, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Server error")
    expect(consoleSpy).toHaveBeenCalled()
    expect(setOpen).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws non-Error value", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue("unexpected failure")

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(mockSkill, true, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("update.error")
    expect(consoleSpy).toHaveBeenCalled()
    expect(setOpen).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should expose loading state from mutation", () => {
    vi.mocked(useMutation).mockReturnValue([
      mockMutateUpdate,
      { loading: true },
    ] as unknown as ReturnType<typeof useMutation>)

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(mockSkill, false, setOpen)
    )

    expect(result.current.loading).toBe(true)
  })

  it("should handle skill without category", async () => {
    const skillWithoutCategory = {
      ...mockSkill,
      category: null,
    }

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdateSkillForm(skillWithoutCategory, true, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalled()
  })
})

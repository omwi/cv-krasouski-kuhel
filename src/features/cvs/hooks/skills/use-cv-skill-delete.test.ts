import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"

import { useCvSkillsDelete } from "./use-cv-skill-delete"

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockSelection = {
  selectedValues: new Set<string>(),
  startSelection: vi.fn(),
  stopSelection: vi.fn(),
}
vi.mock("@/components/shared/selection/selection-provider", () => ({
  useSelection: () => mockSelection,
}))

const mockPermissions = {
  canUpdateCv: vi.fn(),
}
vi.mocked(usePermissions).mockReturnValue(
  mockPermissions as unknown as ReturnType<typeof usePermissions>
)

describe("useCvSkillsDelete", () => {
  const mockDeleteCvSkillMutation = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockSelection.selectedValues = new Set<string>()
    mockDeleteCvSkillMutation.mockReset().mockResolvedValue({})
    vi.mocked(useMutation).mockImplementation(
      () =>
        [
          mockDeleteCvSkillMutation,
          { loading: false },
        ] as unknown as ReturnType<typeof useMutation>
    )
    mockPermissions.canUpdateCv.mockReturnValue(true)
  })

  it("should return correct delete handlers", () => {
    const { result } = renderHook(() =>
      useCvSkillsDelete({ id: "cv-1", user: { id: "user-1" } })
    )

    act(() => {
      result.current.handleStartDelete()
    })
    expect(mockSelection.startSelection).toHaveBeenCalled()

    act(() => {
      result.current.handleCancelDelete()
    })
    expect(mockSelection.stopSelection).toHaveBeenCalled()
  })

  it("should not delete or call mutation if canUpdateCv is false", async () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)
    const { result } = renderHook(() =>
      useCvSkillsDelete({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(mockDeleteCvSkillMutation).not.toHaveBeenCalled()
  })

  it("should run mutation with selected values and show singular delete toast on success", async () => {
    mockSelection.selectedValues = new Set(["React"])
    const { result } = renderHook(() =>
      useCvSkillsDelete({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith("user-1")
    expect(mockDeleteCvSkillMutation).toHaveBeenCalledWith({
      variables: {
        skills: {
          name: ["React"],
          cvId: "cv-1",
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("toast.deleted")
    expect(mockSelection.stopSelection).toHaveBeenCalled()
  })

  it("should show plural delete toast if more than one skill is selected", async () => {
    mockSelection.selectedValues = new Set(["React", "TypeScript"])
    const { result } = renderHook(() =>
      useCvSkillsDelete({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(toast.success).toHaveBeenCalledWith("toast.deleted-plural")
  })

  it("should catch mutation errors safely", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockDeleteCvSkillMutation.mockRejectedValue(new Error("Mutation error"))
    const { result } = renderHook(() =>
      useCvSkillsDelete({ id: "cv-1", user: { id: "user-1" } })
    )

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(consoleSpy).toHaveBeenCalled()
    expect(mockSelection.stopSelection).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})

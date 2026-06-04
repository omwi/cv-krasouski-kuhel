import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"
import { CvProject, CvUserId } from "@/types/graphql-types"

import { useRemoveCvProject } from "./use-remove-cv-project"

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockPermissions = {
  canUpdateCv: vi.fn(),
}
vi.mocked(usePermissions).mockReturnValue(
  mockPermissions as unknown as ReturnType<typeof usePermissions>
)

describe("useRemoveCvProject", () => {
  const mockRemoveCvProjectMutation = vi.fn()
  const mockCvProject = {
    project: { id: "proj-1" },
  } as unknown as CvProject
  const mockCvUserId = {
    id: "cv-1",
    user: { id: "user-1" },
  } as unknown as CvUserId

  beforeEach(() => {
    vi.clearAllMocks()
    mockRemoveCvProjectMutation.mockReset().mockResolvedValue({})
    vi.mocked(useMutation).mockImplementation(
      () =>
        [
          mockRemoveCvProjectMutation,
          { loading: false },
        ] as unknown as ReturnType<typeof useMutation>
    )
    mockPermissions.canUpdateCv.mockReturnValue(true)
  })

  it("should not call mutation on delete if canUpdateCv is false", async () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)
    const { result } = renderHook(() =>
      useRemoveCvProject(mockCvProject, mockCvUserId)
    )

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(mockRemoveCvProjectMutation).not.toHaveBeenCalled()
  })

  it("should call mutation on delete if canUpdateCv is true", async () => {
    const { result } = renderHook(() =>
      useRemoveCvProject(mockCvProject, mockCvUserId)
    )

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(mockPermissions.canUpdateCv).toHaveBeenCalledWith("user-1")
    expect(mockRemoveCvProjectMutation).toHaveBeenCalledWith({
      variables: {
        project: { projectId: "proj-1", cvId: "cv-1" },
      },
    })
  })
})

import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"
import { Cv } from "@/types/graphql-types"

import { useDeleteCv } from "./use-delete-cv"

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockCanDeleteCv = vi.fn()
vi.mocked(usePermissions).mockReturnValue({
  canDeleteCv: mockCanDeleteCv,
} as unknown as ReturnType<typeof usePermissions>)

describe("useDeleteCv", () => {
  const mockCv: Cv = {
    __typename: "Cv",
    id: "cv-1",
    name: "My CV",
    description: "desc",
    education: null,
    user: { __typename: "User", id: "user-1", email: "user@example.com" },
  }

  const mockDeleteCvMutation = vi.fn().mockResolvedValue({})
  let updateCallback: NonNullable<Parameters<typeof useMutation>[1]>["update"]

  beforeEach(() => {
    vi.clearAllMocks()
    updateCallback = undefined
    vi.mocked(useMutation).mockImplementation((_mutation, options) => {
      if (options?.update) {
        updateCallback = options.update
      }
      return [
        mockDeleteCvMutation,
        { loading: false },
      ] as unknown as ReturnType<typeof useMutation>
    })
  })

  it("should not trigger mutation if user does not have permission", async () => {
    mockCanDeleteCv.mockReturnValue(false)
    const { result } = renderHook(() => useDeleteCv(mockCv))

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(mockCanDeleteCv).toHaveBeenCalledWith("user-1")
    expect(mockDeleteCvMutation).not.toHaveBeenCalled()
  })

  it("should trigger mutation with correct arguments if user has permission", async () => {
    mockCanDeleteCv.mockReturnValue(true)
    const { result } = renderHook(() => useDeleteCv(mockCv))

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(mockCanDeleteCv).toHaveBeenCalledWith("user-1")
    expect(mockDeleteCvMutation).toHaveBeenCalledWith({
      variables: { cv: { cvId: "cv-1" } },
    })
  })

  it("should run update callback and modify cache correctly", () => {
    mockCanDeleteCv.mockReturnValue(true)
    renderHook(() => useDeleteCv(mockCv))

    expect(updateCallback).toBeDefined()

    const mockCache = {
      modify: vi.fn(),
      identify: vi.fn(
        (obj: { __typename: string; id: string }) =>
          `${obj.__typename}:${obj.id}`
      ),
      evict: vi.fn(),
      gc: vi.fn(),
    }

    const invokeUpdate = updateCallback as (...args: unknown[]) => void
    invokeUpdate(mockCache)

    // Verify modify called on cvs field of root query
    expect(mockCache.modify).toHaveBeenCalledWith({
      fields: {
        cvs: expect.any(Function),
      },
    })

    // Verify modify called on User
    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: "User",
      id: "user-1",
    })
    expect(mockCache.modify).toHaveBeenCalledWith({
      id: "User:user-1",
      fields: {
        cvs: expect.any(Function),
      },
    })

    // Verify evict called on Cv
    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: "Cv",
      id: "cv-1",
    })
    expect(mockCache.evict).toHaveBeenCalledWith({
      id: "Cv:cv-1",
    })

    // Verify garbage collection called
    expect(mockCache.gc).toHaveBeenCalledTimes(1)
  })

  it("should handle cv without a user safely", async () => {
    mockCanDeleteCv.mockReturnValue(true)
    const cvNoUser = { ...mockCv, user: null }
    const { result } = renderHook(() => useDeleteCv(cvNoUser))

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(mockCanDeleteCv).toHaveBeenCalledWith(undefined)
    expect(mockDeleteCvMutation).toHaveBeenCalledWith({
      variables: { cv: { cvId: "cv-1" } },
    })

    const mockCache = {
      modify: vi.fn(),
      identify: vi.fn(
        (obj: { __typename: string; id?: string | null }) =>
          `${obj.__typename}:${obj.id}`
      ),
      evict: vi.fn(),
      gc: vi.fn(),
    }
    const invokeUpdate = updateCallback as (...args: unknown[]) => void
    invokeUpdate(mockCache)
    expect(mockCache.gc).toHaveBeenCalled()
  })
})

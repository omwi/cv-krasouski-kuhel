import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Cv } from "@/types/graphql-types"

import { useDeleteCv } from "../use-delete-cv"

// Mock permissions hook
vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: () => ({
    canDeleteCv: () => true,
  }),
}))

// Mock Apollo useMutation hook
const mockDeleteMutation = vi.fn().mockResolvedValue({
  data: {
    deleteCv: {
      affected: 1,
    },
  },
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockDeleteMutation, { loading: false }]),
}))

const mockCv: Cv = {
  __typename: "Cv",
  id: "cv-456",
  name: "Delete target CV",
  description: "Description",
  education: "Education",
  user: {
    __typename: "User",
    id: "user-123",
    email: "user@example.com",
  },
}

describe("useDeleteCv", () => {
  it("should trigger mutation when handleDelete is called", async () => {
    const { result } = renderHook(() => useDeleteCv(mockCv))

    expect(result.current.handleDelete).toBeDefined()

    await act(async () => {
      await result.current.handleDelete()
    })

    // Verify useMutation called with correct input parameters
    expect(mockDeleteMutation).toHaveBeenCalledWith({
      variables: {
        cv: {
          cvId: "cv-456",
        },
      },
    })
  })
})

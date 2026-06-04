import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react"
import { Controller } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"
import { UserSkill } from "@/types/graphql-types"

import { useUserSkillUpdateForm } from "../use-user-skill-update-form"

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(() => ({
    canUpdateUser: () => true,
  })),
}))

const mockMutation = vi.fn().mockResolvedValue({})
vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockMutation, { loading: false }]),
}))

const mockUserSkill: UserSkill = {
  __typename: "SkillMastery",
  name: "React",
  categoryId: "frontend",
  mastery: "Advanced",
}

describe("useUserSkillUpdateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutation.mockResolvedValue({})
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should initialize default form values and submit successfully", async () => {
    const { result } = renderHook(() =>
      useUserSkillUpdateForm("123", mockUserSkill)
    )

    // Verify initial values
    expect(result.current.control).toBeDefined()
    expect(result.current.isSubmitReady).toBe(false)
    expect(result.current.open).toBe(false)

    // Trigger open state
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)

    // Trigger form submit
    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify useMutation called with correct input parameters
    expect(mockMutation).toHaveBeenCalled()
  })

  it("should handle error during submission", async () => {
    const error = new Error("Failed to update")
    mockMutation.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() =>
      useUserSkillUpdateForm("123", mockUserSkill)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(consoleSpy).toHaveBeenCalledWith(error)
    consoleSpy.mockRestore()
  })

  it("should return early if user lacks permissions", async () => {
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => false,
    } as unknown as ReturnType<typeof usePermissions>)

    const { result } = renderHook(() =>
      useUserSkillUpdateForm("123", mockUserSkill)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutation).not.toHaveBeenCalled()
  })

  it("should update isSubmitReady when form becomes dirty and valid", async () => {
    const TestComponent = () => {
      const { control, isSubmitReady } = useUserSkillUpdateForm(
        "123",
        mockUserSkill
      )
      return (
        <form>
          <Controller
            control={control}
            name="mastery"
            render={({ field }) => <input data-testid="mastery" {...field} />}
          />
          <span data-testid="ready">{String(isSubmitReady)}</span>
        </form>
      )
    }

    render(<TestComponent />)

    // Initially not dirty
    expect(screen.getByTestId("ready").textContent).toBe("false")

    // Make form dirty and valid
    fireEvent.change(screen.getByTestId("mastery"), {
      target: { value: "Beginner" },
    })

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true")
    })
  })
})

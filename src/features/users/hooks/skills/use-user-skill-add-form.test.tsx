import { useQuery } from "@apollo/client/react"
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react"
import { Controller } from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { usePermissions } from "@/hooks/use-permissions"

import { useUserSkillAddForm } from "./use-user-skill-add-form"

const mockMutation = vi.fn().mockResolvedValue({})

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(() => ({
    data: {
      skills: [
        { id: "skill-1", name: "React", category: { id: "cat-1" } },
        { id: "skill-2", name: "Angular", category: null }, // no category
      ],
    },
  })),
  useMutation: vi.fn(() => [mockMutation, { loading: false }]),
}))

const fillAndSubmitForm = async (
  form: Pick<
    ReturnType<typeof useUserSkillAddForm>,
    "setOpen" | "reset" | "onSubmit"
  >,
  values: { mastery: string; skillId: string; open?: boolean }
) => {
  if (values.open) {
    act(() => {
      form.setOpen(true)
    })
  }
  act(() => {
    form.reset({ mastery: values.mastery, skillId: values.skillId })
  })
  await act(async () => {
    await form.onSubmit()
  })
}

describe("useUserSkillAddForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => true,
    } as unknown as ReturnType<typeof usePermissions>)
    mockMutation.mockResolvedValue({})
  })

  it("should initialize default form values", () => {
    const { result } = renderHook(() => useUserSkillAddForm("123"))

    expect(result.current.control).toBeDefined()
    expect(result.current.isSubmitReady).toBe(false)
    expect(result.current.open).toBe(false)
  })

  it("should reset form when open state changes", () => {
    const { result } = renderHook(() => useUserSkillAddForm("123"))

    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)
  })

  it("should return early if user lacks permissions", async () => {
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => false,
    } as unknown as ReturnType<typeof usePermissions>)
    // Should not allow submit if user has no edit permissions
    const { result } = renderHook(() =>
      useUserSkillAddForm("unauthorized-user-id")
    )

    await fillAndSubmitForm(result.current, {
      mastery: "Novice",
      skillId: "skill-1",
    })

    expect(mockMutation).not.toHaveBeenCalled()
  })

  it("should return early if skill is not found", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { result } = renderHook(() => useUserSkillAddForm("123"))

    await fillAndSubmitForm(result.current, {
      mastery: "Novice",
      skillId: "non-existent",
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      "No skill found with id non-existent"
    )
    expect(mockMutation).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should submit successfully when skill is found", async () => {
    const { result } = renderHook(() => useUserSkillAddForm("123"))

    await fillAndSubmitForm(result.current, {
      mastery: "Novice",
      skillId: "skill-1",
      open: true,
    })

    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        skill: {
          userId: "123",
          mastery: "Novice",
          name: "React",
          categoryId: "cat-1",
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("toast.added")
    expect(result.current.open).toBe(false)
  })

  it("should submit successfully even if category is missing", async () => {
    const { result } = renderHook(() => useUserSkillAddForm("123"))

    await fillAndSubmitForm(result.current, {
      mastery: "Advanced",
      skillId: "skill-2",
    })

    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        skill: {
          userId: "123",
          mastery: "Advanced",
          name: "Angular",
          categoryId: undefined,
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("toast.added")
  })

  it("should handle error during submission", async () => {
    const error = new Error("Failed to add skill")
    mockMutation.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useUserSkillAddForm("123"))

    await fillAndSubmitForm(result.current, {
      mastery: "Novice",
      skillId: "skill-1",
      open: true,
    })

    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(result.current.open).toBe(false) // Finally block should still close the dialog
    consoleSpy.mockRestore()
  })

  it("should update isSubmitReady when form becomes dirty and valid", async () => {
    const AddSkillTestComponent = () => {
      const { control, isSubmitReady } = useUserSkillAddForm("123")
      return (
        <form data-testid="skill-add-form">
          <Controller
            control={control}
            name="skillId"
            render={({ field }) => (
              <input data-testid="skill-id-input" {...field} />
            )}
          />
          <span data-testid="skill-ready-status">{String(isSubmitReady)}</span>
        </form>
      )
    }

    render(<AddSkillTestComponent />)

    // Initially not dirty
    expect(screen.getByTestId("skill-ready-status").textContent).toBe("false")

    // Make form dirty and valid
    fireEvent.change(screen.getByTestId("skill-id-input"), {
      target: { value: "skill-1" },
    })

    await waitFor(() => {
      expect(screen.getByTestId("skill-ready-status").textContent).toBe("true")
    })
  })

  it("should fallback to empty array if query returns no data", () => {
    vi.mocked(useQuery).mockReturnValueOnce({
      data: undefined,
    } as unknown as ReturnType<typeof useQuery>)
    const { result } = renderHook(() => useUserSkillAddForm("123"))

    // The hook shouldn't crash and initialized successfully
    expect(result.current.open).toBe(false)
  })
})

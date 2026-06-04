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

import { useUserLanguageAddForm } from "../use-user-language-add-form"

const mockMutation = vi.fn().mockResolvedValue({})
vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockMutation, { loading: false }]),
}))

describe("useUserLanguageAddForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should initialize default form values and submit successfully", async () => {
    const { result } = renderHook(() => useUserLanguageAddForm("123"))

    // Verify initial values
    expect(result.current.control).toBeDefined()
    expect(result.current.isSubmitReady).toBe(false)
    expect(result.current.open).toBe(false)

    // Trigger open state
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)

    // Set valid form values so zod validation passes
    act(() => {
      result.current.reset({
        languageName: "Spanish",
        proficiency: "C1",
      })
    })

    // Trigger form submit
    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify useMutation called with correct variables
    expect(mockMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          language: {
            userId: "123",
            name: "Spanish",
            proficiency: "C1",
          },
        },
      })
    )
  })

  it("should handle submission error", async () => {
    const error = new Error("Network error")
    mockMutation.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useUserLanguageAddForm("123"))

    act(() => {
      result.current.reset({
        languageName: "French",
        proficiency: "A2",
      })
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(consoleSpy).toHaveBeenCalledWith(error)
    consoleSpy.mockRestore()
  })

  it("should return early if user does not have update permissions", async () => {
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => false,
    } as unknown as ReturnType<typeof usePermissions>)

    const { result } = renderHook(() => useUserLanguageAddForm("123"))

    act(() => {
      result.current.reset({
        languageName: "German",
        proficiency: "B1",
      })
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutation).not.toHaveBeenCalled()
  })

  it("should update isSubmitReady when form becomes dirty and valid", async () => {
    const TestComponent = () => {
      const { control, isSubmitReady } = useUserLanguageAddForm("123")
      return (
        <form>
          <Controller
            control={control}
            name="languageName"
            render={({ field }) => <input data-testid="lang" {...field} />}
          />
          <Controller
            control={control}
            name="proficiency"
            render={({ field }) => <input data-testid="prof" {...field} />}
          />
          <span data-testid="ready">{String(isSubmitReady)}</span>
        </form>
      )
    }

    render(<TestComponent />)

    // Initially not dirty
    expect(screen.getByTestId("ready").textContent).toBe("false")

    // Make form dirty and valid
    fireEvent.change(screen.getByTestId("lang"), {
      target: { value: "Spanish" },
    })
    fireEvent.change(screen.getByTestId("prof"), { target: { value: "C1" } })

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true")
    })
  })
})

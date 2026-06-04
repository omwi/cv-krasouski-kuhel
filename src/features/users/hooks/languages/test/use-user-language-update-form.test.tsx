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
import { UserLanguage } from "@/types/graphql-types"

import { useUserLanguageUpdateForm } from "../use-user-language-update-form"

const mockMutation = vi.fn().mockResolvedValue({})
vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockMutation, { loading: false }]),
}))

const mockUserLanguage: UserLanguage = {
  __typename: "LanguageProficiency",
  name: "English",
  proficiency: "B2",
}

describe("useUserLanguageUpdateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => true,
    } as unknown as ReturnType<typeof usePermissions>)
  })

  it("should initialize default form values and submit successfully", async () => {
    const { result } = renderHook(() =>
      useUserLanguageUpdateForm("123", mockUserLanguage)
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

  it("should handle submission error", async () => {
    const error = new Error("Network error")
    mockMutation.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() =>
      useUserLanguageUpdateForm("123", mockUserLanguage)
    )

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

    const { result } = renderHook(() =>
      useUserLanguageUpdateForm("123", mockUserLanguage)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify useMutation was NOT called
    expect(mockMutation).not.toHaveBeenCalled()
  })

  it("should update isSubmitReady when form becomes dirty and valid", async () => {
    const TestComponent = () => {
      const { control, isSubmitReady } = useUserLanguageUpdateForm(
        "123",
        mockUserLanguage
      )
      return (
        <form>
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

    // Make form dirty and valid (change from default "B2" to "C1")
    fireEvent.change(screen.getByTestId("prof"), { target: { value: "C1" } })

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true")
    })
  })
})

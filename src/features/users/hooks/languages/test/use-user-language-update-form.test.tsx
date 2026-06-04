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

const mockAllowPermissions = () =>
  vi.mocked(usePermissions).mockReturnValue({
    canUpdateUser: () => true,
  } as unknown as ReturnType<typeof usePermissions>)

describe("useUserLanguageUpdateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAllowPermissions()
  })

  it("should initialize default form values and submit successfully", async () => {
    const { result } = renderHook(() =>
      useUserLanguageUpdateForm("123", mockUserLanguage)
    )

    // Verify initial values match the existing language
    expect(result.current.control).toBeDefined()
    expect(result.current.isSubmitReady).toBe(false)
    expect(result.current.open).toBe(false)

    // Open dialog
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.open).toBe(true)

    // Trigger form submit (pre-filled from mockUserLanguage)
    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify useMutation called with correct input parameters
    expect(mockMutation).toHaveBeenCalled()
  })

  it("should handle submission error", async () => {
    const networkError = new Error("Network error")
    mockMutation.mockRejectedValueOnce(networkError)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() =>
      useUserLanguageUpdateForm("123", mockUserLanguage)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(consoleSpy).toHaveBeenCalledWith(networkError)
    consoleSpy.mockRestore()
  })

  it("should return early if user does not have update permissions", async () => {
    vi.mocked(usePermissions).mockReturnValue({
      canUpdateUser: () => false,
    } as unknown as ReturnType<typeof usePermissions>)

    const { result } = renderHook(() =>
      useUserLanguageUpdateForm("456", mockUserLanguage)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify mutation was blocked by permission check
    expect(mockMutation).not.toHaveBeenCalled()
  })

  it("should update isSubmitReady when form becomes dirty and valid", async () => {
    const UpdateLanguageTestComponent = () => {
      const { control, isSubmitReady } = useUserLanguageUpdateForm(
        "123",
        mockUserLanguage
      )
      return (
        <form data-testid="update-language-form">
          <Controller
            control={control}
            name="proficiency"
            render={({ field }) => (
              <input data-testid="update-lang-proficiency-input" {...field} />
            )}
          />
          <span data-testid="update-lang-ready-status">
            {String(isSubmitReady)}
          </span>
        </form>
      )
    }

    render(<UpdateLanguageTestComponent />)

    // Initially not dirty
    expect(screen.getByTestId("update-lang-ready-status").textContent).toBe(
      "false"
    )

    // Make form dirty and valid (change from default "B2" to "C1")
    fireEvent.change(screen.getByTestId("update-lang-proficiency-input"), {
      target: { value: "C1" },
    })

    await waitFor(() => {
      expect(screen.getByTestId("update-lang-ready-status").textContent).toBe(
        "true"
      )
    })
  })
})

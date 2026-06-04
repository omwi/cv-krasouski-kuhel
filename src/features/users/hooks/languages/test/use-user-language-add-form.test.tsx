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

const mockAllowPermissions = () =>
  vi.mocked(usePermissions).mockReturnValue({
    canUpdateUser: () => true,
  } as unknown as ReturnType<typeof usePermissions>)

const fillLanguageForm = async (
  form: Pick<ReturnType<typeof useUserLanguageAddForm>, "reset" | "setOpen">,
  values: { languageName: string; proficiency: string; open?: boolean }
) => {
  if (values.open) {
    act(() => {
      form.setOpen(true)
    })
  }
  act(() => {
    form.reset({
      languageName: values.languageName,
      proficiency: values.proficiency,
    })
  })
}

describe("useUserLanguageAddForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAllowPermissions()
  })

  it("should initialize default form values and submit successfully", async () => {
    const { result } = renderHook(() => useUserLanguageAddForm("123"))

    // Verify initial values
    expect(result.current.control).toBeDefined()
    expect(result.current.isSubmitReady).toBe(false)
    expect(result.current.open).toBe(false)

    // Trigger open state and fill form
    await fillLanguageForm(result.current, {
      languageName: "Spanish",
      proficiency: "C1",
      open: true,
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
    expect(result.current.open).toBe(false)
  })

  it("should handle submission error", async () => {
    const error = new Error("Network error")
    mockMutation.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useUserLanguageAddForm("123"))

    await fillLanguageForm(result.current, {
      languageName: "French",
      proficiency: "A2",
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

    const { result } = renderHook(() => useUserLanguageAddForm("456"))

    await fillLanguageForm(result.current, {
      languageName: "German",
      proficiency: "B1",
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutation).not.toHaveBeenCalled()
  })

  it("should update isSubmitReady when form becomes dirty and valid", async () => {
    const AddLanguageTestComponent = () => {
      const { control, isSubmitReady } = useUserLanguageAddForm("123")
      return (
        <form data-testid="add-language-form">
          <Controller
            control={control}
            name="languageName"
            render={({ field }) => (
              <input data-testid="add-lang-name-input" {...field} />
            )}
          />
          <Controller
            control={control}
            name="proficiency"
            render={({ field }) => (
              <input data-testid="add-lang-proficiency-input" {...field} />
            )}
          />
          <span data-testid="add-lang-ready-status">
            {String(isSubmitReady)}
          </span>
        </form>
      )
    }

    render(<AddLanguageTestComponent />)

    // Initially not dirty
    expect(screen.getByTestId("add-lang-ready-status").textContent).toBe(
      "false"
    )

    // Make form dirty and valid
    fireEvent.change(screen.getByTestId("add-lang-name-input"), {
      target: { value: "Spanish" },
    })
    fireEvent.change(screen.getByTestId("add-lang-proficiency-input"), {
      target: { value: "C1" },
    })

    await waitFor(() => {
      expect(screen.getByTestId("add-lang-ready-status").textContent).toBe(
        "true"
      )
    })
  })
})

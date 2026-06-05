import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import type { TFunction } from "i18next"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"

import { useUpdateLanguageForm } from "./use-update-language-form"

const mockFormState = { isDirty: false, isValid: true }

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, () => mockFormState, {
      name: "Updated Language",
      native_name: "Updated Native",
      iso2: "pl",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockT = vi.fn((key: string) => key) as unknown as TFunction

const mockLanguage: TableLanguages = {
  __typename: "Language",
  id: "lang-1",
  name: "English",
  native_name: "English",
  iso2: "en",
}

const mockMutateUpdate = vi.fn()

describe("useUpdateLanguageForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockFormState.isDirty = false
    mockFormState.isValid = true

    mockMutateUpdate.mockResolvedValue({})

    vi.mocked(useMutation).mockReturnValue([
      mockMutateUpdate,
      { loading: false },
    ] as unknown as ReturnType<typeof useMutation>)
  })

  it("should initialize form with language values as default values", () => {
    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT)
    )

    expect(result.current.form.getValues()).toEqual({
      name: "English",
      native_name: "English",
      iso2: "en",
    })
  })

  it("should fall back to empty strings when language values are falsy", () => {
    const emptyLanguage = {
      ...mockLanguage,
      name: "",
      native_name: "",
      iso2: "",
    }

    const { result } = renderHook(() =>
      useUpdateLanguageForm(emptyLanguage, false, mockT)
    )

    expect(result.current.form.getValues()).toEqual({
      name: "",
      native_name: "",
      iso2: "",
    })
  })

  it("should reset form to current language values when open becomes true", () => {
    const { result, rerender } = renderHook(
      ({ open }) => useUpdateLanguageForm(mockLanguage, open, mockT),
      { initialProps: { open: false } }
    )

    act(() => {
      result.current.form.setValue("name", "Changed")
      result.current.form.setValue("native_name", "Changed Native")
      result.current.form.setValue("iso2", "de")
    })

    expect(result.current.form.getValues()).toEqual({
      name: "Changed",
      native_name: "Changed Native",
      iso2: "de",
    })

    rerender({ open: true })

    expect(result.current.form.getValues()).toEqual({
      name: "English",
      native_name: "English",
      iso2: "en",
    })
  })

  it("should not reset form when open is false", () => {
    const { result, rerender } = renderHook(
      ({ open }) => useUpdateLanguageForm(mockLanguage, open, mockT),
      { initialProps: { open: true } }
    )

    act(() => {
      result.current.form.setValue("name", "Changed")
    })

    rerender({ open: false })

    expect(result.current.form.getValues().name).toBe("Changed")
  })

  it("should show info toast and call onSuccess when form is submitted without changes", async () => {
    mockFormState.isDirty = false

    const mockOnSuccess = vi.fn()

    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT, mockOnSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).not.toHaveBeenCalled()
    expect(toast.info).toHaveBeenCalledWith("update.no-changes")
    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it("should call mutation with correct variables when form is dirty", async () => {
    mockFormState.isDirty = true

    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        language: {
          languageId: "lang-1",
          name: "Updated Language",
          native_name: "Updated Native",
          iso2: "PL",
        },
      },
    })
  })

  it("should show success toast and call onSuccess after successful mutation", async () => {
    mockFormState.isDirty = true

    const mockOnSuccess = vi.fn()

    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT, mockOnSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it("should show error toast with the error message when mutation throws an Error instance", async () => {
    mockFormState.isDirty = true

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue(new Error("Server error"))

    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Server error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws a non-Error value", async () => {
    mockFormState.isDirty = true

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue("unexpected failure")

    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("update.error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should not call onSuccess when mutation fails", async () => {
    mockFormState.isDirty = true

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const mockOnSuccess = vi.fn()

    mockMutateUpdate.mockRejectedValue(new Error("Mutation failed"))

    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT, mockOnSuccess)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockOnSuccess).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should expose loading state from mutation", () => {
    vi.mocked(useMutation).mockReturnValue([
      mockMutateUpdate,
      { loading: true },
    ] as unknown as ReturnType<typeof useMutation>)

    const { result } = renderHook(() =>
      useUpdateLanguageForm(mockLanguage, false, mockT)
    )

    expect(result.current.loading).toBe(true)
  })

  it("should reset form with updated language values when language prop changes while open", () => {
    const { result, rerender } = renderHook(
      ({ language }) => useUpdateLanguageForm(language, true, mockT),
      { initialProps: { language: mockLanguage } }
    )

    expect(result.current.form.getValues()).toEqual({
      name: "English",
      native_name: "English",
      iso2: "en",
    })

    rerender({
      language: {
        ...mockLanguage,
        name: "Polish",
        native_name: "Polski",
        iso2: "pl",
      },
    })

    expect(result.current.form.getValues()).toEqual({
      name: "Polish",
      native_name: "Polski",
      iso2: "pl",
    })
  })
})

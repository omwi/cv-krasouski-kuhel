import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import type { TFunction } from "i18next"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"

import { useUpdateDepartmentForm } from "./use-update-department-form"

const mockFormState = { isDirty: false, isValid: true }

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")
  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, () => mockFormState, {
      name: "Updated Department",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockT = vi.fn((key: string) => key) as unknown as TFunction

const mockDepartment: TableDepartment = {
  __typename: "Department",
  id: "dept-1",
  name: "Engineering",
}

const mockMutateUpdate = vi.fn()

describe("useUpdateDepartmentForm", () => {
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

  it("should initialize form with department name as default value", () => {
    const { result } = renderHook(() =>
      useUpdateDepartmentForm(mockDepartment, false, mockT)
    )

    expect(result.current.form.getValues()).toEqual({ name: "Engineering" })
  })

  it("should fall back to empty string when department name is falsy", () => {
    const emptyNameDepartment = { ...mockDepartment, name: "" }
    const { result } = renderHook(() =>
      useUpdateDepartmentForm(emptyNameDepartment, false, mockT)
    )

    expect(result.current.form.getValues()).toEqual({ name: "" })
  })

  it("should reset form to current department name when open becomes true", () => {
    const { result, rerender } = renderHook(
      ({ open }) => useUpdateDepartmentForm(mockDepartment, open, mockT),
      { initialProps: { open: false } }
    )

    act(() => {
      result.current.form.setValue("name", "Changed Name")
    })
    expect(result.current.form.getValues().name).toBe("Changed Name")

    rerender({ open: true })

    expect(result.current.form.getValues().name).toBe("Engineering")
  })

  it("should not reset form when open is false", () => {
    const { result, rerender } = renderHook(
      ({ open }) => useUpdateDepartmentForm(mockDepartment, open, mockT),
      { initialProps: { open: true } }
    )

    act(() => {
      result.current.form.setValue("name", "Changed Name")
    })

    rerender({ open: false })

    expect(result.current.form.getValues().name).toBe("Changed Name")
  })

  it("should show info toast and call onSuccess when form is submitted without changes", async () => {
    mockFormState.isDirty = false
    const mockOnSuccess = vi.fn()
    const { result } = renderHook(() =>
      useUpdateDepartmentForm(mockDepartment, false, mockT, mockOnSuccess)
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
      useUpdateDepartmentForm(mockDepartment, false, mockT)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        department: {
          departmentId: "dept-1",
          name: "Updated Department",
        },
      },
    })
  })

  it("should show success toast and call onSuccess after successful mutation", async () => {
    mockFormState.isDirty = true
    const mockOnSuccess = vi.fn()
    const { result } = renderHook(() =>
      useUpdateDepartmentForm(mockDepartment, false, mockT, mockOnSuccess)
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
      useUpdateDepartmentForm(mockDepartment, false, mockT)
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
      useUpdateDepartmentForm(mockDepartment, false, mockT)
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
      useUpdateDepartmentForm(mockDepartment, false, mockT, mockOnSuccess)
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
      useUpdateDepartmentForm(mockDepartment, false, mockT)
    )

    expect(result.current.loading).toBe(true)
  })

  it("should reset form with updated department name when department prop changes while open", () => {
    const { result, rerender } = renderHook(
      ({ department }) => useUpdateDepartmentForm(department, true, mockT),
      { initialProps: { department: mockDepartment } }
    )

    expect(result.current.form.getValues().name).toBe("Engineering")

    rerender({ department: { ...mockDepartment, name: "Product" } })

    expect(result.current.form.getValues().name).toBe("Product")
  })
})

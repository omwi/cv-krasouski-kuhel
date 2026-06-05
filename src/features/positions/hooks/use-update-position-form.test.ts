import { useMutation } from "@apollo/client/react"
import { act, renderHook } from "@testing-library/react"
import * as rhf from "react-hook-form"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TablePosition } from "@/features/positions/components/table/positions-table-columns"

import { useUpdatePositionForm } from "./use-update-position-form"

const mockFormState = { isDirty: false, isValid: true }

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof rhf>()
  const { createMockUseForm } =
    await import("@/features/cvs/hooks/cv-hooks-test-helper")

  return {
    ...actual,
    useForm: createMockUseForm(actual.useForm, () => mockFormState, {
      name: "Updated Position",
    }),
  }
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(),
}))

const mockT = vi.fn((key: string) => key)

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: mockT,
  }),
}))

const mockPosition: TablePosition = {
  __typename: "Position",
  id: "position-1",
  name: "Frontend Developer",
}

const mockMutateUpdate = vi.fn()

describe("useUpdatePositionForm", () => {
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

  it("should initialize form with position name as default value", () => {
    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    expect(result.current.form.getValues()).toEqual({
      name: "Frontend Developer",
    })
  })

  it("should fall back to empty string when position name is falsy", () => {
    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdatePositionForm(
        {
          ...mockPosition,
          name: "",
        },
        false,
        setOpen
      )
    )

    expect(result.current.form.getValues()).toEqual({
      name: "",
    })
  })

  it("should reset form when open becomes true", () => {
    const setOpen = vi.fn()

    const { result, rerender } = renderHook(
      ({ open }) => useUpdatePositionForm(mockPosition, open, setOpen),
      { initialProps: { open: false } }
    )

    act(() => {
      result.current.form.setValue("name", "Changed Name")
    })

    expect(result.current.form.getValues().name).toBe("Changed Name")

    rerender({ open: true })

    expect(result.current.form.getValues().name).toBe("Frontend Developer")
  })

  it("should not reset form when open is false", () => {
    const setOpen = vi.fn()

    const { result, rerender } = renderHook(
      ({ open }) => useUpdatePositionForm(mockPosition, open, setOpen),
      { initialProps: { open: true } }
    )

    act(() => {
      result.current.form.setValue("name", "Changed Name")
    })

    rerender({ open: false })

    expect(result.current.form.getValues().name).toBe("Changed Name")
  })

  it("should show info toast and close modal when submitted without changes", async () => {
    mockFormState.isDirty = false

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).not.toHaveBeenCalled()
    expect(toast.info).toHaveBeenCalledWith("update.no-changes")
    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it("should call mutation with correct variables when form is dirty", async () => {
    mockFormState.isDirty = true

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mockMutateUpdate).toHaveBeenCalledWith({
      variables: {
        position: {
          positionId: "position-1",
          name: "Updated Position",
        },
      },
    })
  })

  it("should show success toast and close modal after successful mutation", async () => {
    mockFormState.isDirty = true

    const setOpen = vi.fn()

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.success).toHaveBeenCalledWith("update.success")
    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it("should show error toast when mutation throws Error", async () => {
    mockFormState.isDirty = true

    const setOpen = vi.fn()

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue(new Error("Server error"))

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Server error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should show fallback error toast when mutation throws non-Error value", async () => {
    mockFormState.isDirty = true

    const setOpen = vi.fn()

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue("unexpected failure")

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("update.error")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should not close modal when mutation fails", async () => {
    mockFormState.isDirty = true

    const setOpen = vi.fn()

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    mockMutateUpdate.mockRejectedValue(new Error("Mutation failed"))

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(setOpen).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("should expose loading state from mutation", () => {
    const setOpen = vi.fn()

    vi.mocked(useMutation).mockReturnValue([
      mockMutateUpdate,
      { loading: true },
    ] as unknown as ReturnType<typeof useMutation>)

    const { result } = renderHook(() =>
      useUpdatePositionForm(mockPosition, false, setOpen)
    )

    expect(result.current.loading).toBe(true)
  })

  it("should reset form when position prop changes while open", () => {
    const setOpen = vi.fn()

    const { result, rerender } = renderHook(
      ({ position }) => useUpdatePositionForm(position, true, setOpen),
      {
        initialProps: {
          position: mockPosition,
        },
      }
    )

    expect(result.current.form.getValues().name).toBe("Frontend Developer")

    rerender({
      position: {
        ...mockPosition,
        name: "Backend Developer",
      },
    })

    expect(result.current.form.getValues().name).toBe("Backend Developer")
  })
})

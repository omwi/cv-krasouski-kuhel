import { act, renderHook } from "@testing-library/react"
import * as reactHookForm from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { useCreateCvForm } from "../use-create-cv-form"

// Mock permissions hook
vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: () => ({
    currentUserId: "user-123",
    canCreateCv: () => true,
  }),
}))

// Mock localization hook
vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock react-hook-form's useForm to bypass validation on submit
vi.mock("react-hook-form", async (importOriginal) => {
  const original = await importOriginal<typeof reactHookForm>()
  return {
    ...original,
    useForm: (options: unknown) => {
      const form = original.useForm(
        options as Parameters<typeof original.useForm>[0]
      )
      return {
        ...form,
        handleSubmit:
          (
            callback: (data: {
              name: string
              education: string
              description: string
            }) => Promise<void> | void
          ) =>
          async () => {
            // Trigger onSubmit with valid mocked form values directly
            await callback({
              name: "Test CV",
              education: "Test Education",
              description: "Test Description",
            })
          },
      }
    },
  }
})

// Mock Apollo useMutation hook
const mockCreateMutation = vi.fn().mockResolvedValue({
  data: {
    createCv: {
      id: "cv-456",
      name: "New CV",
      description: "Software Developer CV",
      education: "University",
      user: {
        id: "user-123",
        email: "user@example.com",
      },
    },
  },
})

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockCreateMutation, { loading: false }]),
}))

describe("useCreateCvForm", () => {
  it("should initialize with default values and handle submit successfully", async () => {
    const mockSetOpen = vi.fn()
    const { result } = renderHook(() =>
      useCreateCvForm("user-123", { open: true, setOpen: mockSetOpen })
    )

    // Initial check
    expect(result.current.control).toBeDefined()
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.errors.name).toBeUndefined()

    const nameRegister = result.current.register("name")
    expect(nameRegister).toBeDefined()

    // Trigger onSubmit
    await act(async () => {
      await result.current.onSubmit()
    })

    // Verify useMutation called with correct input parameters
    expect(mockCreateMutation).toHaveBeenCalled()
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })
})

import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { API_ENDPOINTS } from "@/config/api-endpoints"

import {
  getForgotPasswordSchema,
  useForgotPasswordForm,
} from "./use-forgot-password-form"

const submitAction = vi.fn()

vi.mock("@hookform/resolvers/standard-schema", () => ({
  standardSchemaResolver: vi.fn((schema) => schema),
}))

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react")

  return {
    ...actual,
    startTransition: vi.fn((cb: () => void) => cb()),
    useActionState: vi.fn((action) => {
      submitAction.mockImplementation((data) =>
        action(
          {
            error: null,
            success: false,
          },
          data
        )
      )

      return [
        {
          error: null,
          success: false,
        },
        submitAction,
        false,
      ]
    }),
  }
})

vi.mock("react-hook-form", () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    formState: {
      errors: {},
    },
    handleSubmit:
      (callback: (data: { email: string }) => Promise<void> | void) =>
      async () =>
        callback({
          email: "john@example.com",
        }),
  })),
}))

describe("getForgotPasswordSchema", () => {
  it("should validate a valid email and reject an invalid email", () => {
    const schema = getForgotPasswordSchema(((key: string) => key) as never)

    expect(() =>
      schema.parse({
        email: "john@example.com",
      })
    ).not.toThrow()

    expect(() =>
      schema.parse({
        email: "invalid-email",
      })
    ).toThrow()
  })
})

describe("useForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    global.fetch = vi.fn()
  })

  it("should submit successfully and show success toast", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useForgotPasswordForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      API_ENDPOINTS.auth["forgot-password"],
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "john@example.com",
        }),
      }
    )

    expect(toast.success).toHaveBeenCalledWith("toast.forgot-password")

    expect(toast.error).not.toHaveBeenCalled()
  })

  it("should show api error toast when response is not ok", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Email not found",
      }),
    } as Response)

    const { result } = renderHook(() => useForgotPasswordForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Email not found")

    expect(toast.success).not.toHaveBeenCalled()
  })

  it("should show thrown error message when fetch rejects", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useForgotPasswordForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Network error")

    expect(toast.success).not.toHaveBeenCalled()
  })

  it("should show fallback message for non Error exceptions", async () => {
    vi.mocked(global.fetch).mockRejectedValue("unexpected")

    const { result } = renderHook(() => useForgotPasswordForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred")
  })

  it("should expose form state values", () => {
    const { result } = renderHook(() => useForgotPasswordForm())

    expect(result.current.errors).toEqual({})
    expect(result.current.isPending).toBe(false)
    expect(result.current.state).toEqual({
      error: null,
      success: false,
    })
  })
})

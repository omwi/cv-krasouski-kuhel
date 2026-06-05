import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"

import {
  getResetPasswordSchema,
  useResetPasswordForm,
} from "./use-reset-password-form"

const mockFormAction = vi.fn()
const pushMock = vi.fn()

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation")

  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
    useSearchParams: () =>
      new URLSearchParams({
        token: "test-token",
      }),
  }
})

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react")

  return {
    ...actual,
    startTransition: vi.fn((cb: () => void) => cb()),
    useActionState: vi.fn((action) => {
      mockFormAction.mockImplementation((data) =>
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
        mockFormAction,
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
      (
        callback: (data: {
          newPassword: string
          "confirm-password": string
        }) => void
      ) =>
      () =>
        callback({
          newPassword: "password123",
          "confirm-password": "password123",
        }),
  })),
}))

vi.mock("@hookform/resolvers/standard-schema", () => ({
  standardSchemaResolver: vi.fn((schema) => schema),
}))

describe("getResetPasswordSchema", () => {
  const t = ((key: string) => key) as never

  it("should validate matching passwords", () => {
    const schema = getResetPasswordSchema(t)

    expect(() =>
      schema.parse({
        newPassword: "password123",
        "confirm-password": "password123",
      })
    ).not.toThrow()
  })

  it("should reject mismatched passwords", () => {
    const schema = getResetPasswordSchema(t)

    expect(() =>
      schema.parse({
        newPassword: "password123",
        "confirm-password": "different123",
      })
    ).toThrow()
  })

  it("should reject short passwords", () => {
    const schema = getResetPasswordSchema(t)

    expect(() =>
      schema.parse({
        newPassword: "123",
        "confirm-password": "123",
      })
    ).toThrow()
  })
})

describe("useResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it("should reset password successfully and redirect to login", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useResetPasswordForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      API_ENDPOINTS.auth["reset-password"],
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify({
          newPassword: "password123",
        }),
      }
    )

    expect(toast.success).toHaveBeenCalledWith("toast.reset-success")

    expect(pushMock).toHaveBeenCalledWith(paths.auth.login.get())
  })

  it("should show api error message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Invalid token",
      }),
    } as Response)

    const { result } = renderHook(() => useResetPasswordForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Invalid token")
  })

  it("should show fallback api error message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useResetPasswordForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Failed")
  })

  it("should show thrown error message", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useResetPasswordForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Network error")
  })

  it("should show fallback message for non Error exceptions", async () => {
    vi.mocked(global.fetch).mockRejectedValue("unexpected")

    const { result } = renderHook(() => useResetPasswordForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred")
  })
})

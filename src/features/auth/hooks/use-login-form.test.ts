import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { API_ENDPOINTS } from "@/config/api-endpoints"

import { getLoginSchema, useLoginForm } from "./use-login-form"

const mockFormAction = vi.fn()

vi.mock("@/features/auth/utils/sanitize-callback-url", () => ({
  sanitizeCallbackUrl: vi.fn(() => "/dashboard"),
}))

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
      (callback: (data: { email: string; password: string }) => void) => () =>
        callback({
          email: "john@example.com",
          password: "password123",
        }),
  })),
}))

vi.mock("@hookform/resolvers/standard-schema", () => ({
  standardSchemaResolver: vi.fn((schema) => schema),
}))

describe("getLoginSchema", () => {
  it("should validate valid login input", () => {
    const schema = getLoginSchema(((key: string) => key) as never)

    expect(() =>
      schema.parse({
        email: "john@example.com",
        password: "password123",
      })
    ).not.toThrow()
  })

  it("should reject invalid email and short password", () => {
    const schema = getLoginSchema(((key: string) => key) as never)

    expect(() =>
      schema.parse({
        email: "invalid",
        password: "123",
      })
    ).toThrow()
  })
})

describe("useLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    global.fetch = vi.fn()

    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        href: "",
      },
    })
  })

  it("should redirect on successful login", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(global.fetch).toHaveBeenCalledWith(API_ENDPOINTS.auth.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "john@example.com",
        password: "password123",
      }),
    })

    expect(window.location.href).toBe("/dashboard")
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("should show translated invalid credentials message for 401 responses", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        message: "Unauthorized",
      }),
    } as Response)

    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("errors.invalid-credentials")
  })

  it("should show translated invalid credentials message when api returns invalid credentials", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        message: "Invalid credentials",
      }),
    } as Response)

    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("errors.invalid-credentials")
  })

  it("should show api error message for non-auth failures", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        message: "Server error",
      }),
    } as Response)

    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Server error")
  })

  it("should show fallback login failed message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Login failed")
  })

  it("should show thrown error message", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Network error")
  })

  it("should show fallback message for non Error exceptions", async () => {
    vi.mocked(global.fetch).mockRejectedValue("unexpected")

    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred")
  })
})

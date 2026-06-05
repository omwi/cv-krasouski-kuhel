import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"

import { getSignupSchema, useSignupForm } from "./use-signup-form"

const mockFormAction = vi.fn()

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

describe("getSignupSchema", () => {
  const t = ((key: string) => key) as never

  it("should validate valid signup input", () => {
    const schema = getSignupSchema(t)

    expect(() =>
      schema.parse({
        email: "john@example.com",
        password: "password123",
      })
    ).not.toThrow()
  })

  it("should reject invalid email and short password", () => {
    const schema = getSignupSchema(t)

    expect(() =>
      schema.parse({
        email: "invalid",
        password: "123",
      })
    ).toThrow()
  })
})

describe("useSignupForm", () => {
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

  it("should signup successfully and redirect to verification page", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useSignupForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(global.fetch).toHaveBeenCalledWith(API_ENDPOINTS.auth.signup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "john@example.com",
        password: "password123",
      }),
      cache: "no-store",
    })

    expect(window.location.href).toBe(paths.verification.get())

    expect(toast.error).not.toHaveBeenCalled()
  })

  it("should show api error message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Email already exists",
      }),
    } as Response)

    const { result } = renderHook(() => useSignupForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Email already exists")
  })

  it("should show fallback signup failed message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useSignupForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Signup failed")
  })

  it("should show thrown error message", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useSignupForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Network error")
  })

  it("should show fallback message for non Error exceptions", async () => {
    vi.mocked(global.fetch).mockRejectedValue("unexpected")

    const { result } = renderHook(() => useSignupForm())

    await act(async () => {
      result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred")
  })

  it("should expose initial form state", () => {
    const { result } = renderHook(() => useSignupForm())

    expect(result.current.errors).toEqual({})
    expect(result.current.isPending).toBe(false)
    expect(result.current.state).toEqual({
      error: null,
      success: false,
    })
  })
})

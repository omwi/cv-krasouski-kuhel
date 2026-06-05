import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"

import {
  getVerificationSchema,
  useVerificationForm,
} from "./use-verification-form"

const pushMock = vi.fn()

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation")

  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

vi.mock("react-hook-form", () => ({
  useForm: vi.fn(() => ({
    setValue: vi.fn(),
    watch: vi.fn(),
    formState: {
      errors: {},
    },
    handleSubmit: (callback: (data: { otp: string }) => Promise<void>) => () =>
      callback({
        otp: "123456",
      }),
  })),
}))

vi.mock("@hookform/resolvers/standard-schema", () => ({
  standardSchemaResolver: vi.fn((schema) => schema),
}))

describe("getVerificationSchema", () => {
  const t = ((key: string) => key) as never

  it("should validate a six digit otp", () => {
    const schema = getVerificationSchema(t)

    expect(() =>
      schema.parse({
        otp: "123456",
      })
    ).not.toThrow()
  })

  it("should reject otp with invalid length", () => {
    const schema = getVerificationSchema(t)

    expect(() =>
      schema.parse({
        otp: "123",
      })
    ).toThrow()
  })
})

describe("useVerificationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it("should verify successfully and redirect to users page", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useVerificationForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(global.fetch).toHaveBeenCalledWith(API_ENDPOINTS.auth.verify, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: "123456",
      }),
    })

    expect(toast.success).toHaveBeenCalledWith("toast.verification-success")

    expect(pushMock).toHaveBeenCalledWith(paths.users.get())

    expect(toast.error).not.toHaveBeenCalled()
  })

  it("should show api error message when request fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Invalid OTP",
      }),
    } as Response)

    const { result } = renderHook(() => useVerificationForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("Invalid OTP")

    expect(pushMock).not.toHaveBeenCalled()
  })

  it("should show translated fallback message when api returns no message", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useVerificationForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("errors.verify-failed")
  })

  it("should show unexpected error message when fetch throws", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useVerificationForm())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(toast.error).toHaveBeenCalledWith("errors.unexpected")

    expect(pushMock).not.toHaveBeenCalled()
  })

  it("should expose form state values", () => {
    const { result } = renderHook(() => useVerificationForm())

    expect(result.current.errors).toEqual({})
    expect(result.current.isPending).toBe(false)
    expect(typeof result.current.setValue).toBe("function")
    expect(typeof result.current.watch).toBe("function")
  })
})

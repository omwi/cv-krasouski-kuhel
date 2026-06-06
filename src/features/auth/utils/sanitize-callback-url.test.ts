import { describe, expect, it } from "vitest"

import { paths } from "@/config/paths"

import { sanitizeCallbackUrl } from "./sanitize-callback-url"

describe("sanitizeCallbackUrl", () => {
  const fallback = paths.users.get()

  it.each([[null], [""]])("returns fallback for %s", (url) => {
    expect(sanitizeCallbackUrl(url, fallback)).toBe(fallback)
  })

  it.each([
    ["https://evil.com"],
    ["http://evil.com"],
    ["javascript:alert(1)"],
    ["users"],
  ])("rejects non-relative url %s", (url) => {
    expect(sanitizeCallbackUrl(url, fallback)).toBe(fallback)
  })

  it.each([["//evil.com"], ["///evil.com"]])(
    "rejects protocol-relative url %s",
    (url) => {
      expect(sanitizeCallbackUrl(url, fallback)).toBe(fallback)
    }
  )

  it.each([
    ["/users"],
    ["/users/123"],
    ["/users?tab=settings"],
    ["/users#profile"],
    ["/auth/login?redirectTo=/users"],
  ])("allows valid relative url %s", (url) => {
    expect(sanitizeCallbackUrl(url, fallback)).toBe(url)
  })

  it("uses custom fallback", () => {
    expect(sanitizeCallbackUrl("https://evil.com", "/login")).toBe("/login")
  })
})

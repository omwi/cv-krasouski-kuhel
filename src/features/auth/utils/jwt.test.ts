import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

import { COOKIES } from "@/config/const"

import { checkAccessToken, decodeJwtPayload } from "./jwt"

function createJwt(payload: object) {
  const header = btoa(
    JSON.stringify({
      alg: "none",
      typ: "JWT",
    })
  )

  const body = btoa(JSON.stringify(payload))

  return `${header}.${body}.signature`
}

function createRequest(token?: string) {
  const headers = new Headers()

  if (token) {
    headers.set("cookie", `${COOKIES.ACCESS_TOKEN}=${token}`)
  }

  return new NextRequest("http://localhost", {
    headers,
  })
}

describe("decodeJwtPayload", () => {
  it("decodes a valid JWT payload", () => {
    const token = createJwt({
      sub: "123",
      role: "admin",
      exp: 9999999999,
    })

    expect(decodeJwtPayload(token)).toEqual({
      sub: "123",
      role: "admin",
      exp: 9999999999,
    })
  })

  it("returns null for malformed token", () => {
    expect(decodeJwtPayload("invalid")).toBeNull()
  })

  it("returns null for invalid payload", () => {
    expect(decodeJwtPayload("a.b.c")).toBeNull()
  })
})

describe("checkAccessToken", () => {
  it("returns invalid when access token cookie is missing", () => {
    const request = createRequest()

    expect(checkAccessToken(request)).toEqual({
      isValid: false,
    })
  })

  it("returns invalid for malformed token", () => {
    const request = createRequest("invalid")

    expect(checkAccessToken(request)).toEqual({
      isValid: false,
    })
  })

  it("returns invalid for expired token", () => {
    const token = createJwt({
      exp: Math.floor(Date.now() / 1000) - 60,
      role: "admin",
    })

    const request = createRequest(token)

    expect(checkAccessToken(request)).toEqual({
      isValid: false,
    })
  })

  it("returns valid and role for unexpired token", () => {
    const token = createJwt({
      exp: Math.floor(Date.now() / 1000) + 3600,
      role: "admin",
    })

    const request = createRequest(token)

    expect(checkAccessToken(request)).toEqual({
      isValid: true,
      role: "admin",
    })
  })

  it("returns valid without role when role is missing", () => {
    const token = createJwt({
      exp: Math.floor(Date.now() / 1000) + 3600,
    })

    const request = createRequest(token)

    expect(checkAccessToken(request)).toEqual({
      isValid: true,
      role: undefined,
    })
  })
})

import { describe, expect, it } from "vitest"

import {
  parseLocalToUtcString,
  parseUtcToLocal,
  toHumanDate,
  toHumanRange,
} from "@/utils/date"

describe("date utils", () => {
  describe("toHumanDate", () => {
    it("should format date to human readable string", () => {
      const date = new Date(2024, 5, 4) // June 4, 2024
      const formatted = toHumanDate(date, "en-US")
      // e.g. "Tue, Jun 4, 2024" formatted without commas
      expect(formatted).toContain("Jun")
      expect(formatted).toContain("4")
      expect(formatted).toContain("2024")
    })

    it("should fallback to default locale if locale is empty", () => {
      const date = new Date(2024, 5, 4)
      const formatted = toHumanDate(date, undefined)
      expect(formatted).toBeDefined()
    })

    it("should use cache for subsequent formatting", () => {
      const date = new Date(2024, 5, 4)
      const formatted1 = toHumanDate(date, "en-GB")
      const formatted2 = toHumanDate(date, "en-GB")
      expect(formatted1).toBe(formatted2)
    })
  })

  describe("toHumanRange", () => {
    it("should format date range without end date using tillNow fallback", () => {
      const start = new Date(2024, 0, 1) // Jan 1, 2024
      const result = toHumanRange("en-US", "Present", start)
      expect(result).toContain("1/2024")
      expect(result).toContain("Present")
    })

    it("should format date range with end date", () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 5, 1)
      const result = toHumanRange("en-US", "Present", start, end)
      expect(result).toContain("1/2024")
      expect(result).toContain("6/2024")
    })

    it("should use cache for range formatter", () => {
      const start = new Date(2024, 0, 1)
      const result1 = toHumanRange("fr-FR", "Present", start)
      const result2 = toHumanRange("fr-FR", "Present", start)
      expect(result1).toBe(result2)
    })
  })

  describe("parseUtcToLocal", () => {
    it("should return undefined for falsy inputs", () => {
      expect(parseUtcToLocal(undefined)).toBeUndefined()
      expect(parseUtcToLocal("")).toBeUndefined()
    })

    it("should return undefined for invalid date string", () => {
      expect(parseUtcToLocal("invalid-date")).toBeUndefined()
    })

    it("should parse valid UTC date string to local Date", () => {
      const localDate = parseUtcToLocal("2024-06-04T12:00:00Z")
      expect(localDate).toBeDefined()
      expect(localDate?.getFullYear()).toBe(2024)
      expect(localDate?.getMonth()).toBe(5) // June
      expect(localDate?.getDate()).toBe(4)
    })
  })

  describe("parseLocalToUtcString", () => {
    it("should return empty string for undefined input", () => {
      expect(parseLocalToUtcString(undefined)).toBe("")
    })

    it("should convert local date to UTC string representation", () => {
      const date = new Date(2024, 5, 4) // June 4, 2024 local
      const utcStr = parseLocalToUtcString(date)
      expect(utcStr).toContain("2024-06-04T00:00:00.000Z")
    })
  })
})

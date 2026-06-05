import type { TFunction } from "i18next"
import { describe, expect, it, vi } from "vitest"

import { getLanguageSchema } from "@/features/languages/schema"

describe("language-schema validation", () => {
  describe("getLanguageSchema", () => {
    const mockT = vi.fn((key: string) => `translated_${key}`)
    const schema = getLanguageSchema(mockT as unknown as TFunction)

    it("should validate a correct language payload", () => {
      const result = schema.safeParse({
        name: "English",
        iso2: "en",
        native_name: "English",
      })

      expect(result.success).toBe(true)
    })

    it("should allow optional native_name", () => {
      const result = schema.safeParse({
        name: "English",
        iso2: "en",
      })

      expect(result.success).toBe(true)
    })

    it("should fail validation on empty name and call translation function", () => {
      const result = schema.safeParse({
        name: "",
        iso2: "en",
        native_name: "English",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("translated_errors.name")
        expect(mockT).toHaveBeenCalledWith("errors.name", {
          ns: "input",
        })
      }
    })

    it("should fail validation when iso2 is empty", () => {
      const result = schema.safeParse({
        name: "English",
        iso2: "",
        native_name: "English",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("translated_errors.iso2")
        expect(mockT).toHaveBeenCalledWith("errors.iso2", {
          ns: "input",
        })
      }
    })

    it("should fail validation when iso2 is shorter than 2 characters", () => {
      const result = schema.safeParse({
        name: "English",
        iso2: "e",
        native_name: "English",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("translated_errors.iso2")
      }
    })

    it("should fail validation when iso2 is longer than 2 characters", () => {
      const result = schema.safeParse({
        name: "English",
        iso2: "eng",
        native_name: "English",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("translated_errors.iso2")
      }
    })
  })
})

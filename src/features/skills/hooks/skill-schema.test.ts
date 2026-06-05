import type { TFunction } from "i18next"
import { describe, expect, it, vi } from "vitest"

import {
  getSkillCatalogSchema,
  skillAddSchema,
  skillBaseSchema,
} from "./skill-schema"

describe("skill-schema validation", () => {
  describe("getSkillCatalogSchema", () => {
    const mockT = vi.fn((key: string) => `translated_${key}`)
    const schema = getSkillCatalogSchema(mockT as unknown as TFunction)

    it("should validate a correct skill catalog payload", () => {
      const result = schema.safeParse({
        name: "JavaScript",
        categoryId: "cat-1",
      })
      expect(result.success).toBe(true)
    })

    it("should allow optional categoryId", () => {
      const result = schema.safeParse({ name: "JavaScript" })
      expect(result.success).toBe(true)
    })

    it("should fail validation on empty name and call translation function", () => {
      const result = schema.safeParse({ name: "", categoryId: "cat-1" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("translated_errors.name")
        expect(mockT).toHaveBeenCalledWith("errors.name", { ns: "input" })
      }
    })
  })

  describe("skillBaseSchema", () => {
    it("should validate a correct base skill payload", () => {
      const result = skillBaseSchema.safeParse({ mastery: "Expert" })
      expect(result.success).toBe(true)
    })

    it("should fail validation on empty mastery", () => {
      const result = skillBaseSchema.safeParse({ mastery: "" })
      expect(result.success).toBe(false)
    })
  })

  describe("skillAddSchema", () => {
    it("should validate a correct add skill payload", () => {
      const result = skillAddSchema.safeParse({
        mastery: "Expert",
        skillId: "skill-1",
      })
      expect(result.success).toBe(true)
    })

    it("should fail validation on empty skillId", () => {
      const result = skillAddSchema.safeParse({
        mastery: "Expert",
        skillId: "",
      })
      expect(result.success).toBe(false)
    })
  })
})

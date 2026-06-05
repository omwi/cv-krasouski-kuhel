import type { TFunction } from "i18next"
import { describe, expect, it, vi } from "vitest"

import { getProjectSchema } from "@/features/projects/schema"

describe("project-schema validation", () => {
  const mockT = vi.fn((key: string) => `translated_${key}`)
  const schema = getProjectSchema(mockT as unknown as TFunction)

  const validProject = {
    name: "Project Alpha",
    domain: "Finance",
    description: "This is a valid project description.",
    environment: ["React", "Node.js"],
    start_date: "2024-01-01",
    end_date: "2024-12-31",
  }

  describe("getProjectSchema", () => {
    it("should validate a correct project payload", () => {
      const result = schema.safeParse(validProject)

      expect(result.success).toBe(true)
    })

    it("should allow null end_date", () => {
      const result = schema.safeParse({
        ...validProject,
        end_date: null,
      })

      expect(result.success).toBe(true)
    })

    it("should allow undefined end_date", () => {
      const result = schema.safeParse({
        ...validProject,
        end_date: undefined,
      })

      expect(result.success).toBe(true)
    })

    it("should fail validation on empty name and call translation function", () => {
      const result = schema.safeParse({
        ...validProject,
        name: "",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("translated_errors.name")
        expect(mockT).toHaveBeenCalledWith("errors.name", {
          ns: "input",
        })
      }
    })

    it("should fail validation on empty domain", () => {
      const result = schema.safeParse({
        ...validProject,
        domain: "",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("translated_errors.domain")
        expect(mockT).toHaveBeenCalledWith("errors.domain", {
          ns: "input",
        })
      }
    })

    it("should fail validation on short description", () => {
      const result = schema.safeParse({
        ...validProject,
        description: "short",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "translated_errors.description"
        )
        expect(mockT).toHaveBeenCalledWith("errors.description", {
          ns: "input",
        })
      }
    })

    it("should fail validation when environment is empty", () => {
      const result = schema.safeParse({
        ...validProject,
        environment: [],
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "translated_errors.environment"
        )
        expect(mockT).toHaveBeenCalledWith("errors.environment", {
          ns: "input",
        })
      }
    })

    it("should fail validation when environment contains an empty string", () => {
      const result = schema.safeParse({
        ...validProject,
        environment: [""],
      })

      expect(result.success).toBe(false)
    })

    it("should fail validation on empty start_date", () => {
      const result = schema.safeParse({
        ...validProject,
        start_date: "",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "translated_errors.start-date"
        )
        expect(mockT).toHaveBeenCalledWith("errors.start-date", {
          ns: "input",
        })
      }
    })

    it("should fail when end_date is before start_date", () => {
      const result = schema.safeParse({
        ...validProject,
        start_date: "2024-12-31",
        end_date: "2024-01-01",
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "translated_errors.invalid-date-range"
        )
        expect(result.error.issues[0].path).toEqual(["end_date"])
        expect(mockT).toHaveBeenCalledWith("errors.invalid-date-range", {
          ns: "input",
        })
      }
    })

    it("should pass when end_date equals start_date", () => {
      const result = schema.safeParse({
        ...validProject,
        start_date: "2024-01-01",
        end_date: "2024-01-01",
      })

      expect(result.success).toBe(true)
    })

    it("should pass when one of the dates is invalid because refine only checks valid dates", () => {
      const result = schema.safeParse({
        ...validProject,
        start_date: "invalid-date",
        end_date: "2024-01-01",
      })

      expect(result.success).toBe(true)
    })
  })
})

import { describe, expect, it } from "vitest"

import { Mastery } from "@/types/__generated__/graphql"
import { getColors } from "@/utils/skill-colors"

describe("skill-colors utils", () => {
  describe("getColors", () => {
    it("should return correct colors and percent for Novice", () => {
      const result = getColors("Novice")
      expect(result).toEqual({
        color: "bg-skill-novice",
        trackColor: "bg-skill-novice-track",
        percent: 20,
      })
    })

    it("should return correct colors and percent for Advanced", () => {
      const result = getColors("Advanced")
      expect(result).toEqual({
        color: "bg-skill-advanced",
        trackColor: "bg-skill-advanced-track",
        percent: 40,
      })
    })

    it("should return correct colors and percent for Competent", () => {
      const result = getColors("Competent")
      expect(result).toEqual({
        color: "bg-skill-competent",
        trackColor: "bg-skill-competent-track",
        percent: 60,
      })
    })

    it("should return correct colors and percent for Proficient", () => {
      const result = getColors("Proficient")
      expect(result).toEqual({
        color: "bg-skill-proficient",
        trackColor: "bg-skill-proficient-track",
        percent: 80,
      })
    })

    it("should return correct colors and percent for Expert", () => {
      const result = getColors("Expert")
      expect(result).toEqual({
        color: "bg-skill-expert",
        trackColor: "bg-skill-expert-track",
        percent: 100,
      })
    })

    it("should fallback in default case if unexpected value is passed", () => {
      // Cast invalid value to bypass typescript check
      const result = getColors("InvalidMastery" as Mastery)
      expect(result).toBe("InvalidMastery")
    })
  })
})

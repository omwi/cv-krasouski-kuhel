import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CvProject, CvSkill } from "@/types/graphql-types"

import {
  getSkillExperienceYears,
  getSkillLastUsedYear,
} from "./skill-experience"

describe("skill-experience utils", () => {
  const skillMock: CvSkill = {
    __typename: "SkillMastery",
    name: "React",
    categoryId: "1",
    mastery: "Expert",
  }

  describe("getSkillExperienceYears", () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date("2026-06-05T00:00:00Z"))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it("should return 0 when there are no projects", () => {
      const result = getSkillExperienceYears([], skillMock)
      expect(result).toBe(0)
    })

    it("should return 0 when no project contains the skill name in its environment", () => {
      const projects: CvProject[] = [
        {
          __typename: "CvProject",
          id: "1",
          name: "Project 1",
          internal_name: "P1",
          domain: "Web",
          start_date: "2020-01-01T00:00:00Z",
          end_date: "2022-01-01T00:00:00Z",
          description: "Desc",
          environment: ["Angular", "Vue"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p1" },
        },
      ]
      const result = getSkillExperienceYears(projects, skillMock)
      expect(result).toBe(0)
    })

    it("should calculate and sum up experience years for projects with end dates", () => {
      const projects: CvProject[] = [
        {
          __typename: "CvProject",
          id: "1",
          name: "Project 1",
          internal_name: "P1",
          domain: "Web",
          start_date: "2020-01-01T00:00:00Z",
          end_date: "2022-01-01T00:00:00Z",
          description: "Desc",
          environment: ["React", "TypeScript"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p1" },
        },
        {
          __typename: "CvProject",
          id: "2",
          name: "Project 2",
          internal_name: "P2",
          domain: "Web",
          start_date: "2022-06-01T00:00:00Z",
          end_date: "2025-06-01T00:00:00Z",
          description: "Desc",
          environment: ["React"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p2" },
        },
      ]
      const result = getSkillExperienceYears(projects, skillMock)
      expect(result).toBe(5)
    })

    it("should calculate experience years for active projects without end date (using current date)", () => {
      const projects: CvProject[] = [
        {
          __typename: "CvProject",
          id: "1",
          name: "Active Project",
          internal_name: "AP",
          domain: "Web",
          start_date: "2024-06-05T00:00:00Z",
          end_date: null,
          description: "Desc",
          environment: ["React"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p1" },
        },
      ]
      const result = getSkillExperienceYears(projects, skillMock)
      expect(result).toBe(2)
    })
  })

  describe("getSkillLastUsedYear", () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date("2026-06-05T00:00:00Z"))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it("should return undefined when there are no projects", () => {
      const result = getSkillLastUsedYear([], skillMock)
      expect(result).toBeUndefined()
    })

    it("should return undefined when no project contains the skill name", () => {
      const projects: CvProject[] = [
        {
          __typename: "CvProject",
          id: "1",
          name: "Project 1",
          internal_name: "P1",
          domain: "Web",
          start_date: "2020-01-01T00:00:00Z",
          end_date: "2022-01-01T00:00:00Z",
          description: "Desc",
          environment: ["Angular"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p1" },
        },
      ]
      const result = getSkillLastUsedYear(projects, skillMock)
      expect(result).toBeUndefined()
    })

    it("should return the year of the end date when it is specified", () => {
      const projects: CvProject[] = [
        {
          __typename: "CvProject",
          id: "1",
          name: "Project 1",
          internal_name: "P1",
          domain: "Web",
          start_date: "2020-01-01T00:00:00Z",
          end_date: "2023-11-15T00:00:00Z",
          description: "Desc",
          environment: ["React"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p1" },
        },
      ]
      const result = getSkillLastUsedYear(projects, skillMock)
      expect(result).toBe(2023)
    })

    it("should return the current year when end date is not specified", () => {
      const projects: CvProject[] = [
        {
          __typename: "CvProject",
          id: "1",
          name: "Active Project",
          internal_name: "AP",
          domain: "Web",
          start_date: "2024-01-01T00:00:00Z",
          end_date: null,
          description: "Desc",
          environment: ["React"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p1" },
        },
      ]
      const result = getSkillLastUsedYear(projects, skillMock)
      expect(result).toBe(2026)
    })

    it("should return the maximum year when there are multiple matching projects", () => {
      const projects: CvProject[] = [
        {
          __typename: "CvProject",
          id: "1",
          name: "Project 1",
          internal_name: "P1",
          domain: "Web",
          start_date: "2020-01-01T00:00:00Z",
          end_date: "2022-01-01T00:00:00Z",
          description: "Desc",
          environment: ["React"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p1" },
        },
        {
          __typename: "CvProject",
          id: "2",
          name: "Project 2",
          internal_name: "P2",
          domain: "Web",
          start_date: "2022-01-01T00:00:00Z",
          end_date: "2025-05-10T00:00:00Z",
          description: "Desc",
          environment: ["React"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p2" },
        },
        {
          __typename: "CvProject",
          id: "3",
          name: "Project 3",
          internal_name: "P3",
          domain: "Web",
          start_date: "2021-01-01T00:00:00Z",
          end_date: "2024-01-01T00:00:00Z",
          description: "Desc",
          environment: ["React"],
          roles: [],
          responsibilities: [],
          project: { __typename: "Project", id: "p3" },
        },
      ]
      const result = getSkillLastUsedYear(projects, skillMock)
      expect(result).toBe(2025)
    })
  })
})

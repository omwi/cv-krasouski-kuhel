import { Mastery } from "@/types/__generated__/graphql"

export function getColors(mastery: Mastery) {
  switch (mastery) {
    case "Novice":
      return {
        color: "bg-skill-novice",
        trackColor: "bg-skill-novice-track",
        percent: 20,
      }
    case "Advanced":
      return {
        color: "bg-skill-advanced",
        trackColor: "bg-skill-advanced-track",
        percent: 40,
      }
    case "Competent":
      return {
        color: "bg-skill-competent",
        trackColor: "bg-skill-competent-track",
        percent: 60,
      }
    case "Proficient":
      return {
        color: "bg-skill-proficient",
        trackColor: "bg-skill-proficient-track",
        percent: 80,
      }
    case "Expert":
      return {
        color: "bg-skill-expert",
        trackColor: "bg-skill-expert-track",
        percent: 100,
      }
    default:
      const _: never = mastery
      return _
  }
}

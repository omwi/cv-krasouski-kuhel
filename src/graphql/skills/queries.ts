import { gql, TypedDocumentNode } from "@apollo/client"

import { SKILL_FIELDS_FRAGMENT } from "@/graphql/skills/fragments"
import {
  SkillCategoriesQuery,
  SkillCategoriesQueryVariables,
  SkillsQuery,
  SkillsQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_SKILLS: TypedDocumentNode<SkillsQuery, SkillsQueryVariables> =
  gql`
    query Skills {
      skills {
        ...SkillFields
      }
    }

    ${SKILL_FIELDS_FRAGMENT}
  `

export const GET_SKILL_CATEGORIES: TypedDocumentNode<
  SkillCategoriesQuery,
  SkillCategoriesQueryVariables
> = gql`
  query SkillCategories {
    skillCategories {
      id
      name
      order
      parent {
        id
        name
        order
      }
      children {
        id
        name
        order
      }
    }
  }
`

import { gql, TypedDocumentNode } from "@apollo/client"

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
        id
        name
        category_name
        category_parent_name
        created_at
        category {
          id
          name
          order
        }
      }
    }
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

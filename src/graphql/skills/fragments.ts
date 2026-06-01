import { gql, TypedDocumentNode } from "@apollo/client"

import { SkillFieldsFragment } from "@/types/__generated__/graphql"

export const SKILL_FIELDS_FRAGMENT: TypedDocumentNode<
  SkillFieldsFragment,
  never
> = gql`
  fragment SkillFields on Skill {
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
`

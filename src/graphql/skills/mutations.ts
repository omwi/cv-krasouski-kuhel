import { gql, TypedDocumentNode } from "@apollo/client"

import {
  CreateSkillMutation,
  CreateSkillMutationVariables,
  DeleteSkillMutation,
  DeleteSkillMutationVariables,
  UpdateSkillMutation,
  UpdateSkillMutationVariables,
} from "@/types/__generated__/graphql"

export const CREATE_SKILL: TypedDocumentNode<
  CreateSkillMutation,
  CreateSkillMutationVariables
> = gql`
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      name
      created_at
    }
  }
`

export const UPDATE_SKILL: TypedDocumentNode<
  UpdateSkillMutation,
  UpdateSkillMutationVariables
> = gql`
  mutation UpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
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

export const DELETE_SKILL: TypedDocumentNode<
  DeleteSkillMutation,
  DeleteSkillMutationVariables
> = gql`
  mutation DeleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      affected
    }
  }
`

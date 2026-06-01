import { gql, TypedDocumentNode } from "@apollo/client"

import { SKILL_FIELDS_FRAGMENT } from "@/graphql/skills/fragments"
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
      ...SkillFields
    }
  }

  ${SKILL_FIELDS_FRAGMENT}
`

export const UPDATE_SKILL: TypedDocumentNode<
  UpdateSkillMutation,
  UpdateSkillMutationVariables
> = gql`
  mutation UpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      ...SkillFields
    }
  }

  ${SKILL_FIELDS_FRAGMENT}
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

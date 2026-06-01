import { gql, TypedDocumentNode } from "@apollo/client"

import {
  ProfileLanguagesFragment,
  ProfileSkillsFragment,
  UserFieldsFragment,
} from "@/types/__generated__/graphql"

export const USER_FIELDS_FRAGMENT: TypedDocumentNode<
  UserFieldsFragment,
  never
> = gql`
  fragment UserFields on User {
    id
    created_at
    email
    role
    is_verified
    department_name
    position_name
    department {
      id
      name
    }
    position {
      id
      name
    }
    profile {
      id
      avatar
      first_name
      last_name
      full_name
    }
  }
`

export const PROFILE_SKILLS_FRAGMENT: TypedDocumentNode<
  ProfileSkillsFragment,
  never
> = gql`
  fragment ProfileSkills on Profile {
    id
    skills {
      name
      categoryId
      mastery
    }
  }
`

export const PROFILE_LANGUAGES_FRAGMENT: TypedDocumentNode<
  ProfileLanguagesFragment,
  never
> = gql`
  fragment ProfileLanguages on Profile {
    id
    languages {
      name
      proficiency
    }
  }
`

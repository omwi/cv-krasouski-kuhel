import { gql, TypedDocumentNode } from "@apollo/client"

import {
  PROFILE_LANGUAGES_FRAGMENT,
  PROFILE_SKILLS_FRAGMENT,
  USER_FIELDS_FRAGMENT,
} from "@/graphql/users/fragments"
import {
  GetUserCvsQuery,
  GetUserCvsQueryVariables,
  GetUserLanguagesQuery,
  GetUserLanguagesQueryVariables,
  GetUserQuery,
  GetUserQueryVariables,
  GetUserSkillsQuery,
  GetUserSkillsQueryVariables,
  GetUsersListQuery,
  GetUsersListQueryVariables,
} from "@/types/__generated__/graphql"

import "@/types/__generated__/graphql"

import { BASE_CV_FRAGMENT } from "@/graphql/cvs/fragments"

export const GET_USERS_LIST: TypedDocumentNode<
  GetUsersListQuery,
  GetUsersListQueryVariables
> = gql`
  query GetUsersList {
    users {
      ...UserFields
    }
  }

  ${USER_FIELDS_FRAGMENT}
`

export const GET_USER: TypedDocumentNode<GetUserQuery, GetUserQueryVariables> =
  gql`
    query GetUser($userId: ID!) {
      user(userId: $userId) {
        ...UserFields
      }
    }

    ${USER_FIELDS_FRAGMENT}
  `

export const GET_USER_SKILLS: TypedDocumentNode<
  GetUserSkillsQuery,
  GetUserSkillsQueryVariables
> = gql`
  query GetUserSkills($userId: ID!) {
    profile(userId: $userId) {
      ...ProfileSkills
    }
  }

  ${PROFILE_SKILLS_FRAGMENT}
`

export const GET_USER_LANGUAGES: TypedDocumentNode<
  GetUserLanguagesQuery,
  GetUserLanguagesQueryVariables
> = gql`
  query GetUserLanguages($userId: ID!) {
    profile(userId: $userId) {
      ...ProfileLanguages
    }
  }

  ${PROFILE_LANGUAGES_FRAGMENT}
`

export const GET_USER_CVS: TypedDocumentNode<
  GetUserCvsQuery,
  GetUserCvsQueryVariables
> = gql`
  query GetUserCvs($userId: ID!) {
    user(userId: $userId) {
      id
      cvs {
        ...BaseCv
      }
    }
  }

  ${BASE_CV_FRAGMENT}
`

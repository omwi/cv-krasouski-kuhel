import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetUsersListQuery,
  GetUsersListQueryVariables,
  UserQuery,
  UserQueryVariables,
} from "@/types/__generated__/graphql"

import "@/types/__generated__/graphql"

export const GET_USERS_LIST: TypedDocumentNode<
  GetUsersListQuery,
  GetUsersListQueryVariables
> = gql`
  query GetUsersList {
    users {
      id
      email
      department_name
      position_name
      profile {
        avatar
        first_name
        last_name
        full_name
      }
    }
  }
`

export const USER: TypedDocumentNode<UserQuery, UserQueryVariables> = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      id
      created_at
      email
      profile {
        id
        first_name
        last_name
        full_name
        avatar
      }
      department {
        id
        name
      }
      position {
        id
        name
      }
      is_verified
      role
    }
  }
`

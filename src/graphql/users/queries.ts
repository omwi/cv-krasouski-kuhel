import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetUserQuery,
  GetUserQueryVariables,
  GetUsersListQuery,
  GetUsersListQueryVariables,
} from "@/types/__generated__/graphql"

import "@/types/__generated__/graphql"

export const GET_USERS_LIST: TypedDocumentNode<
  GetUsersListQuery,
  GetUsersListQueryVariables
> = gql`
  query GetUsersList {
    users {
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
  }
`

export const GET_USER: TypedDocumentNode<GetUserQuery, GetUserQueryVariables> =
  gql`
    query GetUser($userId: ID!) {
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

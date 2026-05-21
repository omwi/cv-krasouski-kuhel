import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetUserQuery,
  GetUserQueryVariables,
} from "@/types/__generated__/graphql"

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

import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetUsersListQuery,
  GetUsersListQueryVariables,
} from "@/types/__generated__/graphql"

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

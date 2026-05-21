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
      role
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
        avatar
        first_name
        last_name
        full_name
      }
    }
  }
`

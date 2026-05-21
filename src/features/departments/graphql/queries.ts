import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetDepartmentsQuery,
  GetDepartmentsQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_DEPARTMENTS: TypedDocumentNode<
  GetDepartmentsQuery,
  GetDepartmentsQueryVariables
> = gql`
  query GetDepartments {
    departments {
      id
      name
    }
  }
`

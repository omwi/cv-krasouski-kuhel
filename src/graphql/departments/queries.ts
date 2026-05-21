import { gql, TypedDocumentNode } from "@apollo/client"

import {
  DepartmentsQuery,
  DepartmentsQueryVariables,
} from "@/types/__generated__/graphql"

export const DEPARTMENTS: TypedDocumentNode<
  DepartmentsQuery,
  DepartmentsQueryVariables
> = gql`
  query Departments {
    departments {
      id
      name
    }
  }
`

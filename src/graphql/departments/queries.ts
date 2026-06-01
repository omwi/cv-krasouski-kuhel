import { gql, TypedDocumentNode } from "@apollo/client"

import { DEPARTMENT_FIELDS_FRAGMENT } from "@/graphql/departments/fragments"
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
      ...DepartmentFields
    }
  }

  ${DEPARTMENT_FIELDS_FRAGMENT}
`

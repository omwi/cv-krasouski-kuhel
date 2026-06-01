import { gql, TypedDocumentNode } from "@apollo/client"

import { DepartmentFieldsFragment } from "@/types/__generated__/graphql"

export const DEPARTMENT_FIELDS_FRAGMENT: TypedDocumentNode<
  DepartmentFieldsFragment,
  never
> = gql`
  fragment DepartmentFields on Department {
    id
    name
  }
`

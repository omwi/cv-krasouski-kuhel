import { gql, TypedDocumentNode } from "@apollo/client"

import { ProjectFieldsFragment } from "@/types/__generated__/graphql"

export const PROJECT_FIELDS_FRAGMENT: TypedDocumentNode<
  ProjectFieldsFragment,
  never
> = gql`
  fragment ProjectFields on Project {
    id
    name
    internal_name
    description
    domain
    environment
    start_date
    end_date
  }
`

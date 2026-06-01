import { gql, TypedDocumentNode } from "@apollo/client"

import { ProjectFragment } from "@/types/__generated__/graphql"

export const PROJECT_FRAGMENT: TypedDocumentNode<ProjectFragment, never> = gql`
  fragment Project on Project {
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

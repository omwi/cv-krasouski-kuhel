import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetProjectsQuery,
  GetProjectsQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_PROJECTS: TypedDocumentNode<
  GetProjectsQuery,
  GetProjectsQueryVariables
> = gql`
  query GetProjects {
    projects {
      id
      name
      internal_name
      description
      domain
      environment
      start_date
      end_date
    }
  }
`

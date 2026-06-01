import { gql, TypedDocumentNode } from "@apollo/client"

import { PROJECT_FIELDS_FRAGMENT } from "@/graphql/projects/fragments"
import {
  GetProjectQuery,
  GetProjectQueryVariables,
  GetProjectsQuery,
  GetProjectsQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_PROJECTS: TypedDocumentNode<
  GetProjectsQuery,
  GetProjectsQueryVariables
> = gql`
  query GetProjects {
    projects {
      ...ProjectFields
    }
  }

  ${PROJECT_FIELDS_FRAGMENT}
`

export const GET_PROJECT: TypedDocumentNode<
  GetProjectQuery,
  GetProjectQueryVariables
> = gql`
  query GetProject($projectId: ID!) {
    project(projectId: $projectId) {
      ...ProjectFields
    }
  }

  ${PROJECT_FIELDS_FRAGMENT}
`

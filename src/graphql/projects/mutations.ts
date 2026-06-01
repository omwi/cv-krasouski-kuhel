import { gql, TypedDocumentNode } from "@apollo/client"

import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
} from "@/types/__generated__/graphql"

export const CREATE_PROJECT: TypedDocumentNode<
  CreateProjectMutation,
  CreateProjectMutationVariables
> = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
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
export const UPDATE_PROJECT: TypedDocumentNode<
  UpdateProjectMutation,
  UpdateProjectMutationVariables
> = gql`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      id
      name
      description
      domain
      environment
      start_date
      end_date
    }
  }
`
export const DELETE_PROJECT: TypedDocumentNode<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
> = gql`
  mutation DeleteProject($project: DeleteProjectInput!) {
    deleteProject(project: $project) {
      affected
    }
  }
`

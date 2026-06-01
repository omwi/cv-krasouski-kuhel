import { gql, TypedDocumentNode } from "@apollo/client"

import { PROJECT_FRAGMENT } from "@/graphql/projects/fragments"
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
      ...Project
    }
  }
  ${PROJECT_FRAGMENT}
`
export const UPDATE_PROJECT: TypedDocumentNode<
  UpdateProjectMutation,
  UpdateProjectMutationVariables
> = gql`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      ...Project
    }
  }
  ${PROJECT_FRAGMENT}
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

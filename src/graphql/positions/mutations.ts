import { gql, TypedDocumentNode } from "@apollo/client"

import {
  CreatePositionMutation,
  CreatePositionMutationVariables,
  DeletePositionMutation,
  DeletePositionMutationVariables,
  UpdatePositionMutation,
  UpdatePositionMutationVariables,
} from "@/types/__generated__/graphql"

export const CREATE_POSITION: TypedDocumentNode<
  CreatePositionMutation,
  CreatePositionMutationVariables
> = gql`
  mutation CreatePosition($position: CreatePositionInput!) {
    createPosition(position: $position) {
      id
      name
    }
  }
`
export const UPDATE_POSITION: TypedDocumentNode<
  UpdatePositionMutation,
  UpdatePositionMutationVariables
> = gql`
  mutation UpdatePosition($position: UpdatePositionInput!) {
    updatePosition(position: $position) {
      name
      id
    }
  }
`
export const DELETE_POSITION: TypedDocumentNode<
  DeletePositionMutation,
  DeletePositionMutationVariables
> = gql`
  mutation DeletePosition($position: DeletePositionInput!) {
    deletePosition(position: $position) {
      affected
    }
  }
`

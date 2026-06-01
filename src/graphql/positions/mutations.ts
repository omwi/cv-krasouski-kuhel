import { gql, TypedDocumentNode } from "@apollo/client"

import { POSITION_FIELDS_FRAGMENT } from "@/graphql/positions/fragments"
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
      ...PositionFields
    }
  }

  ${POSITION_FIELDS_FRAGMENT}
`
export const UPDATE_POSITION: TypedDocumentNode<
  UpdatePositionMutation,
  UpdatePositionMutationVariables
> = gql`
  mutation UpdatePosition($position: UpdatePositionInput!) {
    updatePosition(position: $position) {
      ...PositionFields
    }
  }

  ${POSITION_FIELDS_FRAGMENT}
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

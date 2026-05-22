import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetPositionsQuery,
  GetPositionsQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_POSITIONS: TypedDocumentNode<
  GetPositionsQuery,
  GetPositionsQueryVariables
> = gql`
  query GetPositions {
    positions {
      id
      name
    }
  }
`

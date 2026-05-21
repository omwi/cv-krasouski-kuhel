import { gql, TypedDocumentNode } from "@apollo/client"

import {
  PositionsQuery,
  PositionsQueryVariables,
} from "@/types/__generated__/graphql"

export const POSITIONS: TypedDocumentNode<
  PositionsQuery,
  PositionsQueryVariables
> = gql`
  query Positions {
    positions {
      id
      name
    }
  }
`

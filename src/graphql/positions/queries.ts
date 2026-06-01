import { gql, TypedDocumentNode } from "@apollo/client"

import { POSITION_FIELDS_FRAGMENT } from "@/graphql/positions/fragments"
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
      ...PositionFields
    }
  }

  ${POSITION_FIELDS_FRAGMENT}
`

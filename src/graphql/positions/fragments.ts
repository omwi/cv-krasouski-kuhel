import { gql, TypedDocumentNode } from "@apollo/client"

import { PositionFieldsFragment } from "@/types/__generated__/graphql"

export const POSITION_FIELDS_FRAGMENT: TypedDocumentNode<
  PositionFieldsFragment,
  never
> = gql`
  fragment PositionFields on Position {
    id
    name
  }
`

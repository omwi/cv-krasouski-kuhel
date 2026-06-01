import { gql, TypedDocumentNode } from "@apollo/client"

import { LanguageFieldsFragment } from "@/types/__generated__/graphql"

export const LANGUAGE_FIELDS_FRAGMENT: TypedDocumentNode<
  LanguageFieldsFragment,
  never
> = gql`
  fragment LanguageFields on Language {
    id
    iso2
    name
    native_name
  }
`

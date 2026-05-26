import { gql, TypedDocumentNode } from "@apollo/client"

import {
  GetLanguagesQuery,
  GetLanguagesQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_LANGUAGES: TypedDocumentNode<
  GetLanguagesQuery,
  GetLanguagesQueryVariables
> = gql`
  query GetLanguages {
    languages {
      id
      iso2
      name
      native_name
    }
  }
`

import { gql, TypedDocumentNode } from "@apollo/client"

import { LANGUAGE_FIELDS_FRAGMENT } from "@/graphql/languages/fragments"
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
      ...LanguageFields
    }
  }

  ${LANGUAGE_FIELDS_FRAGMENT}
`

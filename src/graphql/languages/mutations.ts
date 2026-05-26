import { gql, TypedDocumentNode } from "@apollo/client"

import {
  CreateLanguageMutation,
  CreateLanguageMutationVariables,
  GetLanguagesQuery,
  GetLanguagesQueryVariables,
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables,
} from "@/types/__generated__/graphql"

export const CREATE_LANGUAGE: TypedDocumentNode<
  CreateLanguageMutation,
  CreateLanguageMutationVariables
> = gql`
  mutation CreateLanguage($language: CreateLanguageInput!) {
    createLanguage(language: $language) {
      iso2
      name
      native_name
    }
  }
`

export const UPDATE_LANGUAGE: TypedDocumentNode<
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables
> = gql`
  mutation UpdateLanguage($language: UpdateLanguageInput!) {
    updateLanguage(language: $language) {
      id
      iso2
      name
      native_name
    }
  }
`

export const DELETE_LANGUAGE: TypedDocumentNode<
  GetLanguagesQuery,
  GetLanguagesQueryVariables
> = gql`
  mutation DeleteLanguage($language: DeleteLanguageInput!) {
    deleteLanguage(language: $language) {
      affected
    }
  }
`

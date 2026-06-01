import { gql, TypedDocumentNode } from "@apollo/client"

import {
  BaseCvFragment,
  CvProjectFragment,
} from "@/types/__generated__/graphql"

export const CV_PROJECT_FRAGMENT: TypedDocumentNode<CvProjectFragment, never> =
  gql`
    fragment CvProject on CvProject {
      id
      project {
        id
      }
      name
      internal_name
      domain
      start_date
      end_date
      description
      environment
      roles
      responsibilities
    }
  `

export const BASE_CV_FRAGMENT: TypedDocumentNode<BaseCvFragment, never> = gql`
  fragment BaseCv on Cv {
    id
    name
    description
    education
    user {
      id
      email
    }
  }
`

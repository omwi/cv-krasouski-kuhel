import { gql, TypedDocumentNode } from "@apollo/client"

import { CvProjectFragment } from "@/types/__generated__/graphql"

export const CV_PROJECT_FRAGMENT: TypedDocumentNode<CvProjectFragment, never> =
  gql`
    fragment CvProject on CvProject {
      id
      project {
        id
      }
      name
      domain
      start_date
      end_date
      description
      environment
      roles
      responsibilities
    }
  `

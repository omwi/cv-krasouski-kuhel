import { gql, TypedDocumentNode } from "@apollo/client"

import { CV_PROJECT_FRAGMENT } from "@/graphql/cvs/fragments"
import {
  GetCvQuery,
  GetCvQueryVariables,
  GetCvsQuery,
  GetCvsQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_CVS: TypedDocumentNode<GetCvsQuery, GetCvsQueryVariables> =
  gql`
    query GetCvs {
      cvs {
        id
        name
        education
        description
        user {
          id
          email
        }
      }
    }
  `

export const GET_CV: TypedDocumentNode<GetCvQuery, GetCvQueryVariables> = gql`
  query GetCv($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      name
      education
      description
      user {
        id
        profile {
          full_name
        }
        position_name
      }
      languages {
        name
        proficiency
      }
    }
  }
`

export const GET_CV_SKILLS = gql`
  query GetCvSkills($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      user {
        id
      }
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`

export const GET_CV_PROJECTS = gql`
  query GetCvProjects($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      projects {
        ...CvProject
      }
    }
  }

  ${CV_PROJECT_FRAGMENT}
`

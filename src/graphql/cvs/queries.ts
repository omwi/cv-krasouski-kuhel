import { gql, TypedDocumentNode } from "@apollo/client"

import { BASE_CV_FRAGMENT, CV_PROJECT_FRAGMENT } from "@/graphql/cvs/fragments"
import {
  GetCvProjectsQuery,
  GetCvProjectsQueryVariables,
  GetCvQuery,
  GetCvQueryVariables,
  GetCvSkillsQuery,
  GetCvSkillsQueryVariables,
  GetCvsQuery,
  GetCvsQueryVariables,
} from "@/types/__generated__/graphql"

export const GET_CVS: TypedDocumentNode<GetCvsQuery, GetCvsQueryVariables> =
  gql`
    query GetCvs {
      cvs {
        ...BaseCv
      }
    }

    ${BASE_CV_FRAGMENT}
  `

export const GET_CV: TypedDocumentNode<GetCvQuery, GetCvQueryVariables> = gql`
  query GetCv($cvId: ID!) {
    cv(cvId: $cvId) {
      ...BaseCv
      user {
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

  ${BASE_CV_FRAGMENT}
`

export const GET_CV_SKILLS: TypedDocumentNode<
  GetCvSkillsQuery,
  GetCvSkillsQueryVariables
> = gql`
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

export const GET_CV_PROJECTS: TypedDocumentNode<
  GetCvProjectsQuery,
  GetCvProjectsQueryVariables
> = gql`
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

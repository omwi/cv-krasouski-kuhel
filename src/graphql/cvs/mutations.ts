import { gql, TypedDocumentNode } from "@apollo/client"

import { CV_PROJECT_FRAGMENT } from "@/graphql/cvs/fragments"
import {
  AddCvProjectMutation,
  AddCvProjectMutationVariables,
  AddCvSkillMutation,
  AddCvSkillMutationVariables,
  CreateCvMutation,
  CreateCvMutationVariables,
  DeleteCvMutation,
  DeleteCvMutationVariables,
  DeleteCvSkillsMutation,
  DeleteCvSkillsMutationVariables,
  ExportPdfMutation,
  ExportPdfMutationVariables,
  RemoveCvProjectMutation,
  RemoveCvProjectMutationVariables,
  UpdateCvMutation,
  UpdateCvMutationVariables,
  UpdateCvProjectMutation,
  UpdateCvProjectMutationVariables,
  UpdateCvSkillMutation,
  UpdateCvSkillMutationVariables,
} from "@/types/__generated__/graphql"

export const CREATE_CV: TypedDocumentNode<
  CreateCvMutation,
  CreateCvMutationVariables
> = gql`
  mutation CreateCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
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

export const UPDATE_CV: TypedDocumentNode<
  UpdateCvMutation,
  UpdateCvMutationVariables
> = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
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

export const DELETE_CV: TypedDocumentNode<
  DeleteCvMutation,
  DeleteCvMutationVariables
> = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`

export const ADD_CV_SKILL: TypedDocumentNode<
  AddCvSkillMutation,
  AddCvSkillMutationVariables
> = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`

export const UPDATE_CV_SKILL: TypedDocumentNode<
  UpdateCvSkillMutation,
  UpdateCvSkillMutationVariables
> = gql`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`

export const DELETE_CV_SKILLS: TypedDocumentNode<
  DeleteCvSkillsMutation,
  DeleteCvSkillsMutationVariables
> = gql`
  mutation DeleteCvSkills($skills: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skills) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`

export const ADD_CV_PROJECT: TypedDocumentNode<
  AddCvProjectMutation,
  AddCvProjectMutationVariables
> = gql`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id
      projects {
        ...CvProject
      }
    }
  }

  ${CV_PROJECT_FRAGMENT}
`

export const UPDATE_CV_PROJECT: TypedDocumentNode<
  UpdateCvProjectMutation,
  UpdateCvProjectMutationVariables
> = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
      projects {
        ...CvProject
      }
    }
  }

  ${CV_PROJECT_FRAGMENT}
`

export const REMOVE_CV_PROJECT: TypedDocumentNode<
  RemoveCvProjectMutation,
  RemoveCvProjectMutationVariables
> = gql`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id
      projects {
        ...CvProject
      }
    }
  }

  ${CV_PROJECT_FRAGMENT}
`

export const EXPORT_PDF: TypedDocumentNode<
  ExportPdfMutation,
  ExportPdfMutationVariables
> = gql`
  mutation ExportPdf($pdf: ExportPdfInput!) {
    exportPdf(pdf: $pdf)
  }
`

import { gql, TypedDocumentNode } from "@apollo/client"

import { DEPARTMENT_FIELDS_FRAGMENT } from "@/graphql/departments/fragments"
import {
  CreateDepartmentMutation,
  CreateDepartmentMutationVariables,
  DeleteDepartmentMutation,
  DeleteDepartmentMutationVariables,
  UpdateDepartmentMutation,
  UpdateDepartmentMutationVariables,
} from "@/types/__generated__/graphql"

export const CREATE_DEPARTMENT: TypedDocumentNode<
  CreateDepartmentMutation,
  CreateDepartmentMutationVariables
> = gql`
  mutation CreateDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      ...DepartmentFields
    }
  }

  ${DEPARTMENT_FIELDS_FRAGMENT}
`

export const UPDATE_DEPARTMENT: TypedDocumentNode<
  UpdateDepartmentMutation,
  UpdateDepartmentMutationVariables
> = gql`
  mutation UpdateDepartment($department: UpdateDepartmentInput!) {
    updateDepartment(department: $department) {
      ...DepartmentFields
    }
  }

  ${DEPARTMENT_FIELDS_FRAGMENT}
`

export const DELETE_DEPARTMENT: TypedDocumentNode<
  DeleteDepartmentMutation,
  DeleteDepartmentMutationVariables
> = gql`
  mutation DeleteDepartment($department: DeleteDepartmentInput!) {
    deleteDepartment(department: $department) {
      affected
    }
  }
`

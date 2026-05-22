import { gql, TypedDocumentNode } from "@apollo/client"

import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "@/types/__generated__/graphql"

export const UPLOAD_AVATAR: TypedDocumentNode<
  UploadAvatarMutation,
  UploadAvatarMutationVariables
> = gql`
  mutation UploadAvatar($avatar: UploadAvatarInput!) {
    uploadAvatar(avatar: $avatar)
  }
`

export const DELETE_AVATAR: TypedDocumentNode<
  DeleteAvatarMutation,
  DeleteAvatarMutationVariables
> = gql`
  mutation DeleteAvatar($avatar: DeleteAvatarInput!) {
    deleteAvatar(avatar: $avatar)
  }
`
export const UPDATE_PROFILE: TypedDocumentNode<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
> = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      id
      first_name
      last_name
    }
  }
`

export const CREATE_USER: TypedDocumentNode<
  CreateUserMutation,
  CreateUserMutationVariables
> = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
      role
      department_name
      position_name
      profile {
        first_name
        last_name
      }
    }
  }
`

export const DELETE_USER: TypedDocumentNode<
  DeleteUserMutation,
  DeleteUserMutationVariables
> = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      affected
     `

export const UPDATE_USER: TypedDocumentNode<
  UpdateUserMutation,
  UpdateUserMutationVariables
> = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      department {
        id
        name
      }
      position {
        id
        name
      }
    }
  }
`

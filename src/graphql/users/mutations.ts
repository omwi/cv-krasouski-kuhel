import { gql, TypedDocumentNode } from "@apollo/client"

import {
  DeleteAvatarMutation,
  DeleteAvatarMutationVariables,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UploadAvatarMutation,
  UploadAvatarMutationVariables,
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

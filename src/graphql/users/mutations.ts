import { gql, TypedDocumentNode } from "@apollo/client"

import {
  AddUserSkillMutation,
  AddUserSkillMutationVariables,
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteAvatarMutation,
  DeleteAvatarMutationVariables,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  DeleteUserSkillMutation,
  DeleteUserSkillMutationVariables,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UpdateUserSkillMutation,
  UpdateUserSkillMutationVariables,
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
      full_name
    }
  }
`

export const ADD_USER_SKILL: TypedDocumentNode<
  AddUserSkillMutation,
  AddUserSkillMutationVariables
> = gql`
  mutation AddUserSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`

export const UPDATE_USER_SKILL: TypedDocumentNode<
  UpdateUserSkillMutation,
  UpdateUserSkillMutationVariables
> = gql`
  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`

export const DELETE_USER_SKILL: TypedDocumentNode<
  DeleteUserSkillMutation,
  DeleteUserSkillMutationVariables
> = gql`
  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
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

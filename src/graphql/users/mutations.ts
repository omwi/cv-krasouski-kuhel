import { gql, TypedDocumentNode } from "@apollo/client"

import {
  PROFILE_LANGUAGES_FRAGMENT,
  PROFILE_SKILLS_FRAGMENT,
  USER_FIELDS_FRAGMENT,
} from "@/graphql/users/fragments"
import {
  AddUserLanguageMutation,
  AddUserLanguageMutationVariables,
  AddUserSkillMutation,
  AddUserSkillMutationVariables,
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteAvatarMutation,
  DeleteAvatarMutationVariables,
  DeleteUserLanguagesMutation,
  DeleteUserLanguagesMutationVariables,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  DeleteUserSkillsMutation,
  DeleteUserSkillsMutationVariables,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateUserLanguageMutation,
  UpdateUserLanguageMutationVariables,
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
      ...ProfileSkills
    }
  }

  ${PROFILE_SKILLS_FRAGMENT}
`

export const UPDATE_USER_SKILL: TypedDocumentNode<
  UpdateUserSkillMutation,
  UpdateUserSkillMutationVariables
> = gql`
  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      ...ProfileSkills
    }
  }

  ${PROFILE_SKILLS_FRAGMENT}
`

export const DELETE_USER_SKILLS: TypedDocumentNode<
  DeleteUserSkillsMutation,
  DeleteUserSkillsMutationVariables
> = gql`
  mutation DeleteUserSkills($skills: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skills) {
      ...ProfileSkills
    }
  }

  ${PROFILE_SKILLS_FRAGMENT}
`

export const CREATE_USER: TypedDocumentNode<
  CreateUserMutation,
  CreateUserMutationVariables
> = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      ...UserFields
    }
  }

  ${USER_FIELDS_FRAGMENT}
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
      ...UserFields
    }
  }

  ${USER_FIELDS_FRAGMENT}
`

export const ADD_USER_LANGUAGE: TypedDocumentNode<
  AddUserLanguageMutation,
  AddUserLanguageMutationVariables
> = gql`
  mutation AddUserLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      ...ProfileLanguages
    }
  }

  ${PROFILE_LANGUAGES_FRAGMENT}
`

export const UPDATE_USER_LANGUAGE: TypedDocumentNode<
  UpdateUserLanguageMutation,
  UpdateUserLanguageMutationVariables
> = gql`
  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {
    updateProfileLanguage(language: $language) {
      ...ProfileLanguages
    }
  }

  ${PROFILE_LANGUAGES_FRAGMENT}
`

export const DELETE_USER_LANGUAGES: TypedDocumentNode<
  DeleteUserLanguagesMutation,
  DeleteUserLanguagesMutationVariables
> = gql`
  mutation DeleteUserLanguages($languages: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $languages) {
      ...ProfileLanguages
    }
  }

  ${PROFILE_LANGUAGES_FRAGMENT}
`

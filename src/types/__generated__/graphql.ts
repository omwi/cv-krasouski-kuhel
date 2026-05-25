/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
export type AuthInput = {
  email: string
  password: string
}

export type CreatePositionInput = {
  name: string
}

export type CreateProfileInput = {
  first_name?: string | null | undefined
  last_name?: string | null | undefined
}

export type CreateUserInput = {
  auth: AuthInput
  cvsIds: Array<string>
  departmentId?: string | number | null | undefined
  positionId?: string | number | null | undefined
  profile: CreateProfileInput
  role: UserRole
}

export type DeleteAvatarInput = {
  userId: string | number
}

export type DeletePositionInput = {
  positionId: string | number
}

export type UpdatePositionInput = {
  name: string
  positionId: string | number
}

export type UpdateProfileInput = {
  first_name?: string | null | undefined
  last_name?: string | null | undefined
  userId: string | number
}

export type UpdateUserInput = {
  cvsIds?: Array<string> | null | undefined
  departmentId?: string | number | null | undefined
  positionId?: string | number | null | undefined
  role?: UserRole | null | undefined
  userId: string | number
}

export type UploadAvatarInput = {
  base64: string
  size: number
  type: string
  userId: string | number
}

export type UserRole = "Admin" | "Employee"

export type GetDepartmentsQueryVariables = Exact<{ [key: string]: never }>

export type GetDepartmentsQuery = {
  departments: Array<{ __typename: "Department"; id: string; name: string }>
}

export type CreatePositionMutationVariables = Exact<{
  position: CreatePositionInput
}>

export type CreatePositionMutation = {
  createPosition: { __typename: "Position"; name: string }
}

export type UpdatePositionMutationVariables = Exact<{
  position: UpdatePositionInput
}>

export type UpdatePositionMutation = {
  updatePosition: { __typename: "Position"; name: string; id: string }
}

export type DeletePositionMutationVariables = Exact<{
  position: DeletePositionInput
}>

export type DeletePositionMutation = {
  deletePosition: { __typename: "DeleteResult"; affected: number }
}

export type GetPositionsQueryVariables = Exact<{ [key: string]: never }>

export type GetPositionsQuery = {
  positions: Array<{ __typename: "Position"; id: string; name: string }>
}

export type UploadAvatarMutationVariables = Exact<{
  avatar: UploadAvatarInput
}>

export type UploadAvatarMutation = { uploadAvatar: string }

export type DeleteAvatarMutationVariables = Exact<{
  avatar: DeleteAvatarInput
}>

export type DeleteAvatarMutation = { deleteAvatar: unknown }

export type UpdateProfileMutationVariables = Exact<{
  profile: UpdateProfileInput
}>

export type UpdateProfileMutation = {
  updateProfile: {
    __typename: "Profile"
    id: string
    first_name: string | null
    last_name: string | null
    full_name: string | null
  }
}

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput
}>

export type CreateUserMutation = {
  createUser: {
    __typename: "User"
    id: string
    email: string
    role: UserRole
    department_name: string | null
    position_name: string | null
    profile: {
      __typename: "Profile"
      first_name: string | null
      last_name: string | null
    }
  }
}

export type DeleteUserMutationVariables = Exact<{
  userId: string | number
}>

export type DeleteUserMutation = {
  deleteUser: { __typename: "DeleteResult"; affected: number }
}

export type UpdateUserMutationVariables = Exact<{
  user: UpdateUserInput
}>

export type UpdateUserMutation = {
  updateUser: {
    __typename: "User"
    id: string
    department: { __typename: "Department"; id: string; name: string } | null
    position: { __typename: "Position"; id: string; name: string } | null
  }
}

export type GetUsersListQueryVariables = Exact<{ [key: string]: never }>

export type GetUsersListQuery = {
  users: Array<{
    __typename: "User"
    id: string
    email: string
    role: UserRole
    department_name: string | null
    position_name: string | null
    department: { __typename: "Department"; id: string; name: string } | null
    position: { __typename: "Position"; id: string; name: string } | null
    profile: {
      __typename: "Profile"
      avatar: string | null
      first_name: string | null
      last_name: string | null
      full_name: string | null
    }
  }>
}

export type GetUserQueryVariables = Exact<{
  userId: string | number
}>

export type GetUserQuery = {
  user: {
    __typename: "User"
    id: string
    created_at: string
    email: string
    is_verified: boolean
    role: UserRole
    profile: {
      __typename: "Profile"
      id: string
      first_name: string | null
      last_name: string | null
      full_name: string | null
      avatar: string | null
    }
    department: { __typename: "Department"; id: string; name: string } | null
    position: { __typename: "Position"; id: string; name: string } | null
  }
}

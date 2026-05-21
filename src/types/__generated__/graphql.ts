/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
export type GetUsersListQueryVariables = Exact<{ [key: string]: never }>
export type DeleteAvatarInput = {
  userId: string | number
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

export type GetUsersListQuery = {
  users: Array<{
export type GetDepartmentsQuery = {
  departments: Array<{ __typename: "Department"; id: string; name: string }>
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
  }
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

export type GetUserQueryVariables = Exact<{
  userId: string | number
}>

export type GetUserQuery = {
  user: {
    __typename: "User"
    id: string
    email: string
    department_name: string | null
    position_name: string | null
    profile: {
      __typename: "Profile"
      avatar: string | null
      first_name: string | null
      last_name: string | null
      full_name: string | null
    }
  }>
}

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
export type AddProfileSkillInput = {
  categoryId?: string | number | null | undefined
  mastery: Mastery
  name: string
  userId: string | number
}

export type AuthInput = {
  email: string
  password: string
}

export type CreateDepartmentInput = {
  name: string
}

export type CreateLanguageInput = {
  iso2: string
  name: string
  native_name?: string | null | undefined
}

export type CreatePositionInput = {
  name: string
}

export type CreateProfileInput = {
  first_name?: string | null | undefined
  last_name?: string | null | undefined
}

export type CreateProjectInput = {
  description: string
  domain: string
  end_date?: string | null | undefined
  environment: Array<string>
  name: string
  start_date: string
}

export type CreateSkillInput = {
  categoryId?: string | number | null | undefined
  name: string
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

export type DeleteDepartmentInput = {
  departmentId: string | number
}

export type DeleteLanguageInput = {
  languageId: string | number
}

export type DeletePositionInput = {
  positionId: string | number
}

export type DeleteProjectInput = {
  projectId: string | number
}

export type DeleteProfileSkillInput = {
  name: Array<string>
  userId: string | number
}

export type DeleteSkillInput = {
  skillId: string | number
}

export type Mastery =
  | "Advanced"
  | "Competent"
  | "Expert"
  | "Novice"
  | "Proficient"

export type UpdateDepartmentInput = {
  departmentId: string | number
  name: string
}

export type UpdateLanguageInput = {
  iso2: string
  languageId: string | number
  name: string
  native_name?: string | null | undefined
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

export type UpdateProjectInput = {
  description: string
  domain: string
  end_date?: string | null | undefined
  environment: Array<string>
  name: string
  projectId: string | number
  start_date: string
}

export type UpdateProfileSkillInput = {
  categoryId?: string | number | null | undefined
  mastery: Mastery
  name: string
  userId: string | number
}

export type UpdateSkillInput = {
  categoryId?: string | number | null | undefined
  name: string
  skillId: string | number
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

export type CreateDepartmentMutationVariables = Exact<{
  department: CreateDepartmentInput
}>

export type CreateDepartmentMutation = {
  createDepartment: { __typename: "Department"; name: string }
}

export type UpdateDepartmentMutationVariables = Exact<{
  department: UpdateDepartmentInput
}>

export type UpdateDepartmentMutation = {
  updateDepartment: { __typename: "Department"; name: string; id: string }
}

export type DeleteDepartmentMutationVariables = Exact<{
  department: DeleteDepartmentInput
}>

export type DeleteDepartmentMutation = {
  deleteDepartment: { __typename: "DeleteResult"; affected: number }
}

export type GetDepartmentsQueryVariables = Exact<{ [key: string]: never }>

export type GetDepartmentsQuery = {
  departments: Array<{ __typename: "Department"; id: string; name: string }>
}

export type CreateLanguageMutationVariables = Exact<{
  language: CreateLanguageInput
}>

export type CreateLanguageMutation = {
  createLanguage: {
    __typename: "Language"
    iso2: string
    name: string
    native_name: string | null
  }
}

export type UpdateLanguageMutationVariables = Exact<{
  language: UpdateLanguageInput
}>

export type UpdateLanguageMutation = {
  updateLanguage: {
    __typename: "Language"
    id: string
    iso2: string
    name: string
    native_name: string | null
  }
}

export type DeleteLanguageMutationVariables = Exact<{
  language: DeleteLanguageInput
}>

export type DeleteLanguageMutation = {
  deleteLanguage: { __typename: "DeleteResult"; affected: number }
}

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never }>

export type GetLanguagesQuery = {
  languages: Array<{
    __typename: "Language"
    id: string
    iso2: string
    name: string
    native_name: string | null
  } | null>
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

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectInput
}>

export type CreateProjectMutation = {
  createProject: {
    __typename: "Project"
    name: string
    description: string
    domain: string
    environment: Array<string>
    start_date: string
    end_date: string | null
  }
}

export type UpdateProjectMutationVariables = Exact<{
  project: UpdateProjectInput
}>

export type UpdateProjectMutation = {
  updateProject: {
    __typename: "Project"
    id: string
    name: string
    description: string
    domain: string
    environment: Array<string>
    start_date: string
    end_date: string | null
  }
}

export type DeleteProjectMutationVariables = Exact<{
  project: DeleteProjectInput
}>

export type DeleteProjectMutation = {
  deleteProject: { __typename: "DeleteResult"; affected: number }
}

export type GetProjectsQueryVariables = Exact<{ [key: string]: never }>

export type GetProjectsQuery = {
  projects: Array<{
    __typename: "Project"
    id: string
    name: string
    internal_name: string
    description: string
    domain: string
    environment: Array<string>
    start_date: string
    end_date: string | null
  }>
}

export type CreateSkillMutationVariables = Exact<{
  skill: CreateSkillInput
}>

export type CreateSkillMutation = {
  createSkill: {
    __typename: "Skill"
    id: string
    name: string
    created_at: string
  }
}

export type UpdateSkillMutationVariables = Exact<{
  skill: UpdateSkillInput
}>

export type UpdateSkillMutation = {
  updateSkill: {
    __typename: "Skill"
    id: string
    name: string
    created_at: string
  }
}

export type DeleteSkillMutationVariables = Exact<{
  skill: DeleteSkillInput
}>

export type DeleteSkillMutation = {
  deleteSkill: { __typename: "DeleteResult"; affected: number }
}

export type SkillsQueryVariables = Exact<{ [key: string]: never }>

export type SkillsQuery = {
  skills: Array<{
    __typename: "Skill"
    id: string
    name: string
    category_name: string | null
    category_parent_name: string | null
    created_at: string
    category: {
      __typename: "SkillCategory"
      id: string
      name: string
      order: number
    } | null
  }>
}

export type SkillCategoriesQueryVariables = Exact<{ [key: string]: never }>

export type SkillCategoriesQuery = {
  skillCategories: Array<{
    __typename: "SkillCategory"
    id: string
    name: string
    order: number
    parent: {
      __typename: "SkillCategory"
      id: string
      name: string
      order: number
    } | null
    children: Array<{
      __typename: "SkillCategory"
      id: string
      name: string
      order: number
    }>
  }>
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

export type AddUserSkillMutationVariables = Exact<{
  skill: AddProfileSkillInput
}>

export type AddUserSkillMutation = {
  addProfileSkill: {
    __typename: "Profile"
    id: string
    skills: Array<{
      __typename: "SkillMastery"
      name: string
      categoryId: string | null
      mastery: Mastery
    }>
  }
}

export type UpdateUserSkillMutationVariables = Exact<{
  skill: UpdateProfileSkillInput
}>

export type UpdateUserSkillMutation = {
  updateProfileSkill: {
    __typename: "Profile"
    id: string
    skills: Array<{
      __typename: "SkillMastery"
      name: string
      categoryId: string | null
      mastery: Mastery
    }>
  }
}

export type DeleteUserSkillsMutationVariables = Exact<{
  skills: DeleteProfileSkillInput
}>

export type DeleteUserSkillsMutation = {
  deleteProfileSkill: {
    __typename: "Profile"
    id: string
    skills: Array<{
      __typename: "SkillMastery"
      name: string
      categoryId: string | null
      mastery: Mastery
    }>
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
    created_at: string
    email: string
    role: UserRole
    is_verified: boolean
    department_name: string | null
    position_name: string | null
    department: { __typename: "Department"; id: string; name: string } | null
    position: { __typename: "Position"; id: string; name: string } | null
    profile: {
      __typename: "Profile"
      id: string
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

export type GetUserSkillsQueryVariables = Exact<{
  userId: string | number
}>

export type GetUserSkillsQuery = {
  profile: {
    __typename: "Profile"
    id: string
    skills: Array<{
      __typename: "SkillMastery"
      name: string
      categoryId: string | null
      mastery: Mastery
    }>
  }
}

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
export type GetUsersListQueryVariables = Exact<{ [key: string]: never }>

export type GetUsersListQuery = {
  users: Array<{
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

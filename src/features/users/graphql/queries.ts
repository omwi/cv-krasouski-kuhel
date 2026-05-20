import { gql } from "@apollo/client"

export const GET_USERS_LIST = gql`
  query GetUsersList {
    users {
      id
      email
      department_name
      position_name
      profile {
        avatar
        first_name
        last_name
        full_name
      }
    }
  }
`

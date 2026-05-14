import { gql } from "@apollo/client"

export const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        role
        email
      }
    }
  }
`

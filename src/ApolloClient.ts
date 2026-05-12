import { HttpLink } from "@apollo/client"
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs"

const url = process.env.VITE_GRAPHQL_URL
  ? process.env.VITE_GRAPHQL_URL
  : "http://localhost:3001/api/graphql"

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: url,
      fetchOptions: {},
    }),
  })
})

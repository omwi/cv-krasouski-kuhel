import { cookies } from "next/headers"
import { ApolloLink, CombinedGraphQLErrors, HttpLink } from "@apollo/client"
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs"
import { SetContextLink } from "@apollo/client/link/context"
import { ErrorLink } from "@apollo/client/link/error"

import { env } from "./config/env"

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const httpLink = new HttpLink({
    uri: env.API_URL,
  })

  const authLink = new SetContextLink(async (prevContext) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    return {
      headers: {
        ...(prevContext.headers as Record<string, string> | undefined),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  })

  const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(({ message }) => {
        console.error("[Server Apollo] GraphQL Error:", message)
      })
    } else {
      console.error("[Server Apollo] Network Error:", error)
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, errorLink, httpLink]),
  })
})

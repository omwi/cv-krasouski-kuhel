"use client"

import { HttpLink } from "@apollo/client"
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs"

import { env } from "@/config/env"

function makeClient() {
  const httpLink = new HttpLink({
    uri: env.API_URL,
    fetchOptions: {},
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}

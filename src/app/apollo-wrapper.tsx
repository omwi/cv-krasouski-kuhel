"use client"

import {
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  Observable,
} from "@apollo/client"
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs"
import { ErrorLink } from "@apollo/client/link/error"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"
import { broadcastAuthEvent } from "@/features/auth/lib/auth-channel"

function clearAuthAndRedirect() {
  fetch(API_ENDPOINTS.auth.logout, { method: "POST" }).finally(() => {
    window.location.href = paths.auth.login.get()
  })
}

let isRefreshing = false
let pendingRequests: (() => void)[] = []

const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback())
  pendingRequests = []
}

function makeClient() {
  const httpLink = new HttpLink({
    uri: API_ENDPOINTS.graphql,
    credentials: "same-origin",
  })

  const errorLink = new ErrorLink(({ error, operation, forward }) => {
    const isUnauthorized =
      (CombinedGraphQLErrors.is(error) &&
        error.errors.some(
          (e) =>
            e.message === "Unauthorized" ||
            e.extensions?.code === "UNAUTHENTICATED"
        )) ||
      (error instanceof Error &&
        "statusCode" in error &&
        (error as { statusCode?: number }).statusCode === 401)

    if (!isUnauthorized) {
      console.error("[Apollo Error]", error)
      return
    }

    if (!isRefreshing) {
      isRefreshing = true

      const refreshPromise = fetch(API_ENDPOINTS.auth.refresh, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((response) => {
          if (!response.ok) {
            throw new Error("Refresh failed")
          }
          broadcastAuthEvent({ type: "TOKEN_REFRESHED" })
          resolvePendingRequests()
          return true
        })
        .catch((err) => {
          pendingRequests = []
          clearAuthAndRedirect()
          throw err
        })
        .finally(() => {
          isRefreshing = false
        })

      return new Observable<ApolloLink.Result>((observer) => {
        refreshPromise
          .then(() => {
            forward(operation).subscribe(observer)
          })
          .catch((err) => observer.error(err))
      })
    } else {
      return new Observable<ApolloLink.Result>((observer) => {
        pendingRequests.push(() => {
          forward(operation).subscribe(observer)
        })
      })
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, httpLink]),
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}

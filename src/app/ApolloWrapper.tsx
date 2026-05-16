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

import { broadcastAuthEvent } from "@/lib/auth/authChannel"

function clearAuthAndRedirect() {
  fetch("/api/auth/logout", { method: "POST" }).finally(() => {
    window.location.href = "/auth/login"
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
    uri: "/api/graphql",
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

      const refreshPromise = fetch("/api/auth/refresh", {
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

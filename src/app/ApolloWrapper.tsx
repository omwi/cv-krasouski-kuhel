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
import { SetContextLink } from "@apollo/client/link/context"
import { ErrorLink } from "@apollo/client/link/error"

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return undefined
}

function clearAuthAndRedirect() {
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  document.cookie =
    "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  window.location.href = "/auth/login"
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

  const authLink = new SetContextLink((prevContext) => {
    const token = getCookie("access_token")
    return {
      headers: {
        ...(prevContext.headers as Record<string, string> | undefined),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
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

    const refreshToken = getCookie("refresh_token")

    if (!refreshToken) {
      clearAuthAndRedirect()
      return
    }

    if (!isRefreshing) {
      isRefreshing = true

      const refreshPromise = fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              updateToken {
                access_token
                refresh_token
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.errors || !response.data?.updateToken) {
            throw new Error("Refresh failed")
          }

          const { access_token, refresh_token } = response.data.updateToken as {
            access_token: string
            refresh_token: string
          }

          document.cookie = `access_token=${access_token}; path=/;`
          document.cookie = `refresh_token=${refresh_token}; path=/;`

          resolvePendingRequests()
          return access_token
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
          .then((newAccessToken: string) => {
            operation.setContext((ctx: Record<string, unknown>) => ({
              ...ctx,
              headers: {
                ...(ctx.headers as Record<string, string> | undefined),
                Authorization: `Bearer ${newAccessToken}`,
              },
            }))
            forward(operation).subscribe(observer)
          })
          .catch((err) => observer.error(err))
      })
    } else {
      return new Observable<ApolloLink.Result>((observer) => {
        pendingRequests.push(() => {
          const newAccessToken = getCookie("access_token")
          operation.setContext((ctx: Record<string, unknown>) => ({
            ...ctx,
            headers: {
              ...(ctx.headers as Record<string, string> | undefined),
              Authorization: `Bearer ${newAccessToken}`,
            },
          }))
          forward(operation).subscribe(observer)
        })
      })
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, errorLink, httpLink]),
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}

import { paths } from "@/config/paths"
import { pathWithoutLocale } from "@/utils/path-without-locale"

const AUTH_ROUTES = [
  paths.auth.login.get(),
  paths.auth.signup.get(),
  paths.auth.forgotPassword.get(),
]

export function isAuthRoute(pathname: string): boolean {
  const path = pathWithoutLocale(pathname)
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/")
  )
}

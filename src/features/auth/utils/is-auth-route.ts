import { paths } from "@/config/paths"
import { pathWithoutLocale } from "@/utils/url"

const AUTH_ROUTES = [
  paths.auth.login.get(),
  paths.auth.signup.get(),
  paths.auth.forgotPassword.get(),
  paths.auth.resetPassword.get(),
]

export function isAuthRoute(pathname: string): boolean {
  const path = pathWithoutLocale(pathname)
  return AUTH_ROUTES.some((route) => {
    const basePath = route.split("?")[0]
    return path === basePath || path.startsWith(basePath + "/")
  })
}

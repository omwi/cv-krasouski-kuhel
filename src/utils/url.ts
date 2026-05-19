import { pathWithoutLocale } from "./path-without-locale"

export const isEqualPath = (path1: string, path2: string): boolean => {
  const normalize = (p: string) => {
    const withoutLocale = pathWithoutLocale(p)
    return withoutLocale.replace(/\/$/, "") || "/"
  }
  return normalize(path1) === normalize(path2)
}

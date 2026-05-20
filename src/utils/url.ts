export const isEqualPath = (path1: string, path2: string): boolean => {
  const normalize = (p: string) => {
    const withoutLocale = pathWithoutLocale(p)
    return withoutLocale.replace(/\/$/, "") || "/"
  }
  return normalize(path1) === normalize(path2)
}

export const pathWithoutLocale = (pathname: string): string => {
  return pathname.replace(/^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?(\/|$)/, "/")
}

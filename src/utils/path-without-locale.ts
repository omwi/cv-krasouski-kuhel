export const pathWithoutLocale = (pathname: string): string => {
  return pathname.replace(/^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?(\/|$)/, "/")
}

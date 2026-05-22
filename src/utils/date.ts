export function toHumanDate(date: Date, locale: Intl.LocalesArgument): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return formatter.format(date).replaceAll(",", "")
}

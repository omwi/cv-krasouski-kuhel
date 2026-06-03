const formattersCache = new Map<string, Intl.DateTimeFormat>()

export function toHumanDate(date: Date, locale: Intl.LocalesArgument): string {
  const localeKey = String(locale || "default")
  let formatter = formattersCache.get(localeKey)

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    formattersCache.set(localeKey, formatter)
  }

  return formatter.format(date).replaceAll(",", "")
}

const rangeFormatters = new Map<string, Intl.DateTimeFormat>()

export function toHumanRange(
  locale: string,
  tillNow: string,
  startDate: Date,
  endDate?: Date
) {
  let formatter = rangeFormatters.get(locale)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      month: "numeric",
      year: "numeric",
    })
    rangeFormatters.set(locale, formatter)
  }

  if (!endDate) {
    return formatter.format(startDate) + " – " + tillNow
  }
  return formatter.format(startDate) + " – " + formatter.format(endDate)
}

export function parseUtcToLocal(dateStr?: string) {
  if (!dateStr) return undefined
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return undefined
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

export function parseLocalToUtcString(date?: Date) {
  if (!date) return ""
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  ).toISOString()
}

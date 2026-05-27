import { useT } from "next-i18next/client"
import { FieldValues } from "react-hook-form"

import { FormDateRangePickerProps } from "@/components/shared/form/form-date-range-picker"

export function toHumanDate(date: Date, locale: Intl.LocalesArgument): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return formatter.format(date).replaceAll(",", "")
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

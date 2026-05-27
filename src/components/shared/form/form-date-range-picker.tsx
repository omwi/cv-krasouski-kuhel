"use client"

import { useT } from "next-i18next/client"
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form"

import { Field, FieldError } from "@/components/ui/field"
import { FloatingDatePicker } from "@/components/ui/floating-date-picker"
import { parseLocalToUtcString, parseUtcToLocal } from "@/utils/date"

export type FormDateRangePickerProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>
  startName: Path<TFieldValues>
  endName: Path<TFieldValues>
  isSubmitting?: boolean
}

export function FormDateRangePicker<TFieldValues extends FieldValues>({
  form,
  startName,
  endName,
  isSubmitting,
}: FormDateRangePickerProps<TFieldValues>) {
  const {
    control,
    watch,
    formState: { errors },
  } = form
  const { t } = useT("input")

  const startDate = watch(startName)
  const endDate = watch(endName)

  const parsedStartDate = parseUtcToLocal(startDate)
  const parsedEndDate = parseUtcToLocal(endDate)

  return (
    <div className="grid grid-cols-2 gap-5">
      <Controller
        control={control}
        name={startName}
        render={({ field }) => (
          <Field>
            <FloatingDatePicker
              id={startName}
              label={t("start-date")}
              value={parseUtcToLocal(field.value)}
              onChange={(date) => field.onChange(parseLocalToUtcString(date))}
              disabled={isSubmitting}
              disabledDate={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (date > today) return true

                if (parsedEndDate) {
                  if (date > parsedEndDate) return true
                }
                return false
              }}
            />
            {errors[startName] && (
              <FieldError className="mt-1">
                {errors[startName]?.message as string}
              </FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        control={control}
        name={endName}
        render={({ field }) => (
          <Field>
            <FloatingDatePicker
              id={endName}
              label={t("end-date")}
              value={parseUtcToLocal(field.value)}
              onChange={(date) => field.onChange(parseLocalToUtcString(date))}
              disabled={isSubmitting}
              disabledDate={(date) => {
                if (!parsedStartDate) return false
                return date < parsedStartDate
              }}
            />
            {errors[endName] && (
              <FieldError className="mt-1">
                {errors[endName]?.message as string}
              </FieldError>
            )}
          </Field>
        )}
      />
    </div>
  )
}

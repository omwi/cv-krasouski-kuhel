"use client"

import { Ref, useId } from "react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Locale } from "react-day-picker"
import { ru } from "react-day-picker/locale"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FloatingLabel } from "@/components/ui/floating-label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const localeMap: Record<string, Locale> = {
  ru: ru,
  en: enUS,
}

export type FloatingDatePickerProps = {
  label: string
  id?: string
  value?: Date | undefined
  onChange?: (date?: Date) => void
  disabled?: boolean
  required?: boolean
  disabledDate?: (date: Date) => boolean
  className?: string
}

export function FloatingDatePicker({
  label,
  id,
  value,
  onChange,
  disabled,
  required,
  disabledDate,
  className,
  ref,
}: FloatingDatePickerProps & { ref?: Ref<HTMLButtonElement> }) {
  const generatedId = useId()
  const resolvedId = id || generatedId
  const { i18n } = useTranslation()
  const currentLocale = localeMap[i18n.language] || enUS
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={resolvedId}
            ref={ref}
            variant="outline"
            data-empty={!value}
            disabled={disabled}
            className={cn(
              "peer text h-12 w-full justify-between rounded-none px-3 py-1 text-left font-normal text-foreground hover:border-foreground hover:bg-transparent focus:bg-transparent active:bg-transparent aria-expanded:bg-transparent",
              "focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:border-primary",
              className
            )}
          >
            {value ? (
              format(value, "PPP", { locale: currentLocale })
            ) : (
              <span className="opacity-0">Pick a date</span>
            )}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 text-foreground"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={disabledDate}
            locale={currentLocale}
          />
        </PopoverContent>
      </Popover>
      <FloatingLabel
        htmlFor={resolvedId}
        required={required}
        className={cn(
          "peer-data-[empty=true]:top-1/2 peer-data-[empty=true]:-translate-y-1/2 peer-data-[empty=true]:scale-100",
          "peer-data-[state=open]:top-2 peer-data-[state=open]:-translate-y-4 peer-data-[state=open]:scale-75 peer-data-[state=open]:px-2 peer-data-[state=open]:text-primary"
        )}
      >
        {label}
      </FloatingLabel>
    </div>
  )
}

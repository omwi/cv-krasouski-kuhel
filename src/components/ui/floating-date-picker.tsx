import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FloatingLabel } from "@/components/ui/floating-label-input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface FloatingDatePickerProps {
  label: string
  id?: string
  value?: Date | undefined
  onChange?: (date?: Date) => void
  disabled?: boolean
  disabledDate?: (date: Date) => boolean
  className?: string
}

export const FloatingDatePicker = React.forwardRef<
  HTMLButtonElement,
  FloatingDatePickerProps
>(({ label, id, value, onChange, disabled, disabledDate, className }, ref) => {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
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
              format(value, "PPP")
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
          />
        </PopoverContent>
      </Popover>
      <FloatingLabel
        htmlFor={id}
        className={cn(
          "peer-data-[empty=true]:top-1/2 peer-data-[empty=true]:-translate-y-1/2 peer-data-[empty=true]:scale-100",
          "peer-data-[state=open]:top-2 peer-data-[state=open]:-translate-y-4 peer-data-[state=open]:scale-75 peer-data-[state=open]:px-2 peer-data-[state=open]:text-primary"
        )}
      >
        {label}
      </FloatingLabel>
    </div>
  )
})
FloatingDatePicker.displayName = "FloatingDatePicker"

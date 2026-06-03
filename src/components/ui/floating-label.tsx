import { ComponentProps } from "react"
import { Label } from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

export type FloatingLabelProps = ComponentProps<typeof Label> & {
  required?: boolean
}

export function FloatingLabel({
  className,
  ref,
  children,
  required,
  ...props
}: FloatingLabelProps) {
  return (
    <Label
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-s-2 top-2 z-10 origin-left -translate-y-4 scale-75 transform cursor-text bg-background px-2 text-sm text-input duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-hover:text-foreground peer-focus:top-2 peer-focus:w-fit peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus-visible:text-primary rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
        className
      )}
      {...props}
    >
      {children}
      {required && <span> *</span>}
    </Label>
  )
}

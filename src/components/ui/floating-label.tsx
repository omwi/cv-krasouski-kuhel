import { ComponentProps } from "react"
import { Label } from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

export type FloatingLabelProps = ComponentProps<typeof Label>

export function FloatingLabel({
  className,
  ref,
  ...props
}: FloatingLabelProps) {
  return (
    <Label
      ref={ref}
      className={cn(
        "peer-has-focus:primary pointer-events-none absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-background px-2 text-sm text-input duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-hover:text-foreground peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
        className
      )}
      {...props}
    />
  )
}

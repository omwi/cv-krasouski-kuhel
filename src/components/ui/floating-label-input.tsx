import * as React from "react"
import { Label } from "@radix-ui/react-label"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const FloatingLabel: React.FC<React.ComponentProps<typeof Label>> = ({
  className,
  ...props
}) => {
  return (
    <Label
      className={cn(
        "peer-has-focus:primary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-background px-2 text-sm text-input duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-hover:text-foreground peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
        className
      )}
      {...props}
    />
  )
}

export const FloatingInput: React.FC<
  React.ComponentProps<"input"> & {
    label: string
  }
> = ({ id, label, className, ...props }) => {
  return (
    <div className="relative">
      <Input
        id={id}
        className={cn("peer", className)}
        placeholder=" "
        {...props}
      />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  )
}

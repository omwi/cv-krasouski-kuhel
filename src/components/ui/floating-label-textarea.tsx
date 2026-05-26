import * as React from "react"

import { FloatingLabel } from "@/components/ui/floating-label-input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const FloatingTextarea: React.FC<
  React.ComponentProps<typeof Textarea> & {
    label: string
  }
> = ({ id, label, className, ...props }) => {
  return (
    <div className="relative">
      <Textarea
        id={id}
        className={cn("peer min-h-[100px] resize-y", className)}
        placeholder=" "
        {...props}
      />
      <FloatingLabel
        htmlFor={id}
        className="peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0"
      >
        {label}
      </FloatingLabel>
    </div>
  )
}

import { ComponentProps, useId } from "react"

import { FloatingLabel } from "@/components/ui/floating-label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type FloatingTextareaProps = ComponentProps<typeof Textarea> & {
  label: string
}

export function FloatingTextarea({
  id,
  label,
  className,
  ref,
  ...props
}: FloatingTextareaProps) {
  const generatedId = useId()
  const resolvedId = id || generatedId

  return (
    <div className="relative">
      <Textarea
        ref={ref}
        id={resolvedId}
        className={cn("peer min-h-[100px] resize-y", className)}
        placeholder=" "
        {...props}
      />
      <FloatingLabel
        htmlFor={resolvedId}
        className="peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0"
      >
        {label}
      </FloatingLabel>
    </div>
  )
}

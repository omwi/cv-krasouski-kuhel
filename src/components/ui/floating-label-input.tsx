import { ComponentProps, useId } from "react"

import { FloatingLabel } from "@/components/ui/floating-label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type FloatingInputProps = ComponentProps<"input"> & {
  label: string
}

export function FloatingInput({
  id,
  label,
  className,
  ref,
  ...props
}: FloatingInputProps) {
  const generatedId = useId()
  const resolvedId = id || generatedId

  return (
    <div className="relative">
      <Input
        ref={ref}
        id={resolvedId}
        className={cn("peer", className)}
        placeholder=" "
        {...props}
      />
      <FloatingLabel htmlFor={resolvedId} required={props.required}>
        {label}
      </FloatingLabel>
    </div>
  )
}

"use client"

import { ReactNode, useId, useState } from "react"

import { FloatingLabel } from "@/components/ui/floating-label"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type FloatingSelectProps = {
  id?: string
  label: string
  children: ReactNode
} & Omit<
  React.ComponentProps<typeof Select>,
  "open" | "onOpenChange" | "defaultOpen"
>

export function FloatingSelect({
  id,
  label,
  value,
  children,
  ...props
}: FloatingSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const generatedId = useId()
  const resolvedId = id || generatedId

  return (
    <div className="relative w-full">
      <Select value={value} open={isOpen} onOpenChange={setIsOpen} {...props}>
        <SelectTrigger
          id={resolvedId}
          data-empty={!value}
          className="peer h-12 w-full border border-input bg-transparent px-3 text-left text-base text-secondary-foreground transition-colors outline-none select-none hover:border-foreground focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:border-primary"
        >
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent position="popper">{children}</SelectContent>
      </Select>
      <FloatingLabel
        htmlFor={resolvedId}
        required={props.required}
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

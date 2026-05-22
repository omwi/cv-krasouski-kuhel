"use client"

import * as React from "react"
import { ReactNode, useState } from "react"

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type FloatingSelectProps = {
  id: string
  label: string
  value: string
  onValueChange: (val: string) => void
  disabled?: boolean
  children: ReactNode
}

export function FloatingSelect({
  id,
  label,
  value,
  onValueChange,
  disabled,
  children,
}: FloatingSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasValue = !!value
  const isFloating = hasValue || isOpen

  return (
    <div className="relative w-full">
      <Select
        value={value}
        onValueChange={onValueChange}
        open={isOpen}
        onOpenChange={setIsOpen}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className="peer h-12 w-full border border-input bg-transparent px-3 text-left text-base text-secondary-foreground transition-colors outline-none select-none hover:border-foreground focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:border-primary"
        >
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent position="popper">{children}</SelectContent>
      </Select>
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute inset-s-2 z-10 origin-left transform cursor-text bg-background px-2 text-sm transition-all duration-300",
          isFloating
            ? "top-2 -translate-y-4 scale-75"
            : "top-1/2 -translate-y-1/2 scale-100",
          isOpen ? "text-primary" : "text-input"
        )}
      >
        {label}
      </label>
    </div>
  )
}

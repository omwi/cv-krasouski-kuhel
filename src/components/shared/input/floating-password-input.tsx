"use client"

import * as React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { FloatingInput } from "@/components/ui/floating-label-input"
import { cn } from "@/lib/utils"

export type FloatingPasswordInputProps = Omit<
  React.ComponentProps<typeof FloatingInput>,
  "type"
> & {
  showToggle?: boolean
}

const FloatingPasswordInput = React.forwardRef<
  HTMLInputElement,
  FloatingPasswordInputProps
>(({ disabled, showToggle = true, className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  const canToggle = !disabled && showToggle

  return (
    <div className="relative w-full">
      <FloatingInput
        type={showPassword && !disabled ? "text" : "password"}
        disabled={disabled}
        className={cn(canToggle && "pr-10", className)}
        ref={ref}
        {...props}
      />
      {canToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-hidden"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
})

FloatingPasswordInput.displayName = "FloatingPasswordInput"

export { FloatingPasswordInput }

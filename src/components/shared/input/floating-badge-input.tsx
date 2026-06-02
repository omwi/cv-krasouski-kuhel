import { ComponentProps, KeyboardEvent, MouseEvent, useId } from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { FloatingLabel } from "@/components/ui/floating-label"
import { Input } from "@/components/ui/input"
import {
  TagsInput,
  TagsInputInput,
  TagsInputList,
} from "@/components/ui/tags-input"
import { cn } from "@/lib/utils"

export type FloatingBadgeInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange"
> & {
  label: string
  value?: string[]
  onValueChange?: (value: string[]) => void
  required?: boolean
}

export default function FloatingBadgeInput({
  id: providedId,
  label,
  className,
  value = [],
  onValueChange,
  required,
  ...props
}: FloatingBadgeInputProps) {
  const generatedId = useId()
  const id = providedId || generatedId

  const safeValues = Array.isArray(value) ? value : []
  const hasValues = safeValues.length > 0

  const handleRemove = (
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
    optionValue: string
  ) => {
    e.stopPropagation()
    e.preventDefault()
    if (onValueChange) {
      const currentValues = safeValues.filter((v) => v !== optionValue)
      onValueChange(currentValues)
    }
  }

  return (
    <div
      className={cn("group relative w-full", className)}
      data-has-values={hasValues}
    >
      <TagsInput
        value={safeValues}
        onValueChange={onValueChange}
        className="w-full"
        editable
        addOnPaste
      >
        <TagsInputList className="relative w-full">
          {safeValues.map((res) => (
            <Badge
              key={res}
              className="flex items-center gap-1 py-0.5 pr-1 pl-2 text-xs"
            >
              <span>{res}</span>
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer rounded-full p-0.5 outline-none hover:bg-muted focus:ring-1 focus:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleRemove(e, res)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => handleRemove(e, res)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </div>
            </Badge>
          ))}

          <TagsInputInput id={id} placeholder=" " className="peer" {...props} />

          <FloatingLabel
            htmlFor={id}
            required={required}
            className={cn(
              "group-data-[has-values=true]:top-2! group-data-[has-values=true]:-translate-y-4! group-data-[has-values=true]:scale-75!",
              "peer-[:not(:placeholder-shown)]:top-2! peer-[:not(:placeholder-shown)]:-translate-y-4! peer-[:not(:placeholder-shown)]:scale-75!"
            )}
          >
            {label}
          </FloatingLabel>
        </TagsInputList>
      </TagsInput>
    </div>
  )
}

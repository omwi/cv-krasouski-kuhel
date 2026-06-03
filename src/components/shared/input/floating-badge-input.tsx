import { ComponentProps, useId } from "react"
import { useT } from "next-i18next/client"

import { FloatingLabel } from "@/components/ui/floating-label"
import { Input } from "@/components/ui/input"
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
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
  const { t } = useT("input")
  const safeValues = Array.isArray(value) ? value : []
  const hasValues = safeValues.length > 0

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
            <TagsInputItem isBadge={true} key={res} value={res}>
              {res}
            </TagsInputItem>
          ))}

          <TagsInputInput
            id={id}
            placeholder={t("add-res")}
            className="peer"
            {...props}
          />

          <FloatingLabel
            htmlFor={id}
            required={required}
            className={cn(
              "group-data-[has-values=true]:top-2! group-data-[has-values=true]:w-fit group-data-[has-values=true]:-translate-y-4! group-data-[has-values=true]:scale-75!",
              "peer-[:not(:placeholder-shown)]:top-2! peer-[:not(:placeholder-shown)]:w-fit peer-[:not(:placeholder-shown)]:-translate-y-4! peer-[:not(:placeholder-shown)]:scale-75!",
              "w-[calc(100%-20px)] max-w-80"
            )}
          >
            {label}
          </FloatingLabel>
        </TagsInputList>
      </TagsInput>
    </div>
  )
}

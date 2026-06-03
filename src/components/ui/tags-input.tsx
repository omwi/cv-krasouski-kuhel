import type * as React from "react"
import * as TagsInputPrimitive from "@diceui/tags-input"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TagsInputItemProps extends React.ComponentProps<
  typeof TagsInputPrimitive.Item
> {
  isBadge?: boolean
}

function TagsInput({
  className,
  ...props
}: React.ComponentProps<typeof TagsInputPrimitive.Root>) {
  return (
    <TagsInputPrimitive.Root
      data-slot="tags-input"
      className={cn("flex w-95 flex-col gap-2", className)}
      {...props}
    />
  )
}

function TagsInputLabel({
  className,
  ...props
}: React.ComponentProps<typeof TagsInputPrimitive.Label>) {
  return (
    <TagsInputPrimitive.Label
      data-slot="tags-input-label"
      className={cn(
        "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

function TagsInputList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tags-input-list"
      className={cn(
        "flex min-h-12 w-full flex-wrap items-center gap-1.5 border border-input bg-background px-3 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50",

        "hover:border-foreground",

        "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",

        "hover:focus-within:border-primary",

        className
      )}
      {...props}
    />
  )
}
function TagsInputInput({
  className,
  ...props
}: React.ComponentProps<typeof TagsInputPrimitive.Input>) {
  return (
    <TagsInputPrimitive.Input
      data-slot="tags-input-input"
      className={cn(
        "flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
function TagsInputItem({
  className,
  children,
  isBadge,
  ...props
}: TagsInputItemProps) {
  return (
    <TagsInputPrimitive.Item
      data-slot="tags-input-item"
      asChild={isBadge}
      className={className}
      {...props}
    >
      {isBadge ? (
        <Badge>
          <TagsInputPrimitive.ItemText className="truncate">
            {children}
          </TagsInputPrimitive.ItemText>
          <TagsInputPrimitive.ItemDelete className="size-4 shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="size-3.5" />
          </TagsInputPrimitive.ItemDelete>
        </Badge>
      ) : (
        <>
          <TagsInputPrimitive.ItemText className="truncate">
            {children}
          </TagsInputPrimitive.ItemText>
          <TagsInputPrimitive.ItemDelete className="size-4 shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="size-3.5" />
          </TagsInputPrimitive.ItemDelete>
        </>
      )}
    </TagsInputPrimitive.Item>
  )
}

function TagsInputClear({
  ...props
}: React.ComponentProps<typeof TagsInputPrimitive.Clear>) {
  return <TagsInputPrimitive.Clear data-slot="tags-input-clear" {...props} />
}

export {
  TagsInput,
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputLabel,
  TagsInputList,
}

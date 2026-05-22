import React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<typeof Button> & {
  children: React.ReactNode
}

export default function IconButton({
  children,
  className,
  variant,
  ...props
}: Props) {
  return (
    <Button
      {...props}
      variant={variant ?? "ghost"}
      className={cn(
        "inline-flex aspect-square min-w-0 items-center justify-center text-foreground",
        className
      )}
    >
      {children}
    </Button>
  )
}

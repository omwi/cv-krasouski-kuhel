import React from "react"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"

type Props = React.PropsWithChildren & React.ComponentProps<typeof Button>

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

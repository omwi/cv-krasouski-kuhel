"use client"

import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  onClick: () => void
  disabled?: boolean
  hidden?: boolean
  "data-testid"?: string
}

export default function SelectForDeletionButton({
  label,
  onClick,
  disabled,
  hidden,
  "data-testid": dataTestId,
}: Props) {
  return (
    <Button
      variant={"ghost-primary"}
      disabled={disabled}
      className={cn("gap-4", hidden && "hidden")}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <Trash className="size-6" />
      <span>{label}</span>
    </Button>
  )
}

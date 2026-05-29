"use client"

import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  onClick: () => void
  disabled?: boolean
  hidden?: boolean
}

export default function SelectForDeletionButton({
  label,
  onClick,
  disabled,
  hidden,
}: Props) {
  return (
    <Button
      variant={"ghost-primary"}
      disabled={disabled}
      className={cn("gap-4", hidden && "hidden")}
      onClick={onClick}
    >
      <Trash className="size-6" />
      <span>{label}</span>
    </Button>
  )
}

"use client"

import { usePathname } from "next/navigation"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import Actions from "./actions"

type Props = {
  children: React.ReactNode
}

export default function ActionsPopover({ children }: Props) {
  // using key because openState/Popover.Close causes popover to flash on closing
  const pathname = usePathname()

  return (
    <Popover key={pathname}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mx-4 w-50 rounded-xs p-0 shadow-lg" side="top">
        <Actions />
      </PopoverContent>
    </Popover>
  )
}

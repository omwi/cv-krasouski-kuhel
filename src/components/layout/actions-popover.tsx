import Actions from "@/components/layout/actions"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  children: React.ReactNode
}

export default function ActionsPopover({ children }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mx-4 w-50 rounded-xs p-0 shadow-lg" side="top">
        <Actions />
      </PopoverContent>
    </Popover>
  )
}

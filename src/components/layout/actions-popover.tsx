import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import Actions from "./actions"

type Props = React.PropsWithChildren

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

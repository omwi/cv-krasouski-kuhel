import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type Props = React.PropsWithChildren

export default function ActionsPopover({ children }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mx-4" side="top">
        <div>Actions</div>
      </PopoverContent>
    </Popover>
  )
}

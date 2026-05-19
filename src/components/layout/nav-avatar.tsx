import { useReactiveVar } from "@apollo/client/react"

import { authUserVar } from "@/lib/apollo/auth-var"
import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

const user = {
  email: "bsuiromwi@gmail.com",
  avatarSrc: "",
}

type Props = React.ComponentPropsWithRef<typeof Button> & {
  isCollapsed?: boolean
}

export default function NavAvatar({ className, variant, ...props }: Props) {
  const user = useReactiveVar(authUserVar)

  if (!user) return null

  return (
    <Button
      {...props}
      variant={variant ?? "ghost"}
      className={cn(
        className,
        "my-auto flex h-10 min-w-0 flex-row items-center justify-center gap-2 rounded-[200px] pr-2 pl-0 text-foreground",
        "md:h-14 md:flex-none md:justify-start md:rounded-l-none md:px-2 md:py-2",
        "hover:bg-avatar-actions-hover"
      )}
    >
      <Avatar>
        <AvatarImage src={user.avatarSrc ?? ""} />
        <AvatarFallback className="bg-avatar-nav">
          {user.email[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "min-w-0 overflow-hidden text-base font-normal text-ellipsis"
        )}
      >
        {user.email}
      </span>
    </Button>
  )
}

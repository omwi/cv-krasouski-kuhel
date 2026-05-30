import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMeQuery } from "@/features/auth/hooks/use-get-me"
import { cn } from "@/lib/utils"

type Props = React.ComponentPropsWithRef<typeof Button> & {
  isCollapsed?: boolean
}

export default function NavAvatar({ className, variant, ...props }: Props) {
  const { user, loading } = useGetMeQuery()

  if (loading) {
    return (
      <Button variant="ghost">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </Button>
    )
  }

  if (!user) return null

  const displayName = user.fullName || user.email

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
          {displayName[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "min-w-0 overflow-hidden text-base font-normal text-ellipsis"
        )}
      >
        {displayName}
      </span>
    </Button>
  )
}

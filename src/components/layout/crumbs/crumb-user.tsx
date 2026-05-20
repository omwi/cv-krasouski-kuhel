import { Users } from "lucide-react"

import { Crumb } from "@/components/layout/crumbs/crumb"

type Props = {
  userId: number
  href: string
  isPage: boolean
}

export default function CrumbUser({ userId, href, isPage }: Props) {
  // todo: useUser
  const fullName = "John Doe"

  const label = fullName || userId

  return (
    <Crumb href={href} isPrimary={true} isPage={isPage}>
      <div className="flex flex-row gap-2">
        <Users />
        <span>{label}</span>
      </div>
    </Crumb>
  )
}

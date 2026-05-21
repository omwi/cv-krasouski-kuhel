import { useQuery } from "@apollo/client/react"
import { Users } from "lucide-react"

import Crumb from "@/components/layout/crumbs/crumb"
import { GET_USER } from "@/features/users/graphql/users/queries"

type Props = {
  userId: number
  href: string
  isPage: boolean
}

export default function CrumbUser({ userId, href, isPage }: Props) {
  const { data } = useQuery(GET_USER, { variables: { userId } })
  const label = data?.user?.profile?.full_name ?? userId

  return (
    <Crumb href={href} isPrimary={true} isPage={isPage}>
      <div className="flex flex-row gap-2">
        <Users />
        <span>{label}</span>
      </div>
    </Crumb>
  )
}

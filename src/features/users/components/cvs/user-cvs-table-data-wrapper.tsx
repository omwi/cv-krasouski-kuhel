"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import { useGetMeQuery } from "@/features/auth/hooks/use-get-me"
import CvsTable from "@/features/cvs/components/table/cvs-table"
import { GET_USER_CVS } from "@/graphql/users/queries"

export default function UserCvsTableDataWrapper({
  userId,
}: {
  userId: string
}) {
  const { data } = useSuspenseQuery(GET_USER_CVS, { variables: { userId } })
  const { user } = useGetMeQuery()
  return <CvsTable cvs={data.user.cvs ?? []} user={user} ownerId={userId} />
}

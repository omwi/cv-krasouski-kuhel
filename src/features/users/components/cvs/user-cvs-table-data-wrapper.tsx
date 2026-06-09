"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import CvsTable from "@/features/cvs/components/table/cvs-table"
import { GET_USER_CVS } from "@/graphql/users/queries"

export default function UserCvsTableDataWrapper({
  userId,
}: {
  userId: string
}) {
  const { data } = useSuspenseQuery(GET_USER_CVS, { variables: { userId } })
  return <CvsTable cvs={data.user.cvs ?? []} ownerId={userId} />
}

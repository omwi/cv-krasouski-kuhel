"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import CvsTable from "@/features/cvs/components/table/cvs-table"
import { GET_USER_CVS } from "@/graphql/users/queries"
import { CurrentUser } from "@/utils/permissions"

export default function UserCvsTableDataWrapper({
  currentUser,
  userId,
}: {
  currentUser: CurrentUser
  userId: string
}) {
  const { data } = useSuspenseQuery(GET_USER_CVS, { variables: { userId } })
  return (
    <CvsTable
      cvs={data.user.cvs ?? []}
      currentUser={currentUser}
      userId={userId}
    />
  )
}

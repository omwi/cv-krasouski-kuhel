"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import CvsTable from "@/features/cvs/components/table/cvs-table"
import { GET_CVS } from "@/graphql/cvs/queries"
import { CurrentUser } from "@/utils/permissions"

export default function CvsTableDataWrapper({
  currentUser,
}: {
  currentUser: CurrentUser
}) {
  const { data } = useSuspenseQuery(GET_CVS)
  return <CvsTable cvs={data.cvs} currentUser={currentUser} />
}

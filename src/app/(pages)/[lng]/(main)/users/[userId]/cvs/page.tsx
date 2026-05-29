import { getT } from "next-i18next/server"

import { query } from "@/apollo-client"
import CvsTable from "@/features/cvs/components/table/cvs-table"
import { GET_USER_CVS } from "@/graphql/users/queries"
import { Cv } from "@/types/graphql-types"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("user-cvs.title"),
    description: t("user-cvs.description"),
  }
}

export default async function UserCvsPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const currentUser = await getCurrentUser()

  const { userId } = await params
  const { data } = await query({ query: GET_USER_CVS, variables: { userId } })
  const cvs: Cv[] = data?.user.cvs ?? []

  return <CvsTable currentUser={currentUser} cvs={cvs} userId={userId} />
}

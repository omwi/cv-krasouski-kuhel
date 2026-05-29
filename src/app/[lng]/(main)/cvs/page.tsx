import { getT } from "next-i18next/server"

import { query } from "@/apollo-client"
import CvsTable from "@/features/cvs/components/table/cvs-table"
import { GET_CVS } from "@/graphql/cvs/queries"
import { Cv } from "@/types/graphql-types"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("cvs.title"),
    description: t("cvs.description"),
  }
}

export default async function Cvs() {
  const currentUser = await getCurrentUser()
  const { data } = await query({ query: GET_CVS })
  const cvs: Cv[] = data?.cvs ?? []

  return <CvsTable currentUser={currentUser} cvs={cvs} />
}

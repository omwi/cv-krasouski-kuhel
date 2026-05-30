import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import CvsTableDataWrapper from "@/features/cvs/components/table/cvs-table-data-wrapper"
import { GET_CVS } from "@/graphql/cvs/queries"
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

  return (
    <PreloadQuery query={GET_CVS}>
      <CvsTableDataWrapper currentUser={currentUser} />
    </PreloadQuery>
  )
}

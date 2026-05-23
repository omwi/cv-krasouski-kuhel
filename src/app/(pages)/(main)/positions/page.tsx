import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import PositionsTable from "@/features/positions/components/table/positions-table"
import { GET_POSITIONS } from "@/graphql/positions/queries"
import { getCurrentUser } from "@/utils/permissions"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("positions.title"),
    description: t("positions.description"),
  }
}

export default async function Positions() {
  const currentUser = await getCurrentUser()

  return (
    <PreloadQuery query={GET_POSITIONS}>
      <PositionsTable currentUser={currentUser} />
    </PreloadQuery>
  )
}

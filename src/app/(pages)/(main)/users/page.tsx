import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import UsersTable from "@/features/users/components/users-table"
import { GET_USERS_LIST } from "@/features/users/graphql/queries"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("users.title"),
    description: t("users.description"),
  }
}

export default function Users() {
  return (
    <PreloadQuery query={GET_USERS_LIST}>
      <UsersTable />
    </PreloadQuery>
  )
}

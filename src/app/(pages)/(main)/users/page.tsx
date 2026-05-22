import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import UsersTable from "@/features/users/components/user-table/users-table"
import { GET_USERS_LIST } from "@/graphql/users/queries"
import { getCurrentUser } from "@/utils/permissions"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("users.title"),
    description: t("users.description"),
  }
}

export default async function Users() {
  const currentUser = await getCurrentUser()

  return (
    <PreloadQuery query={GET_USERS_LIST}>
      <UsersTable currentUser={currentUser} />
    </PreloadQuery>
  )
}
